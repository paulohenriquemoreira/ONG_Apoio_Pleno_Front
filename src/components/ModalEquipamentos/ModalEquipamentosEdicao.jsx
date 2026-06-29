import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";

export default function ModalEdicao({
  isOpen,
  onClose,
  equipamento,
  atualizarLista,
}) {
  const [form, setForm] = useState({});
  const [salvando, setSalvando] = useState(false);

  // Inicializa e insere a listagem dos dados capturados ao acionar o componente.
  useEffect(() => {
    if (equipamento) setForm(equipamento);
  }, [equipamento]);

  // Transmite as informações reconstruídas em direção ao repositório via PUT.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/equipamentos/${equipamento.id}`,
        {
          method: "PUT",
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

  // Paralisa renderizações fantasmas originadas de janelas não ativadas.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-lg">Editar Equipamento</h2>
          <button onClick={onClose}>
            <FaXmark />
          </button>
        </header>
        <form
          id="form-edit"
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase">
              Nome do Equipamento
            </label>
            <input
              className="w-full p-3 border rounded-lg"
              value={form.nome || ""}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase">
              Categoria
            </label>
            <input
              className="w-full p-3 border rounded-lg"
              value={form.categoria || ""}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase">
              Número de Série
            </label>
            <input
              className="w-full p-3 border rounded-lg"
              value={form.numero_serie || ""}
              onChange={(e) =>
                setForm({ ...form, numero_serie: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase">Status</label>
            <select
              className="w-full p-3 border rounded-lg"
              value={form.status || ""}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Disponível">Disponível</option>
              <option value="Emprestado">Emprestado</option>
              <option value="Em Manutenção">Em Manutenção</option>
            </select>
          </div>
        </form>
        <footer className="p-4 border-t flex justify-end gap-3 bg-white">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancelar
          </button>
          <button
            type="submit"
            form="form-edit"
            disabled={salvando}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Salvar
          </button>
        </footer>
      </main>
    </div>
  );
}
