import { useState } from 'react';

export default function LoginForm({ onSignIn, onSignUp, supabaseConfigured }) {
  const [modo, setModo] = useState('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [cadastroOk, setCadastroOk] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    const { error } = modo === 'login' ? await onSignIn(email, senha) : await onSignUp(email, senha);
    setEnviando(false);
    if (error) {
      setErro(error.message);
      return;
    }
    if (modo === 'cadastro') setCadastroOk(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="jsm-card w-full max-w-sm">
        <h1 className="text-2xl font-serif text-jsm-teal mb-1">JSM Avaliação Pro</h1>
        <p className="jsm-label text-sm mb-6">Acesso do profissional</p>

        {!supabaseConfigured && (
          <div className="bg-jsm-gold/10 border border-jsm-gold/30 rounded-lg p-3 text-xs text-jsm-gold/90 mb-4">
            Supabase não configurado (VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY ausentes). O app segue em
            modo offline, salvando localmente neste dispositivo.
          </div>
        )}

        {cadastroOk ? (
          <div className="text-sm space-y-3">
            <p>Cadastro criado. Verifique seu e-mail para confirmar a conta, depois faça login.</p>
            <button className="jsm-btn-secondary w-full" onClick={() => { setModo('login'); setCadastroOk(false); }}>
              Ir para login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="jsm-label">E-mail</label>
              <input type="email" required className="jsm-input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="jsm-label">Senha</label>
              <input type="password" required minLength={6} className="jsm-input mt-1" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </div>
            {erro && <p className="text-rose-400 text-sm">{erro}</p>}
            <button type="submit" className="jsm-btn-primary w-full" disabled={enviando}>
              {enviando ? 'Aguarde…' : modo === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
            <button
              type="button"
              className="text-jsm-label text-sm underline w-full text-center"
              onClick={() => setModo(modo === 'login' ? 'cadastro' : 'login')}
            >
              {modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
