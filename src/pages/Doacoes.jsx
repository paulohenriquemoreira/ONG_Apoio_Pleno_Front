import { useState, useEffect } from "react";
import {
  FaPlus,
  FaHandHoldingDollar,
  FaPen,
  FaRotateLeft,
} from "react-icons/fa6";
import {
  ModalNova,
  ModalEdicao,
  ModalEstorno,
} from "../components/ModalDoacao/Index.js";

export default function Doacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalEstornoAberto, setModalEstornoAberto] = useState(false);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

  const buscarDoacoes = async () => {
    try {
      const resposta = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/doacoes",
      );
      const dados = await resposta.json();
      setDoacoes(dados);
    } catch (error) {
      console.error("Erro ao buscar doações:", error);
    }
  };

  useEffect(() => {
    buscarDoacoes();
  }, []);

  const abrirEdicao = (doacao) => {
    setDoacaoSelecionada(doacao);
    setModalEdicaoAberto(true);
  };

  const abrirEstorno = (doacao) => {
    setDoacaoSelecionada(doacao);
    setModalEstornoAberto(true);
  };

  return (
    <main
      role="main"
      className="space-y-8 animate-fade-in p-4 sm:p-6"
      aria-labelledby="pagina-doacoes"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            id="pagina-doacoes"
            className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2"
          >
            <FaHandHoldingDollar className="text-blue-600" aria-hidden="true" />
            <span>Gestão de Doações</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerenciamento de doações recebidas.
          </p>
        </div>
        <button
          onClick={() => setModalNovaAberto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <FaPlus aria-hidden="true" /> Nova Doação
        </button>
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead className="hidden sm:table-header-group bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
              <tr>
                <th className="p-4">Doador</th>
                <th className="p-4">Data</th>
                <th className="p-4">Descrição</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {doacoes.map((item) => (
                <tr
                  key={item.id}
                  className="flex flex-col sm:table-row p-4 border-b sm:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Doador:
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-900">
                      {item.doador}
                    </span>
                  </td>
                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Data:
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700">
                      {item.data_doacao}
                    </span>
                  </td>
                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Desc:
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700">
                      {item.descricao}
                    </span>
                  </td>
                  <td className="flex sm:table-cell py-3 sm:p-4 mt-2 sm:mt-0 items-center">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden">
                      Ações:
                    </span>
                    <div className="flex gap-4">
                      <button
                        onClick={() => abrirEdicao(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 transition"
                        title="Editar"
                      >
                        <FaPen size={18} />
                      </button>
                      <button
                        onClick={() => abrirEstorno(item)}
                        className="text-amber-600 hover:text-amber-800 p-1 transition"
                        title="Estornar"
                      >
                        <FaRotateLeft size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ModalNova
        isOpen={modalNovaAberto}
        onClose={() => setModalNovaAberto(false)}
        atualizarLista={buscarDoacoes}
      />
      <ModalEdicao
        isOpen={modalEdicaoAberto}
        onClose={() => {
          setModalEdicaoAberto(false);
          setDoacaoSelecionada(null);
        }}
        doacao={doacaoSelecionada}
        atualizarLista={buscarDoacoes}
      />
      <ModalEstorno
        isOpen={modalEstornoAberto}
        onClose={() => {
          setModalEstornoAberto(false);
          setDoacaoSelecionada(null);
        }}
        doacao={doacaoSelecionada}
        atualizarLista={buscarDoacoes}
      />
    </main>
  );
}
