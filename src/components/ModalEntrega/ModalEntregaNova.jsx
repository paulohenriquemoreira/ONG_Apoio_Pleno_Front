import React, { useState, useEffect } from "react";
import { FaXmark, FaBoxOpen } from "react-icons/fa6";

export default function ModalNovaEntrega({
  isOpen,
  onClose,
  beneficiarios,
  atualizarLista,
}) {
  const [form, setForm] = useState({
    beneficiario_id: "",
    item: "",
    quantidade: "",
    data_entrega: "",
  });

  // Tecla ESC omitida aqui para economizar espaço de leitura, mas você deve incluir!
  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
      >
        <header className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between">
          <h2 className="text-xl font-bold text-slate-800">
            Registrar Entrega (Doação)
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 text-slate-400 hover:bg-slate-200"
          >
            <FaXmark className="w-5 h-5" />
          </button>
        </header>
        <form className="p-4 sm:p-6 space-y-4">
          <div>
            <label
              htmlFor="beneficiario"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Beneficiário
            </label>
            {/* SELECT PUXANDO OS BENEFICIÁRIOS DA TABELA */}
            <select
              required
              id="beneficiario"
              name="beneficiario_id"
              value={form.beneficiario_id}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white"
            >
              <option value="">Selecione a família...</option>
              {beneficiarios?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome} - CPF: {b.documento}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="item"
                className="block text-xs font-bold text-slate-600 uppercase mb-1"
              >
                Item Entregue
              </label>
              <input
                required
                id="item"
                name="item"
                onChange={handleChange}
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
                placeholder="Ex: Fralda G"
              />
            </div>
            <div>
              <label
                htmlFor="quantidade"
                className="block text-xs font-bold text-slate-600 uppercase mb-1"
              >
                Quantidade
              </label>
              <input
                required
                id="quantidade"
                type="number"
                name="quantidade"
                onChange={handleChange}
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
              />
            </div>
          </div>
          <footer className="pt-4 flex justify-end gap-3 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border rounded-lg text-sm hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
            >
              <FaBoxOpen /> Finalizar Entrega
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
