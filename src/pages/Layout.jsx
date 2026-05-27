import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/LogoApoioPleno.png";
import {
  FaHouse,
  FaUserGroup,
  FaWheelchairMove,
  FaFileLines,
  FaWrench,
  FaGift,
  FaTruck,
  FaBars,
  FaMagnifyingGlass,
  FaUser,
  FaChevronDown,
  FaArrowRightFromBracket
} from "react-icons/fa6"; // Adicionei os ícones que faltavam para o header e botão sair

function Layout() {
  const navigate = useNavigate();

  // Controla o menu mobile
  const [menuAberto, setMenuAberto] = useState(false);

  const usuarioTexto = sessionStorage.getItem("ong_user");
  const usuario = usuarioTexto ? JSON.parse(usuarioTexto) : { nome: "Admin" };

  const fazerLogout = () => {
    sessionStorage.removeItem("ong_user");
    navigate("/");
  };

  const fecharMenu = () => setMenuAberto(false);

  const menuItems = [
    { id: 1, label: "Dashboard", icon: FaHouse, path: "/dashboard" },
    { id: 2, label: "Beneficiários", icon: FaUserGroup, path: "/beneficiarios" },
    { id: 3, label: "Equipamentos", icon: FaWheelchairMove, path: "/equipamentos" },
    { id: 4, label: "Empréstimos", icon: FaFileLines, path: "/emprestimos" },
    { id: 5, label: "Manutenções", icon: FaWrench, path: "/manutencoes" },
    { id: 6, label: "Doações", icon: FaGift, path: "/doacoes" },
    { id: 7, label: "Entregas", icon: FaTruck, path: "/entregas" },
  ];

  return (
    <section className="flex h-screen bg-slate-50 relative overflow-hidden">
      
      {/* OVERLAY MOBILE: Fundo escuro quando o menu abre no celular */}
      {menuAberto && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={fecharMenu}
        ></div>
      )}

      {/* ASIDE: Menu Lateral*/}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-slate-300 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          menuAberto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* LOGO */}
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-center h-20">
          <img className="w-32" src={Logo} alt="Logo ONG Apoio Pleno" />
        </div>
        
        {/* NAVEGAÇÃO */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                
                <Link 
                  to={item.path} 
                  onClick={fecharMenu} 
                  className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
                >
                  <item.icon className="text-xl text-slate-400 group-hover:text-blue-500 transition-colors" title={item.label} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* BOTÃO SAIR */}
        <button
          onClick={fazerLogout}
          className="flex items-center gap-4 w-full px-7 py-5 text-slate-400 hover:text-white hover:bg-slate-800 border-t border-slate-700/50 transition-colors"
        >
          <FaArrowRightFromBracket className="text-xl" />
          <span className="font-medium">Sair</span>
        </button>
      </aside>

      {/* ÁREA PRINCIPAL DA TELA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER (Barra Superior Branca) */}
        <header className="h-20 bg-white px-4 md:px-8 flex items-center justify-between border-b border-gray-200">
          
          <div className="flex items-center gap-4 w-full max-w-md">
            {/* Hambúrguer Mobile */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xl" 
              onClick={() => setMenuAberto(true)}
            >
              <FaBars />
            </button>
            
            {/* Barra de Busca */}
            <div className="relative w-full hidden sm:block">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="search" 
                placeholder="Buscar por nome/CPF..."
                className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 outline-none transition-all"
              />
            </div>
          </div>

          {/* Perfil do Usuário*/}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg">
              <FaUser />
            </div>
            <span className="text-sm text-slate-700 font-medium hidden md:block">{usuario.nome}</span>
            <FaChevronDown className="text-xs text-slate-400 hidden md:block" />
          </div>

        </header>

        {/* OUTLET: Onde o conteúdo das páginas vai aparecer */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>

      </main>
    </section>
  );
}

export default Layout;