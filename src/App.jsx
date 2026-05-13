// 1. Importações das ferramentas do React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 2. Importações das nossas páginas e componentes
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from '../src/components/PrivateRoute.jsx';

function App() {
  return (
    // BrowserRouter: Avisa o React que este aplicativo vai ter navegação de páginas
    <BrowserRouter>
      {/* Routes: Uma caixa que guarda todos os caminhos possíveis */}
      <Routes>
        
        {/* Route: Define um caminho único. Se a URL for "/", mostre o arquivo Login */}
        <Route path="/" element={<Login />} />
        
        {/* A MÁGICA: Se a URL for "/dashboard", o arquivo Dashboard tenta abrir, 
            MAS ele está dentro da tag <PrivateRoute>. O React vai executar o 
            PrivateRoute primeiro. Se ele deixar, o Dashboard aparece. */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* 
            No futuro, você adicionará as outras telas aqui, assim:
            <Route path="/beneficiarios" element={<PrivateRoute><Beneficiarios /></PrivateRoute>} />
            <Route path="/equipamentos" element={<PrivateRoute><Equipamentos /></PrivateRoute>} />
        */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;