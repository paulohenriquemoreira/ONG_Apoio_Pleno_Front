import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/LogoApoioPleno.png'

export default function Login() {
  //Estados: Guardam o que o usuário digita no exato momento em que ele digita.
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  
  //useNavigate: A ferramenta do React Router que usamos para trocar de página via código.
  const navigate = useNavigate(); 
  
  // A URL da sua API rodando no Render
  const API_URL = "https://ong-apoio-pleno-api.onrender.com/api/usuarios/login"; 

  //Função disparada ao clicar no botão Entrar
  const fazerLogin = async (e) => {
    e.preventDefault(); // Impede o navegador de recarregar a página (comportamento padrão do HTML)
    setError('');

    try {
      // Bate na porta da API
      const resposta = await fetch(API_URL, {
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
        setError(dados.mensagem || 'Erro ao fazer login.');
      }

    } catch (error) {
      setError('Erro ao conectar com o servidor.', error);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center  mb-8">
          <img className="w-32" src={Logo} alt="Logo ONG Apoio Pleno" />
        </div>

        {/* Mostra a caixa de error somente se a variável "error" tiver algum texto */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Formulário chamando a função fazerLogin */}
        <form onSubmit={fazerLogin} className="space-y-6">
          <div>
            <label className="  block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
              className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none "
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg cursor-pointer ">
            Entrar no Sistema
          </button>
          <div className='flex justify-center text-sm/1  '>
            <p>Esqueci a senha:</p>
            <span className='ml-1 cursor-pointer '>Clique aqui!</span>
          </div>
        </form>
      </div>
    </main>
  );
}