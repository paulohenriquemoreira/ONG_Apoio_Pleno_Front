import { Navigate } from 'react-router-dom';

// O "children" representa a tela que estamos tentando proteger (ex: Dashboard, Equipamentos)
export default function PrivateRoute({ children }) {
  
  //O componente "olha" no navegador do usuário para ver se a chave 'ong_user' existe.
  const usuarioLogado = sessionStorage.getItem('ong_user');

  //Se a variável estiver vazia (usuário não logou), ele usa o <Navigate> para chutar a pessoa de volta para a tela de login ("/").
  if (!usuarioLogado) {
    return <Navigate to="/" />;
  }

  //Se a chave existir, ele permite que o React renderize a tela que foi solicitada.
  return children;
}

