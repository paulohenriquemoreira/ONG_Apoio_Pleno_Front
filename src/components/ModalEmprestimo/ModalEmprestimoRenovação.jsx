import React, { useState } from "react";

export default function ModalRenovacaoEmprestimo({ isOpen, onClose, emprestimo, atualizarLista }) {
  const [novaData, setNovaData] = useState("");

  if (!isOpen || !emprestimo) return null;

  const renovar = async (e) => {
    e.preventDefault();
    // Lógica para PUT emprestimos/${emprestimo.id} alterando a data
    atualizarLista();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main role="dialog" className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4">Renovar Empréstimo</h2>
        <form onSubmit={renovar} className="space-y-4">
          <p className="text-xs text-slate-500">Equipamento: {emprestimo.equipamento_nome}</p>
          <input required type="date" onChange={(e) => setNovaData(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="w-full py-2.5 border rounded-lg text-sm">Cancelar</button>
            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm">Confirmar Renovação</button>
          </div>
        </form>
      </main>
    </div>
  );
}