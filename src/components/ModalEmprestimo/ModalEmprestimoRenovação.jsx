import React, { useState } from "react";
import { FaXmark, FaCalendarCheck } from "react-icons/fa6";

export default function ModalRenovacaoEmprestimo({ isOpen, onClose, emprestimo, atualizarLista }) {
  const [novaData, setNovaData] = useState("");
  const [salvando, setSalvando] = useState(false);

  const renovar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(`https://ong-apoio-pleno-api.onrender.com/api/emprestimos/renovar/${emprestimo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nova_data: novaData })
      });
      if (res.ok) { atualizarLista(); onClose(); }
    } finally { setSalvando(false); }
  };

  if (!isOpen || !emprestimo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col">
        <header className="bg-slate-50 p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Renovar Empréstimo</h2>
          <button onClick={onClose}><FaXmark /></button>
        </header>
        
        <form id="form-renovacao" onSubmit={renovar} className="p-6 space-y-4">
          <p className="text-xs text-slate-500">Equipamento: <strong>{emprestimo.equipamento_nome}</strong></p>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nova Data de Devolução</label>
            <input required type="date" onChange={(e) => setNovaData(e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
          </div>
        </form>

        <footer className="p-4 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2.5 border rounded-lg text-sm">Cancelar</button>
          <button type="submit" form="form-renovacao" disabled={salvando} className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-2">
            <FaCalendarCheck /> {salvando ? "Salvando..." : "Confirmar Renovação"}
          </button>
        </footer>
      </main>
    </div>
  );
}