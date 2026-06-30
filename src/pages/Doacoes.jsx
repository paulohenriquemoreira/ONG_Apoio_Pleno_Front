import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaPlus, FaHandHoldingDollar, FaPen } from "react-icons/fa6";
import { ModalNova, ModalEdicao } from "../components/ModalDoacao/index.js";

export default function Doacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

  // Captura os valores de busca inseridos no layout base, possibilitando cruzamentos dinâmicos internos.
  const [termoBusca] = useOutletContext();

  // Executa uma rotina contínua acionando as variáveis armazenadas diretamente pelo servidor global hospedado.
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

  // Extrai da matriz total somente itens parcialmente idênticos às diretrizes informadas na seção do filtro principal.
  const doacoesFiltradas = doacoes.filter((item) => {
    const termo = termoBusca.toLowerCase();
    return (
      (item.doador && item.doador.toLowerCase().includes(termo)) ||
      (item.item && item.item.toLowerCase().includes(termo))
    );
  });

  const abrirEdicao = (doacao) => {
    setDoacaoSelecionada(doacao);
    setModalEdicaoAberto(true);
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
          <p className="text-slate-500">Gerenciamento de doações recebidas</p>
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
                <th className="p-4">Item Doado</th>
                <th className="p-4">Quantidade</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Disponibiliza o escopo formatado de visualização contínua das linhas processadas condicionalmente. */}
              {doacoesFiltradas.map((item) => (
                <tr
                  key={item.id}
                  className="flex flex-col sm:table-row p-4 border-b hover:bg-slate-50 transition-colors"
                >
                  <td className="p-2 sm:p-4">{item.doador}</td>
                  <td className="p-2 sm:p-4">{item.data_doacao}</td>
                  <td className="p-2 sm:p-4">{item.item}</td>
                  <td className="p-2 sm:p-4">
                    {item.quantidade}{" "}
                    {Number(item.quantidade) === 1 ? "Unidade" : "Unidades"}
                  </td>
                  <td className="p-2 sm:p-4 text-center">
                    <button
                      onClick={() => abrirEdicao(item)}
                      className="text-blue-600 hover:text-blue-800 transition"
                    >
                      <FaPen />
                    </button>
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
    </main>
  );
}
