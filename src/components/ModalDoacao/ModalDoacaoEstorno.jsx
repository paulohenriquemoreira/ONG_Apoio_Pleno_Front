import React, { useEffect } from "react";
import { FaRotateLeft, FaXmark } from "react-icons/fa6";

export default function ModalEstornoDoacao({ isOpen, onClose, doacao, atualizarLista }) {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !doacao) return null;

  const handleEstornar = async () => {
    // Lógica de DELETE ou alteração de status para "Estornado"
    atualizarLista();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div role="alertdialog" aria-modal="true" aria-labelledby="estorno-title" className="bg-white rounded-2xl w-full max-w-md p-6 text-center shadow-xl">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50 mb-4">
          <FaRotateLeft className="h-6 w-6 text-red-600" />
        </div>
        <h2 id="estorno-title" className="text-xl font-bold text-slate-800 mb-2">Estornar Doação</h2>
        <p className="text-slate-500 text-sm mb-6">Tem certeza que deseja estornar a entrada de <strong>{doacao.quantidade}x {doacao.item}</strong>? Isso removerá os itens do estoque.</p>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50 w-full sm:w-auto">Cancelar</button>
          <button onClick={handleEstornar} className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 w-full sm:w-auto">Sim, Estornar</button>
        </div>
      </div>
    </div>
  );
}