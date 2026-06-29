import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaPlus, FaBoxOpen, FaCircleInfo, FaBan } from "react-icons/fa6";
import {
  ModalNova,
  ModalDetalhes,
  ModalCancelamento,
} from "../components/ModalEntrega/Index.js";

export default function Entregas() {
  const [entregas, setEntregas] = useState([]);
  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [modalCancelamentoAberto, setModalCancelamentoAberto] = useState(false);
  const [entregaSelecionada, setEntregaSelecionada] = useState(null);

  // Captura o padrão de busca exposto pelo layout centralizado acoplado em nível de aplicação global.
  const [termoBusca] = useOutletContext();

  // Executa uma rotina contínua acionando as variáveis armazenadas processando erros de maneira isolada.
  const buscarEntregas = async () => {
    try {
      const res = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/entregas",
      );
      const dados = await res.json();
      setEntregas(Array.isArray(dados) ? dados : []);
    } catch (e) {
      console.error("Erro ao buscar entregas:", e);
      setEntregas([]);
    }
  };

  useEffect(() => {
    buscarEntregas();
  }, []);

  // Extrai as frações identificadas repassando elementos específicos atrelados condicionalmente ao status.
  const entregasFiltradas = entregas.filter((e) => {
    const termo = termoBusca ? termoBusca.toLowerCase() : "";
    const nome = e.beneficiario_nome ? e.beneficiario_nome.toLowerCase() : "";
    return nome.includes(termo);
  });

  const abrirDetalhes = (item) => {
    setEntregaSelecionada(item);
    setModalDetalhesAberto(true);
  };

  const abrirCancelamento = (item) => {
    setEntregaSelecionada(item);
    setModalCancelamentoAberto(true);
  };

  return (
    <main
      role="main"
      className="space-y-8 animate-fade-in p-4 sm:p-6"
      aria-labelledby="titulo-entregas"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            id="titulo-entregas"
            className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2"
          >
            <FaBoxOpen className="text-blue-600" aria-hidden="true" />
            <span>Gestão de Entregas</span>
          </h1>
        </div>
        <button
          onClick={() => setModalNovaAberto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <FaPlus aria-hidden="true" /> Nova Entrega
        </button>
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="hidden sm:table-header-group bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Beneficiário</th>
              <th className="p-4">Itens</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {/* Disponibiliza o escopo formatado de visualização contínua das linhas processadas condicionalmente. */}
            {entregasFiltradas.map((e) => (
              <tr
                key={e.id}
                className="flex flex-col sm:table-row p-4 border-b sm:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-center justify-between sm:justify-start">
                  <span className="font-bold text-[12px] text-slate-400 uppercase w-24 sm:hidden shrink-0 mt-0.5">
                    Data:
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700">
                    {e.data_entrega}
                  </span>
                </td>

                <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-center justify-between sm:justify-start">
                  <span className="font-bold text-[12px] text-slate-400 uppercase w-24 sm:hidden shrink-0 mt-0.5">
                    Beneficiário:
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-900">
                    {e.beneficiario_nome}
                  </span>
                </td>

                <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-center justify-between sm:justify-start">
                  <span className="font-bold text-[12px] text-slate-400 uppercase w-24 sm:hidden shrink-0 mt-0.5">
                    Itens:
                  </span>
                  <span className="text-slate-700 text-xs sm:text-sm">
                    {e.itens_quantidade || 0} itens
                  </span>
                </td>

                <td className="flex sm:table-cell py-3 sm:p-4 mt-2 sm:mt-0 items-center justify-between sm:justify-center">
                  <span className="font-bold text-[12px] text-slate-400 uppercase w-24 sm:hidden">
                    Ações:
                  </span>
                  <div className="flex gap-4 justify-end sm:justify-center w-full">
                    <button
                      onClick={() => abrirDetalhes(e)}
                      className="text-blue-600 hover:text-blue-800 transition p-1"
                      title="Detalhes"
                    >
                      <FaCircleInfo size={18} />
                    </button>
                    <button
                      onClick={() => abrirCancelamento(e)}
                      className="text-red-600 hover:text-red-800 transition p-1"
                      title="Cancelar"
                    >
                      <FaBan size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <ModalNova
        isOpen={modalNovaAberto}
        onClose={() => setModalNovaAberto(false)}
        atualizarLista={buscarEntregas}
      />
      <ModalDetalhes
        isOpen={modalDetalhesAberto}
        onClose={() => {
          setModalDetalhesAberto(false);
          setEntregaSelecionada(null);
        }}
        entrega={entregaSelecionada}
      />
      <ModalCancelamento
        isOpen={modalCancelamentoAberto}
        onClose={() => {
          setModalCancelamentoAberto(false);
          setEntregaSelecionada(null);
        }}
        entrega={entregaSelecionada}
        atualizarLista={buscarEntregas}
      />
    </main>
  );
}
