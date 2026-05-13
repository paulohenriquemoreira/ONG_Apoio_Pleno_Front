import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  // Função para destruir a sessão e expulsar o usuário do sistema
  const fazerLogout = () => {
    sessionStorage.removeItem('ong_user'); // Rasga o crachá
    navigate('/'); // Manda de volta pra tela de login
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Painel da ONG</h1>
      <p className="text-lg text-gray-700">Bem-vindo(a) ao sistema de gestão solidária!</p>
      
      <button 
        onClick={fazerLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow-md"
      >
        Sair do Sistema
      </button>
    </div>
  );
}

export default Dashboard;