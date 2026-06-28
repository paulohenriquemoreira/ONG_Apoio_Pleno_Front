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

  // Estados para os 3 modais
  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalEstornoAberto, setModalEstornoAberto] = useState(false);

  // Estado para armazenar o item selecionado
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

  // Handlers para abrir modais com dados
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
      className="space-y-8 animate-fade-in p-4 sm:p-0"
      aria-label="Página de Doações"
    >
      {/* CABEÇALHO RESPONSIVO */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
          <FaHandHoldingDollar className="text-green-600" aria-hidden="true" />
          <span>Gestão de Doações</span>
        </h1>
        <button
          onClick={() => setModalNovaAberto(true)}
          className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <FaPlus aria-hidden="true" /> Nova Doação
        </button>
      </header>

      {/* TABELA RESPONSIVA */}
      <section
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        aria-label="Tabela de doações"
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
              <tr>
                <th className="p-4">Doador</th>
                <th className="p-4">Data</th>
                <th className="p-4">Descrição</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {doacoes.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium">{item.doador_nome}</td>
                  <td className="p-4">{item.data_doacao}</td>
                  <td className="p-4">{item.descricao}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => abrirEdicao(item)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                        aria-label={`Editar doação de ${item.doador_nome}`}
                      >
                        <FaPen />
                      </button>
                      <button
                        onClick={() => abrirEstorno(item)}
                        className="text-amber-600 hover:text-amber-800 p-2 rounded-full hover:bg-amber-50"
                        aria-label={`Estornar doação de ${item.doador_nome}`}
                      >
                        <FaRotateLeft />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAIS */}
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
