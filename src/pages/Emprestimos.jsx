import { useState, useEffect } from "react";
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

  // Busca dados da API
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
      className="space-y-8 animate-fade-in p-4 sm:p-0"
      aria-labelledby="titulo-emprestimos"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1
          id="titulo-emprestimos"
          className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2"
        >
          <FaHandshake className="text-indigo-600" aria-hidden="true" />
          <span>Gestão de Empréstimos</span>
        </h1>
        <button
          onClick={() => setModalNovoAberto(true)}
          className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <FaPlus aria-hidden="true" /> Novo Empréstimo
        </button>
      </header>

      <section
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        aria-label="Tabela de empréstimos ativos"
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
              <tr>
                <th className="p-4">Beneficiário</th>
                <th className="p-4">Equipamento</th>
                <th className="p-4">Data Empréstimo</th>
                <th className="p-4">Previsão Devolução</th>
                <th className="p-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {emprestimos.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium">{item.beneficiario_nome}</td>
                  <td className="p-4">{item.equipamento_nome}</td>
                  <td className="p-4">{item.data_inicio}</td>
                  <td className="p-4">{item.previsao_devolucao}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => abrirRenovacao(item)}
                        className="text-indigo-600 hover:text-indigo-800 p-2"
                        aria-label={`Renovar empréstimo de ${item.beneficiario_nome}`}
                      >
                        <FaCalendarDays />
                      </button>
                      <button
                        onClick={() => abrirDevolucao(item)}
                        className="text-teal-600 hover:text-teal-800 p-2"
                        aria-label={`Registrar devolução de ${item.equipamento_nome}`}
                      >
                        <FaCheckDouble />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
