import React, { useState } from "react";
import { FaXmark, FaScrewdriverWrench } from "react-icons/fa6";

export default function ModalDevolucao({
  isOpen,
  onClose,
  equipamento,
  atualizarLista,
}) {
  const [pecas, setPecas] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Lógica para enviar o registro de peças trocadas na manutenção
    atualizarLista();
    onClose();
  };

  if (!isOpen || !equipamento) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
      >
        <header className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold">Registro de Reparo</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <FaXmark />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Peças Trocadas
            </label>
            <textarea
              value={pecas}
              onChange={(e) => setPecas(e.target.value)}
              rows="3"
              className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
              placeholder="Descreva o que foi trocado..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 min-h-[44px]"
          >
            Salvar Detalhes do Reparo
          </button>
        </form>
      </main>
    </div>
  );
}
