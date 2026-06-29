import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
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

  // Assimila a propriedade capturada externamente via roteamento central.
  const [termoBusca] = useOutletContext();

  // Aciona um linkamento assíncrono para colher os parâmetros presentes na tabela processando falhas isoladamente.
  const buscarDadosApi = async () => {
    try {
      const resposta = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/equipamentos",
      );
      const dados = await resposta.json();
      // Isola e colhe os itens inativos que aguardam conserto na interface.
      setEquipamentos(dados.filter((e) => e.status === "Em manutenção"));
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    buscarDadosApi();
  }, []);

  // Extrai as frações identificadas atreladas à digitação comparativa processada em nível condicional.
  const manutencoesFiltradas = equipamentos.filter((item) => {
    const termo = termoBusca ? termoBusca.toLowerCase() : "";
    const nome = item.nome ? item.nome.toLowerCase() : "";
    return nome.includes(termo);
  });

  const abrirFinalizacao = (item) => {
    setEquipamentoSelecionado(item);
    setModalFinalizarAberto(true);
  };

  const abrirDevolucao = (item) => {
    setEquipamentoSelecionado(item);
    setModalDevolucaoAberto(true);
  };

  return (
    <main
      role="main"
      className="space-y-8 animate-fade-in p-4 sm:p-6"
      aria-labelledby="pagina-manutencoes"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            id="pagina-manutencoes"
            className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2"
          >
            <FaScrewdriverWrench className="text-blue-600" aria-hidden="true" />
            <span>Oficina / Manutenção</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Gerenciamento de equipamentos em reparo.
          </p>
        </div>
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead className="hidden sm:table-header-group bg-slate-50 border-b text-xs font-bold uppercase text-slate-600">
              <tr>
                <th className="p-4">Equipamento</th>
                <th className="p-4">Data/Previsão</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {/* Disponibiliza o escopo formatado de visualização atrelada ao rastreio acionado continuamente. */}
              {manutencoesFiltradas.map((item) => (
                <tr
                  key={item.id}
                  className="flex flex-col sm:table-row p-4 border-b sm:border-b-0 hover:bg-slate-50 transition-colors"
                >
                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Equipamento:
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-900">
                      {item.nome}
                    </span>
                  </td>

                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Data:
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700">
                      {item.observacoes || "N/A"}
                    </span>
                  </td>

                  <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                    <span className="font-bold text-[10px] text-slate-400 uppercase w-20 sm:hidden shrink-0 mt-0.5">
                      Status:
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase bg-orange-100 text-orange-700 inline-block">
                      {item.status}
                    </span>
                  </td>

                  <td className="flex sm:table-cell py-3 sm:p-4 mt-2 sm:mt-0 items-center justify-center">
                    <div className="flex gap-4">
                      <button
                        onClick={() => abrirFinalizacao(item)}
                        className="text-green-600 hover:text-green-800 transition p-1"
                        title="Finalizar"
                      >
                        <FaCheck size={18} />
                      </button>
                      <button
                        onClick={() => abrirDevolucao(item)}
                        className="text-yellow-600 hover:text-yellow-800 transition p-1"
                        title="Devolver"
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
