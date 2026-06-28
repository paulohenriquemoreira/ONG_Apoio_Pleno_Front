import React, { useState } from "react";
import { FaXmark, FaScrewdriverWrench } from "react-icons/fa6";

export default function ModalManutencaoEquipamentos({
  isOpen,
  onClose,
  equipamento,
  atualizarLista,
}) {
  const [form, setForm] = useState({ motivo: "", previsao: "" });
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/manutencoes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            equipamento_id: equipamento.id,
            descricao: form.motivo,
            observacoes: `Retorno: ${form.previsao}`,
          }),
        },
      );
      if (res.ok) {
        atualizarLista();
        onClose();
      }
    } finally {
      setSalvando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="bg-orange-50 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-orange-800">Manutenção</h2>
        </header>
        <form
          id="form-manutencao"
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase">
              Motivo da Manutenção
            </label>
            <input
              required
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase">
              Data Prevista Finalização
            </label>
            <input
              required
              type="date"
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setForm({ ...form, previsao: e.target.value })}
            />
          </div>
        </form>
        <footer className="p-4 border-t flex justify-end gap-3 bg-white">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancelar
          </button>
          <button
            type="submit"
            form="form-manutencao"
            disabled={salvando}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Confirmar
          </button>
        </footer>
      </main>
    </div>
  );
}
