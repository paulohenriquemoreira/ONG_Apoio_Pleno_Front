import React, { useState } from "react";
import { FaXmark, FaFloppyDisk } from "react-icons/fa6";

export default function ModalNovaDoacao({ isOpen, onClose, atualizarLista }) {
  const [form, setForm] = useState({
    doador: "",
    item: "",
    quantidade: "",
    categoria: "Outros",
    unidade_medida: "Unid",
    observacoes: "",
  });
  const [salvando, setSalvando] = useState(false);

  // Manipula e submete as informações para registrar uma nova doação via POST.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/doacoes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
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

  // Previne renderização desnecessária caso a interface do modal esteja fechada.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-4">Registrar Doação</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="doador"
            placeholder="Doador"
            value={form.doador}
            onChange={(e) => setForm({ ...form, doador: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            name="item"
            placeholder="Item Doado"
            value={form.item}
            onChange={(e) => setForm({ ...form, item: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            name="quantidade"
            type="number"
            placeholder="Quantidade"
            value={form.quantidade}
            onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={salvando}
            className="bg-green-600 text-white p-2 rounded w-full"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </main>
    </div>
  );
}
