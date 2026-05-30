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

  // Controla o menu mobile
  const [menuAberto, setMenuAberto] = useState(false);

  // Controla a barra de pesquisa no celular
  const [buscaAberta, setBuscaAberta] = useState(false);

  const usuarioTexto = sessionStorage.getItem("ong_user");
  const usuario = usuarioTexto ? JSON.parse(usuarioTexto) : { nome: "Admin" };

  const fazerLogout = () => {
    sessionStorage.removeItem("ong_user");
    navigate("/");
  };

  const fecharMenu = () => setMenuAberto(false);

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
      {/* OVERLAY MOBILE: Fundo escuro quando o menu abre no celular */}
      {menuAberto && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={fecharMenu}
        ></div>
      )}

      {/* ASIDE: Menu Lateral*/}
      <aside
        aria-label="Menu lateral principal"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-slate-300 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          menuAberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-center h-20">
          <img className="w-35" src={Logo} alt="Logo ONG Apoio Pleno" />
        </div>

        {/* NAVEGAÇÃO */}
        <nav
          aria-label="Navegação principal"
          className="flex-1 overflow-y-auto py-6"
        >
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              // Isso vai retornar 'true' ou 'false'
              const isAtivo = location.pathname === item.path;

              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={fecharMenu}
                    aria-current={isAtivo ? "page" : undefined}
                    // O TERNÁRIO NAS CLASSES DO TAILWIND:
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors group ${
                      isAtivo
                        ? "bg-[#1e3a8a] text-white" // SE VERDADEIRO: Fundo azul escuro e texto branco
                        : "text-slate-400 hover:bg-slate-800 hover:text-white" // SE FALSO: Cinza e sem fundo
                    }`}
                  >
                    <item.icon
                      className={`text-xl transition-colors ${
                        isAtivo
                          ? "text-blue-400"
                          : "text-slate-400 group-hover:text-blue-500"
                      }`}
                    />

                    {/* flex-1 empurra o que vier depois (o selo) lá para o canto direito! */}
                    <span className="font-medium text-lg flex-1">
                      {item.label}
                    </span>

                    {/* O SELO "ATIVO": Só aparece na tela se isAtivo for true! */}
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

        {/* BOTÃO SAIR */}
        <button
          type="button"
          onClick={fazerLogout}
          className="flex items-center gap-4 w-full px-7 py-5 text-slate-400 hover:text-white hover:bg-slate-800 border-t border-slate-700/50 transition-colors"
        >
          <FaArrowRightFromBracket aria-hidden="true" className="text-xl" />
          <span className="font-medium">Sair</span>
        </button>
      </aside>

      {/* ÁREA PRINCIPAL DA TELA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* HEADER (Barra Superior) */}
        <header className="h-20 bg-white px-4 md:px-8 flex items-center justify-between border-b border-gray-200">
          {/* Se a busca mobile estiver aberta, mostra SÓ a barra de pesquisa */}
          {buscaAberta ? (
            <div className="flex items-center w-full gap-2 md:hidden animate-fade-in">
              <div className="relative w-full">
                <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  aria-label="Buscar"
                  autoFocus /* já abre com o teclado pronto para digitar */
                  placeholder="Buscar..."
                  className="w-full bg-slate-100 border-none text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 block pl-10 p-2.5 outline-none"
                />
              </div>
              <button
                type="button"
                aria-label="Fechar busca"
                onClick={() => setBuscaAberta(false)}
                className="p-2 text-slate-500 hover:bg-slate-100 rounded-full font-bold"
              >
                ✕
              </button>
            </div>
          ) : (
            /* Se a busca estiver fechada (ou se estiver no Computador) */
            <>
              <div className="flex items-center gap-4 w-full max-w-md">
                {/* Hambúrguer Mobile */}
                <button
                  type="button"
                  aria-label="Abrir menu lateral"
                  aria-expanded={menuAberto}
                  className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xl"
                  onClick={() => setMenuAberto(true)}
                >
                  <FaBars aria-hidden="true" />
                </button>

                {/* Barra de Busca do Computador (Fica escondida no celular: sm:block) */}
                <div className="relative w-full hidden sm:block">
                  <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    aria-label="Buscar por nome ou CPF"
                    placeholder="Buscar por nome/CPF..."
                    className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Lado Direito: Lupa Mobile + Perfil */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Ícone de Lupa (SÓ APARECE NO CELULAR: sm:hidden) */}
                <button
                  type="button"
                  aria-label="Abrir busca"
                  className="sm:hidden p-3 text-slate-500 hover:bg-slate-100 rounded-full text-lg"
                  onClick={() => setBuscaAberta(true)}
                >
                  <FaMagnifyingGlass aria-hidden="true" />
                </button>

                {/* Perfil do Usuário */}
                <button
                  type="button"
                  aria-label="Abrir menu do usuário"
                  className=" flex items-center gap-3 p-2 rounded-lg transition-colors" 
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 hover:bg-sky-700 cursor-pointer text-white flex items-center justify-center text-lg">
                    <FaUser aria-hidden="true" />
                  </div>

                  <span className="text-sm text-slate-700 font-medium hidden md:block">
                    {usuario.nome}
                  </span>

                  <FaChevronDown
                    aria-hidden="true"
                    className="text-xs text-slate-400 hidden md:block"
                  />
                </button>
              </div>
            </>
          )}
        </header>

        {/* OUTLET: Onde o conteúdo das páginas vai aparecer */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
