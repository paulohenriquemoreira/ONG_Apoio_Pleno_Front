import React, { useState } from "react";
import { FaXmark, FaCalendarCheck } from "react-icons/fa6";

export default function ModalRenovacaoEmprestimo({
  isOpen,
  onClose,
  emprestimo,
  atualizarLista,
}) {
  const [salvando, setSalvando] = useState(false);

  // Interfere no vencimento do empréstimo estendendo seu prazo padrão.
  const handleRenovar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/emprestimos/renovar/${emprestimo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await res.json();

      if (res.ok) {
        // Exibe um aviso no front-end baseado na inteligência temporal do back-end.
        if (data.precisaAlerta) {
          alert(
            "Atenção: Este beneficiário ultrapassou 30 dias de uso. Favor acompanhar no Dashboard.",
          );
        }
        atualizarLista();
        onClose();
      } else {
        alert(data.mensagem || "Erro ao renovar.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  // Pausa o ciclo de renderização caso a camada visual do modal não seja requisitada.
  if (!isOpen || !emprestimo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col">
        <header className="bg-slate-50 p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
            Renovar Empréstimo
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition"
          >
            <FaXmark size={20} />
          </button>
        </header>

        <form
          id="form-renovacao"
          onSubmit={handleRenovar}
          className="p-6 space-y-4"
        >
          <p className="text-sm text-slate-600">
            Deseja renovar o empréstimo de{" "}
            <strong>{emprestimo.equipamento_nome}</strong> para{" "}
            <strong>{emprestimo.beneficiario_nome}</strong> por mais 15 dias?
          </p>
        </form>

        <footer className="p-4 border-t flex justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-renovacao"
            disabled={salvando}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <FaCalendarCheck />{" "}
            {salvando ? "Processando..." : "Confirmar Renovação"}
          </button>
        </footer>
      </main>
    </div>
  );
}
