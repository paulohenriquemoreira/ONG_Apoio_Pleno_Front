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

  // Implementação da busca na API
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
      className="space-y-8 p-4 sm:p-0 animate-fade-in"
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
          <FaPlus aria-hidden="true" /> Adicionar
        </button>
      </header>

      {/* Tabela de Equipamentos */}
      <section
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        aria-label="Lista de equipamentos"
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
              <tr>
                <th className="p-4">Nome</th>
                <th className="p-4">Categoria</th>
                <th className="p-4">Série</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {equipamentos.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium">{item.nome}</td>
                  <td className="p-4">{item.categoria}</td>
                  <td className="p-4">{item.numero_serie}</td>
                  <td className="p-4">{item.status}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => abrirManutencao(item)}
                        className="text-orange-500 hover:text-orange-700 p-2"
                        aria-label={`Manutenção ${item.nome}`}
                      >
                        <FaScrewdriverWrench />
                      </button>
                      <button
                        onClick={() => abrirEdicao(item)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        aria-label={`Editar ${item.nome}`}
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => abrirExclusao(item)}
                        className="text-red-600 hover:text-red-800 p-2"
                        aria-label={`Excluir ${item.nome}`}
                      >
                        <FaRegTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modais */}
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
