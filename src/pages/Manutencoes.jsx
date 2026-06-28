import { useState, useEffect } from "react";
import { FaScrewdriverWrench, FaCheck, FaRotateLeft } from "react-icons/fa6";
import {
  ModalDevolucao,
  ModalManutencaoFinalizar,
} from "../components/ModalManutencoes/index.js";

export default function Manutencao() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [modalFinalizarAberto, setModalFinalizarAberto] = useState(false);
  const [modalDevolucaoAberto, setModalDevolucaoAberto] = useState(false);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);

  const buscarDadosApi = async () => {
    try {
      const resposta = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/equipamentos",
      );
      const dados = await resposta.json();
      setEquipamentos(dados);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    buscarDadosApi();
  }, []);

  const abrirFinalizacao = (item) => {
    setEquipamentoSelecionado(item);
    setModalFinalizarAberto(true);
  };

  const abrirDevolucao = (item) => {
    setEquipamentoSelecionado(item);
    setModalDevolucaoAberto(true);
  };

  const emManutencao = equipamentos.filter((e) => e.status === "Em manutenção");

  return (
    <main role="main" className="space-y-8 animate-fade-in p-4 sm:p-0">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <FaScrewdriverWrench
              className="text-orange-600"
              aria-hidden="true"
            />
            <span>Oficina / Manutenção</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Gerenciamento de equipamentos em reparo.
          </p>
        </div>
      </header>

      <section
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        aria-label="Tabela de equipamentos em manutenção"
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
              <tr>
                <th className="p-4">Equipamento</th>
                <th className="p-4">Série</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {emManutencao.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-900">
                    {item.nome}
                  </td>
                  <td className="p-4">{item.numero_serie}</td>
                  <td className="p-4">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => abrirDevolucao(item)}
                        className="text-slate-600 hover:text-slate-800 p-2 transition"
                        aria-label={`Registrar devolução de ${item.nome}`}
                      >
                        <FaRotateLeft />
                      </button>
                      <button
                        onClick={() => abrirFinalizacao(item)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700 transition flex items-center gap-2"
                        aria-label={`Finalizar manutenção de ${item.nome}`}
                      >
                        <FaCheck /> Finalizar
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
      <ModalManutencaoFinalizar
        isOpen={modalFinalizarAberto}
        onClose={() => {
          setModalFinalizarAberto(false);
          setEquipamentoSelecionado(null);
        }}
        equipamento={equipamentoSelecionado}
        atualizarLista={buscarDadosApi}
      />

      <ModalDevolucao
        isOpen={modalDevolucaoAberto}
        onClose={() => {
          setModalDevolucaoAberto(false);
          setEquipamentoSelecionado(null);
        }}
        equipamento={equipamentoSelecionado}
        atualizarLista={buscarDadosApi}
      />
    </main>
  );
}
