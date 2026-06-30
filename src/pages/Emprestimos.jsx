import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FaPlus,
  FaHandshake,
  FaCheckDouble,
  FaCalendarDays,
} from "react-icons/fa6";
import {
  ModalNovo,
  ModalDevolucao,
  ModalRenovacao,
} from "../components/ModalEmprestimo/index.js";

export default function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalDevolucaoAberto, setModalDevolucaoAberto] = useState(false);
  const [modalRenovacaoAberto, setModalRenovacaoAberto] = useState(false);
  const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);

  // Assimila a propriedade capturada externamente via roteamento reativo implementado.
  const [termoBusca] = useOutletContext();

  // Executa rotinas remotas assíncronas atualizando o status base atrelado aos ativos e registros efetuados.
  const buscarEmprestimos = async () => {
    try {
      const resposta = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/emprestimos",
      );
      const dados = await resposta.json();
      setEmprestimos(dados);
    } catch (error) {
      console.error("Erro ao buscar empréstimos:", error);
    }
  };

  useEffect(() => {
    buscarEmprestimos();
  }, []);

  // Extrai fragmentos correspondentes ao status ignorando listagens pendentes de processamento ativo do componente.
  const emprestimosFiltrados = emprestimos
    .filter((item) => item.status !== "Concluído")
    .filter((item) => {
      const termo = termoBusca.toLowerCase();
      return (
        (item.beneficiario_nome &&
          item.beneficiario_nome.toLowerCase().includes(termo)) ||
        (item.equipamento_nome &&
          item.equipamento_nome.toLowerCase().includes(termo))
      );
    });

  const abrirDevolucao = (item) => {
    setEmprestimoSelecionado(item);
    setModalDevolucaoAberto(true);
  };

  const abrirRenovacao = (item) => {
    setEmprestimoSelecionado(item);
    setModalRenovacaoAberto(true);
  };

  return (
    <main
      role="main"
      className="space-y-8 animate-fade-in p-4 sm:p-6"
      aria-labelledby="pagina-emprestimos"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            id="pagina-emprestimos"
            className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2"
          >
            <FaHandshake className="text-blue-600" aria-hidden="true" />
            <span>Gestão de Empréstimos</span>
          </h1>
           <p className="text-slate-500">Gerenciamento de empréstimos de equipamentos</p>
        </div>
        <button
          onClick={() => setModalNovoAberto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <FaPlus aria-hidden="true" /> Novo Empréstimo
        </button>
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="hidden sm:table-header-group bg-slate-50 border-b text-xs font-bold uppercase text-slate-600">
            <tr>
              <th className="p-4">Beneficiário</th>
              <th className="p-4">Equipamento</th>
              <th className="p-4">Data Empréstimo</th>
              <th className="p-4">Previsão Devolução</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {/* Disponibiliza a listagem reativa atrelada somente a referências parcialmente idênticas predefinidas. */}
            {emprestimosFiltrados.map((item) => (
              <tr
                key={item.id}
                className="flex flex-col sm:table-row p-4 border-b sm:border-b-0 hover:bg-slate-50 transition-colors"
              >
                <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                  <span className="font-bold text-[10px] text-slate-400 uppercase w-24 sm:hidden shrink-0 mt-0.5">
                    Beneficiário:
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-900">
                    {item.beneficiario_nome}
                  </span>
                </td>

                <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                  <span className="font-bold text-[10px] text-slate-400 uppercase w-24 sm:hidden shrink-0 mt-0.5">
                    Equipamento:
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700">
                    {item.equipamento_nome}
                  </span>
                </td>

                <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                  <span className="font-bold text-[10px] text-slate-400 uppercase w-24 sm:hidden shrink-0 mt-0.5">
                    Data Empr.:
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700">
                    {item.data_inicio}
                  </span>
                </td>

                <td className="flex sm:table-cell py-3 sm:p-4 border-b sm:border-0 border-slate-100 items-start">
                  <span className="font-bold text-[10px] text-slate-400 uppercase w-24 sm:hidden shrink-0 mt-0.5">
                    Devolução:
                  </span>
                  <span className="text-xs sm:text-sm text-slate-700">
                    {item.data_fim}
                  </span>
                </td>

                <td className="flex sm:table-cell py-3 sm:p-4 mt-2 sm:mt-0 items-center justify-center">
                  <span className="font-bold text-[10px] text-slate-400 uppercase w-24 sm:hidden">
                    Ações:
                  </span>
                  <div className="flex gap-4">
                    <button
                      onClick={() => abrirRenovacao(item)}
                      className="text-indigo-600 hover:text-indigo-800 transition p-1"
                      title="Renovar"
                    >
                      <FaCalendarDays size={18} />
                    </button>
                    <button
                      onClick={() => abrirDevolucao(item)}
                      className="text-teal-600 hover:text-teal-800 transition p-1"
                      title="Devolver"
                    >
                      <FaCheckDouble size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <ModalNovo
        isOpen={modalNovoAberto}
        onClose={() => setModalNovoAberto(false)}
        atualizarLista={buscarEmprestimos}
      />
      <ModalDevolucao
        isOpen={modalDevolucaoAberto}
        onClose={() => {
          setModalDevolucaoAberto(false);
          setEmprestimoSelecionado(null);
        }}
        emprestimo={emprestimoSelecionado}
        atualizarLista={buscarEmprestimos}
      />
      <ModalRenovacao
        isOpen={modalRenovacaoAberto}
        onClose={() => {
          setModalRenovacaoAberto(false);
          setEmprestimoSelecionado(null);
        }}
        emprestimo={emprestimoSelecionado}
        atualizarLista={buscarEmprestimos}
      />
    </main>
  );
}
