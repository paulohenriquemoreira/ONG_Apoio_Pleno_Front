import { useState, useEffect } from "react";
import {
  FaWheelchairMove,
  FaPlus,
  FaPen,
  FaScrewdriverWrench,
  FaRegTrashCan,
} from "react-icons/fa6";
import {
  ModalCadastro,
  ModalEdicao,
  ModalExclusao,
  ModalManutencao,
} from "../components/ModalEquipamentos/index.js";

export default function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalManutencaoAberto, setModalManutencaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);

  const buscarDadosApi = async () => {
    try {
      const resposta = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/equipamentos",
      );
      const dados = await resposta.json();
      setEquipamentos(dados);
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error);
    }
  };

  useEffect(() => {
    buscarDadosApi();
  }, []);

  const abrirEdicao = (equipamento) => {
    setEquipamentoSelecionado(equipamento);
    setModalEdicaoAberto(true);
  };

  const abrirManutencao = (equipamento) => {
    setEquipamentoSelecionado(equipamento);
    setModalManutencaoAberto(true);
  };

  const abrirExclusao = (equipamento) => {
    setEquipamentoSelecionado(equipamento);
    setModalExclusaoAberto(true);
  };

  return (
    <main
      role="main"
      className="space-y-8 animate-fade-in p-4 sm:p-6"
      aria-labelledby="titulo-equipamentos"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1
          id="titulo-equipamentos"
          className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2"
        >
          <FaWheelchairMove className="text-blue-600" aria-hidden="true" />
          <span>Gestão de Equipamentos</span>
        </h1>
        <button
          onClick={() => setModalCadastroAberto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <FaPlus aria-hidden="true" /> Novo Equipamento
        </button>
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead className="hidden sm:table-header-group bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Série</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {equipamentos.map((item) => (
                <tr
                  key={item.id}
                  className="flex flex-col sm:table-row p-4 border-b sm:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  {/* Nome */}
                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Nome:
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-900">
                      {item.nome}
                    </span>
                  </td>

                  {/* Categoria */}
                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Categoria:
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700">
                      {item.categoria}
                    </span>
                  </td>

                  {/* Série */}
                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Série:
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700">
                      {item.numero_serie || "N/A"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Status:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase inline-block ${
                        item.status === "Disponível"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Em manutenção"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="flex sm:table-cell py-3 sm:p-4 mt-2 sm:mt-0 items-center">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden">
                      Ações:
                    </span>
                    <div className="flex gap-4">
                      <button
                        onClick={() => abrirManutencao(item)}
                        className="text-orange-500 hover:text-orange-700 transition p-1"
                        title="Manutenção"
                      >
                        <FaScrewdriverWrench size={18} />
                      </button>
                      <button
                        onClick={() => abrirEdicao(item)}
                        className="text-blue-600 hover:text-blue-800 transition p-1"
                        title="Editar"
                      >
                        <FaPen size={18} />
                      </button>
                      <button
                        onClick={() => abrirExclusao(item)}
                        className="text-red-600 hover:text-red-800 transition p-1"
                        title="Excluir"
                      >
                        <FaRegTrashCan size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ModalCadastro
        isOpen={modalCadastroAberto}
        onClose={() => setModalCadastroAberto(false)}
        equipamentos={equipamentos}
        atualizarLista={buscarDadosApi}
      />
      <ModalEdicao
        isOpen={modalEdicaoAberto}
        onClose={() => {
          setModalEdicaoAberto(false);
          setEquipamentoSelecionado(null);
        }}
        equipamento={equipamentoSelecionado}
        equipamentos={equipamentos}
        atualizarLista={buscarDadosApi}
      />
      <ModalManutencao
        isOpen={modalManutencaoAberto}
        onClose={() => {
          setModalManutencaoAberto(false);
          setEquipamentoSelecionado(null);
        }}
        equipamento={equipamentoSelecionado}
        atualizarLista={buscarDadosApi}
      />
      <ModalExclusao
        isOpen={modalExclusaoAberto}
        onClose={() => {
          setModalExclusaoAberto(false);
          setEquipamentoSelecionado(null);
        }}
        equipamento={equipamentoSelecionado}
        atualizarLista={buscarDadosApi}
      />
    </main>
  );
}
