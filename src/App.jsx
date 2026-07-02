import { useMemo, useState } from 'react';
import StepIndicator from './components/StepIndicator.jsx';
import Disclaimer from './components/Disclaimer.jsx';
import Step1Identificacao from './components/steps/Step1Identificacao.jsx';
import Step2Protocolo from './components/steps/Step2Protocolo.jsx';
import Step3Dados from './components/steps/Step3Dados.jsx';
import Step4Resultados from './components/steps/Step4Resultados.jsx';
import Step5Orientacao from './components/steps/Step5Orientacao.jsx';
import LoginForm from './components/auth/LoginForm.jsx';
import AlunosList from './components/alunos/AlunosList.jsx';
import FichaAluno from './components/alunos/FichaAluno.jsx';
import { useAuth } from './hooks/useAuth.js';
import { computeAssessment } from './utils/computeAssessment.js';
import { gerarOrientacao } from './calculations/index.js';
import { calcularIdade } from './utils/idade.js';
import { salvarAvaliacao } from './lib/db.js';

const initialIdentificacao = {
  nome: '', sexo: '', idade: '', peso: '', alturaCm: '',
  nivelAtividade: 'sedentario', objetivo: 'manter',
};

export default function App() {
  const { user, loading, signIn, signUp, signOut, supabaseConfigured } = useAuth();

  const [view, setView] = useState('alunos'); // 'alunos' | 'ficha' | 'avaliacao'
  const [alunoAtual, setAlunoAtual] = useState(null);

  const [step, setStep] = useState(1);
  const [identificacao, setIdentificacao] = useState(initialIdentificacao);
  const [populacao, setPopulacao] = useState(null);
  const [protocolosSelecionados, setProtocolosSelecionados] = useState([]);
  const [dobras, setDobras] = useState({});
  const [circunferencias, setCircunferencias] = useState({});
  const [fcResult, setFcResult] = useState(null);
  const [vo2Result, setVo2Result] = useState(null);

  const result = useMemo(() => {
    if (step < 4 || protocolosSelecionados.length === 0) return null;
    try {
      return computeAssessment({ identificacao, populacao, protocolosSelecionados, dobras, circunferencias });
    } catch {
      return null;
    }
  }, [step, identificacao, populacao, protocolosSelecionados, dobras, circunferencias]);

  const orientacao = useMemo(() => {
    if (!result) return null;
    return gerarOrientacao({
      populacao,
      pctG: result.pctGMedio,
      sexo: identificacao.sexo,
      objetivo: identificacao.objetivo,
      risco: result.risco,
    });
  }, [result, populacao, identificacao.sexo, identificacao.objetivo]);

  const iniciarNovaAvaliacao = (aluno) => {
    setAlunoAtual(aluno);
    setStep(1);
    setIdentificacao({
      ...initialIdentificacao,
      nome: aluno.nome,
      sexo: aluno.sexo || '',
      idade: calcularIdade(aluno.data_nascimento) ?? '',
      objetivo: aluno.objetivo || 'manter',
    });
    setPopulacao(null);
    setProtocolosSelecionados([]);
    setDobras({});
    setCircunferencias({});
    setFcResult(null);
    setVo2Result(null);
    setView('avaliacao');
  };

  const handleSalvarAvaliacao = async ({ lead }) => {
    const payload = {
      data_avaliacao: new Date().toISOString().slice(0, 10),
      populacao,
      protocolos: protocolosSelecionados,
      entradas: { identificacao, dobras, circunferencias },
      resultado_completo: { composicao: result, fc: fcResult, vo2: vo2Result, lead },
    };
    await salvarAvaliacao(alunoAtual.id, payload);
    setView('ficha');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center jsm-label">Carregando…</div>;
  }

  if (supabaseConfigured && !user) {
    return <LoginForm onSignIn={signIn} onSignUp={signUp} supabaseConfigured={supabaseConfigured} />;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-jsm-teal">JSM Avaliação Pro</h1>
          <p className="jsm-label text-sm">Avaliação física e composição corporal multiprotocolo</p>
        </div>
        <div className="flex gap-2">
          {view !== 'alunos' && (
            <button className="jsm-btn-secondary" onClick={() => setView('alunos')}>Meus alunos</button>
          )}
          {supabaseConfigured && user && (
            <button className="jsm-btn-secondary" onClick={signOut}>Sair</button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        <Disclaimer />

        {view === 'alunos' && (
          <AlunosList onSelecionar={(aluno) => { setAlunoAtual(aluno); setView('ficha'); }} />
        )}

        {view === 'ficha' && alunoAtual && (
          <FichaAluno aluno={alunoAtual} onVoltar={() => setView('alunos')} onNovaAvaliacao={iniciarNovaAvaliacao} />
        )}

        {view === 'avaliacao' && alunoAtual && (
          <>
            <button className="jsm-label text-sm underline mb-4 block" onClick={() => setView('ficha')}>
              ← Voltar para a ficha de {alunoAtual.nome}
            </button>
            <StepIndicator current={step} />

            {step === 1 && (
              <Step1Identificacao
                data={identificacao}
                onChange={setIdentificacao}
                populacao={populacao}
                onPopulacaoChange={setPopulacao}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <Step2Protocolo
                populacao={populacao}
                sexo={identificacao.sexo}
                selecionados={protocolosSelecionados}
                onChange={setProtocolosSelecionados}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <Step3Dados
                protocolosSelecionados={protocolosSelecionados}
                dobras={dobras}
                onDobrasChange={setDobras}
                circunferencias={circunferencias}
                onCircunferenciasChange={setCircunferencias}
                onBack={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            )}

            {step === 4 && result && (
              <Step4Resultados
                result={result}
                identificacao={identificacao}
                populacao={populacao}
                onFcResultChange={setFcResult}
                onVo2ResultChange={setVo2Result}
                onBack={() => setStep(3)}
                onNext={() => setStep(5)}
              />
            )}

            {step === 5 && result && orientacao && (
              <Step5Orientacao
                identificacao={identificacao}
                result={result}
                orientacao={orientacao}
                onBack={() => setStep(4)}
                onSalvar={handleSalvarAvaliacao}
              />
            )}
          </>
        )}
      </div>

      <footer className="max-w-5xl mx-auto mt-10 text-center jsm-label text-xs">
        JSM Avaliação Pro — ferramenta de apoio ao profissional. Não substitui avaliação médica.
      </footer>
    </div>
  );
}
