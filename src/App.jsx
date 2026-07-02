import { useMemo, useState } from 'react';
import StepIndicator from './components/StepIndicator.jsx';
import Disclaimer from './components/Disclaimer.jsx';
import Step1Identificacao from './components/steps/Step1Identificacao.jsx';
import Step2Protocolo from './components/steps/Step2Protocolo.jsx';
import Step3Dados from './components/steps/Step3Dados.jsx';
import Step4Resultados from './components/steps/Step4Resultados.jsx';
import Step5Orientacao from './components/steps/Step5Orientacao.jsx';
import { useAssessmentHistory } from './hooks/useAssessmentHistory.js';
import { computeAssessment } from './utils/computeAssessment.js';
import { gerarOrientacao } from './calculations/index.js';
import { fmtPct } from './utils/format.js';

const initialIdentificacao = {
  nome: '', sexo: '', idade: '', peso: '', alturaCm: '',
  nivelAtividade: 'sedentario', objetivo: 'manter',
};

export default function App() {
  const [step, setStep] = useState(1);
  const [identificacao, setIdentificacao] = useState(initialIdentificacao);
  const [populacao, setPopulacao] = useState(null);
  const [protocolosSelecionados, setProtocolosSelecionados] = useState([]);
  const [dobras, setDobras] = useState({});
  const [circunferencias, setCircunferencias] = useState({});
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const { historico, salvarAvaliacao, removerAvaliacao } = useAssessmentHistory();

  const result = useMemo(() => {
    if (step < 4 || protocolosSelecionados.length === 0) return null;
    try {
      return computeAssessment({ identificacao, populacao, protocolosSelecionados, dobras, circunferencias });
    } catch (e) {
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

  const novaAvaliacao = () => {
    setStep(1);
    setIdentificacao(initialIdentificacao);
    setPopulacao(null);
    setProtocolosSelecionados([]);
    setDobras({});
    setCircunferencias({});
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-jsm-teal">JSM Avaliação Pro</h1>
          <p className="jsm-label text-sm">Avaliação física e composição corporal multiprotocolo</p>
        </div>
        <div className="flex gap-2">
          <button className="jsm-btn-secondary" onClick={() => setMostrarHistorico((v) => !v)}>
            {mostrarHistorico ? 'Fechar histórico' : `Histórico (${historico.length})`}
          </button>
          <button className="jsm-btn-secondary" onClick={novaAvaliacao}>Nova avaliação</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        <Disclaimer />

        {mostrarHistorico ? (
          <div className="jsm-card">
            <h2 className="text-xl mb-4">Histórico de avaliações</h2>
            {historico.length === 0 && <p className="jsm-label text-sm">Nenhuma avaliação salva ainda.</p>}
            <div className="space-y-2">
              {historico.map((a) => (
                <div key={a.id} className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                  <div>
                    <div className="font-semibold text-sm">{a.identificacao?.nome || 'Sem nome'}</div>
                    <div className="jsm-label text-xs">
                      {new Date(a.criadoEm).toLocaleString('pt-BR')} · %G médio {fmtPct(a.result?.pctGMedio)}
                    </div>
                  </div>
                  <button className="jsm-btn-secondary" onClick={() => removerAvaliacao(a.id)}>Remover</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
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
              <Step4Resultados result={result} onBack={() => setStep(3)} onNext={() => setStep(5)} />
            )}

            {step === 5 && result && orientacao && (
              <Step5Orientacao
                identificacao={identificacao}
                result={result}
                orientacao={orientacao}
                onBack={() => setStep(4)}
                onSalvar={(payload) => {
                  salvarAvaliacao(payload);
                  setMostrarHistorico(true);
                }}
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
