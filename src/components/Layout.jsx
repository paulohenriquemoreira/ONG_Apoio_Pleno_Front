import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "../assets/LogoAside.png";
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
  FaArrowRightFromBracket,
} from "react-icons/fa6";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);

  // Extrai da memória da sessão atual as credenciais vinculadas para personalizar a visualização.
  const usuarioTexto = sessionStorage.getItem("ong_user");
  const usuario = usuarioTexto ? JSON.parse(usuarioTexto) : { nome: "Admin" };

  // Apaga as chaves criptográficas ativas e direciona os acessos novamente à base inicial do site.
  const fazerLogout = () => {
    sessionStorage.removeItem("ong_user");
    navigate("/");
  };

  const menuItems = [
    { id: 1, label: "Dashboard", icon: FaHouse, path: "/dashboard" },
    {
      id: 2,
      label: "Beneficiários",
      icon: FaUserGroup,
      path: "/beneficiarios",
    },
    {
      id: 3,
      label: "Equipamentos",
      icon: FaWheelchairMove,
      path: "/equipamentos",
    },
    { id: 4, label: "Empréstimos", icon: FaFileLines, path: "/emprestimos" },
    { id: 5, label: "Manutenções", icon: FaWrench, path: "/manutencoes" },
    { id: 6, label: "Doações", icon: FaGift, path: "/doacoes" },
    { id: 7, label: "Entregas", icon: FaTruck, path: "/entregas" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      {/* Aciona a camada escura adaptativa em dispositivos reduzidos bloqueando a área visível principal. */}
      {menuAberto && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuAberto(false)}
        ></div>
      )}

      {/* Renderiza o mapa hierárquico fixo lateral que contém a listagem de menus interativos disponíveis. */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-slate-300 flex flex-col justify-between transform transition-transform duration-300 lg:relative lg:translate-x-0 ${menuAberto ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-center h-20">
          <img className="w-35" src={Logo} alt="Logo ONG" />
        </div>

        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isAtivo = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setMenuAberto(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      isAtivo
                        ? "bg-[#1e3a8a] text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {/* Estabiliza e agrupa a referência icônica nativa de forma contínua no grid interno. */}
                    <div className="w-6 flex items-center justify-center">
                      <item.icon
                        className={`text-xl ${isAtivo ? "text-blue-400" : ""}`}
                      />
                    </div>

                    <span className="font-medium text-lg flex-1">
                      {item.label}
                    </span>

                    {/* Projeta a tag seletiva indicando fidedignamente o caminho acessado no momento pelo cliente. */}
                    {isAtivo && (
                      <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                        Ativo
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          onClick={fazerLogout}
          className="flex items-center gap-4 w-full px-7 py-5 text-slate-400 hover:text-white hover:bg-slate-800 border-t border-slate-700/50 transition-colors"
        >
          <FaArrowRightFromBracket className="text-xl" />
          <span className="font-medium">Sair</span>
        </button>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white px-4 md:px-8 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4 w-full max-w-md">
            <button
              className="lg:hidden p-2"
              onClick={() => setMenuAberto(true)}
            >
              <FaBars />
            </button>
            <div className="relative w-full hidden sm:block">
              <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                placeholder="Buscar por nome/CPF..."
                className="w-full border rounded-lg pl-10 p-2.5 outline-none"
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <FaUser />
              </div>
              <span className="text-sm text-slate-700 font-medium hidden md:block">
                {usuario.nome}
              </span>
              <FaChevronDown className="text-xs text-slate-400" />
            </button>

            {/* Disponibiliza o fluxo opcional sub-flutuante interconectado diretamente no cabeçalho. */}
            {menuPerfilAberto && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <button
                  onClick={fazerLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FaArrowRightFromBracket /> Sair
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet context={[termoBusca]} />
        </main>
      </div>
    </div>
  );
}
