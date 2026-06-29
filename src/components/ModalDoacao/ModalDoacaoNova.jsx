import React, { useState, useEffect } from "react";
import { FaXmark, FaFloppyDisk } from "react-icons/fa6";

export default function ModalNovaDoacao({ isOpen, onClose, atualizarLista }) {
  const estadoInicial = {
    doador: "",
    item: "",
    quantidade: "",
    data_doacao: new Date().toISOString().split("T")[0],
  };
  const [form, setForm] = useState(estadoInicial);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      // fetch POST aqui...
      atualizarLista();
      setForm(estadoInicial);
      onClose();
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col"
      >
        <header className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 id="modal-title" className="text-xl font-bold text-slate-800">
            Registrar Doação
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition"
          >
            <FaXmark className="w-5 h-5" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label
              htmlFor="doador"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Doador
            </label>
            <input
              id="doador"
              name="doador"
              value={form.doador}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Nome do doador"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="item"
                className="block text-xs font-bold text-slate-600 uppercase mb-1"
              >
                Item Doado
              </label>
              <input
                required
                id="item"
                name="item"
                value={form.item}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Ex: Cesta Básica"
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
                value={form.quantidade}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="descricao"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Descrição
            </label>
            <input
              required
              id="descricao"
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <footer className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2"
            >
              <FaFloppyDisk /> Salvar
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
