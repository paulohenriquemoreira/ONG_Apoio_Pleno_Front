import { useState, useEffect } from "react";
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

  const buscarEntregas = async () => {
    try {
      const res = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/entregas",
      );
      setEntregas(await res.json());
    } catch (e) {
      console.error("Erro ao buscar entregas:", e);
    }
  };

  useEffect(() => {
    buscarEntregas();
  }, []);

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
      className="space-y-8 p-4 sm:p-0 animate-fade-in"
      aria-labelledby="titulo-entregas"
    >
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1
          id="titulo-entregas"
          className="text-2xl font-bold flex items-center gap-2 text-slate-800"
        >
          <FaBoxOpen className="text-blue-600" aria-hidden="true" /> Entregas
        </h1>
        <button
          onClick={() => setModalNovaAberto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
        >
          <FaPlus aria-hidden="true" /> Nova Entrega
        </button>
      </header>

      <section
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        aria-label="Tabela de entregas"
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left min-w-[600px] border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <tr>
                <th className="p-4">Data</th>
                <th className="p-4">Beneficiário</th>
                <th className="p-4">Itens</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {entregas.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="p-4">{e.data_entrega}</td>
                  <td className="p-4">{e.beneficiario_nome}</td>
                  <td className="p-4">{e.itens_quantidade} itens</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => abrirDetalhes(e)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        aria-label={`Ver detalhes da entrega para ${e.beneficiario_nome}`}
                      >
                        <FaCircleInfo />
                      </button>
                      <button
                        onClick={() => abrirCancelamento(e)}
                        className="text-red-600 hover:text-red-800 p-2"
                        aria-label={`Cancelar entrega para ${e.beneficiario_nome}`}
                      >
                        <FaBan />
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
