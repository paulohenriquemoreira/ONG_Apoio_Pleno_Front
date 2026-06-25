import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/LogoApoioPleno.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [carregando, setCarregando] = useState(false);
  
  const navigate = useNavigate(); 
  const API_URL = "https://ong-apoio-pleno-api.onrender.com/api/usuarios/login"; 

  const fazerLogin = async (e) => {
    e.preventDefault(); 
    setError('');
    setCarregando(true);

    try {
      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        sessionStorage.setItem('ong_user', JSON.stringify(dados.usuario));
        navigate('/dashboard'); 
      } else {
        setError(dados.mensagem || 'Erro ao fazer login.');
      }
    } catch (error) {
      console.error(error);
      setError('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      {/* 📱 Responsividade: p-6 no mobile e p-8 a partir de telas pequenas (sm:) */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-100">
        
        <div className="flex justify-center mb-8">
          <img className="w-32" src={Logo} alt="Logo ONG Apoio Pleno" />
        </div>

        {/* Acessibilidade: role="alert" avisa o leitor de tela imediatamente sobre o erro */}
        {error && (
          <div role="alert" className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg text-sm font-medium">
            <p>{error}</p>
          </div>
        )}

        {/* Acessibilidade: aria-busy indica que o formulário está processando dados */}
        <form onSubmit={fazerLogin} className="space-y-6" aria-busy={carregando}>
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1">
              E-mail
            </label>
            <input 
              id="login-email"
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
              placeholder="seu-email@exemplo.com"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-400 transition-all text-sm"
            />
          </div>

          <div>
            <label htmlFor="login-senha" className="block text-sm font-medium text-slate-700 mb-1">
              Senha
            </label>
            <input 
              id="login-senha"
              type="password" 
              required 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)}
              disabled={carregando}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-400 transition-all text-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {carregando ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Acessando o painel...</span>
              </>
            ) : (
              "Entrar no Sistema"
            )}
          </button>

          {/* CORREÇÃO DA ACESSIBILIDADE DO LINK ESQUECI A SENHA */}
          <div className="flex justify-center text-sm text-slate-600">
            <p>Esqueci a senha:</p>
            <button 
              type="button"
              disabled={carregando}
              aria-label="Recuperar minha senha de acesso" /* ♿ O leitor de tela lê a intenção real */
              className="ml-1 text-blue-600 hover:text-blue-800 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition-all cursor-pointer"
            >
              Clique aqui!
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}