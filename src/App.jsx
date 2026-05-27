import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Beneficiarios from './pages/Beneficiarios';
// ... outras importações
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout'; // 👈 A importação do ficheiro que acabou de criar!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* O Layout envolve todas as páginas que precisam do menu lateral */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/beneficiarios" element={<Beneficiarios />} />
          {/* As outras rotas entram aqui... */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;