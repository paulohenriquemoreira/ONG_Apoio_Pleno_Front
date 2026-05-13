import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  //Estados: Guardam o que o usuário digita no exato momento em que ele digita.
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  
  //useNavigate: A ferramenta do React Router que usamos para trocar de página via código.
  const navigate = useNavigate(); 
  
  // A URL da sua API rodando no Render
  const BASE_URL = "https://ong-apoio-pleno-api.onrender.com/"; 

  //Função disparada ao clicar no botão Entrar
  const fazerLogin = async (e) => {
    e.preventDefault(); // Impede o navegador de recarregar a página (comportamento padrão do HTML)
    setErro('');

    try {
      // Bate na porta da API
      const resposta = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        //SUCESSO: Cria o "crachá" no navegador e redireciona para a tela protegida.
        sessionStorage.setItem('ong_user', JSON.stringify(dados.usuario));
        navigate('/dashboard'); 
      } else {
        //ERRO: Mostra a mensagem vermelha enviada pelo seu Back-end
        setErro(dados.mensagem || 'Erro ao fazer login.');
      }

    } catch (error) {
      setErro('Erro ao conectar com o servidor.', error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700">Apoio Pleno</h2>
        </div>

        {/* Mostra a caixa de erro somente se a variável "erro" tiver algum texto */}
        {erro && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{erro}</p>
          </div>
        )}

        {/* Formulário chamando a função fazerLogin */}
        <form onSubmit={fazerLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;