import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Beneficiarios from './pages/Beneficiarios';
import Equipamentos from './pages/Equipamentos';
import Emprestimos from './pages/Emprestimos';
import Manutencoes from './pages/Manutencoes';
import Doacoes from './pages/Doacoes';
import Entregas from './pages/Entregas';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* O Layout envolve todas as páginas que precisam do menu lateral */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/beneficiarios" element={<Beneficiarios />} />
          <Route path="/equipamentos" element={<Equipamentos />} />
          <Route path="/emprestimos" element={<Emprestimos />} />          
          <Route path="/manutencoes" element={<Manutencoes />} />
          <Route path="/doacoes" element={<Doacoes />} />
          <Route path="/entregas" element={<Entregas />} />        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}