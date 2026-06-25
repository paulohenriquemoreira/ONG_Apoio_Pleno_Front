import { useState, useEffect } from "react";
import {
  FaWheelchairMove,
  FaPlus,
} from "react-icons/fa6";

export default function Equipamentos() {



  // Estados para controlar a visibilidade de cada Modal
  const [modalCadastroEqtsAberto, setModalCadastroEqtsAberto] = useState(false);



  return (
    <main
      role="main"
      className="space-y-8 animate-fade-in p-4 sm:p-0"
      aria-label="Página de Gestão de Beneficiários"
    >
      {/* CABEÇALHO DA PÁGINA */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            id="titulo-pagina"
            className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2"
          >
            <FaWheelchairMove className="text-blue-600" aria-hidden="true" />
            <span>Gestão de Equipamentos</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Gerencie os equipamentos disponíveis, emprestados e em manutenção.
          </p>
        </div>

        <button
          onClick={() => setModalCadastroEqtsAberto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <FaPlus aria-hidden="true" />
          <span>Adicionar Equipamento</span>
        </button>
      </header>
    </main>
  );
}
