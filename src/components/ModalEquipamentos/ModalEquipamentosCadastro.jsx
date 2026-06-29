import React, { useState, useEffect } from "react";
import { FaXmark, FaFloppyDisk } from "react-icons/fa6";

export default function ModalCadastroEquipamento({
  isOpen,
  onClose,
  atualizarLista,
}) {
  const [form, setForm] = useState({
    nome: "",
    categoria: "",
    numero_serie: "",
    status: "Disponível",
    descricao: "",
    observacoes: "",
  });
  const [salvando, setSalvando] = useState(false);

  // Monitora o uso do teclado e permite descartar a janela ativa de maneira rápida.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Se a prop condicional indicar desativação, retorna apenas dados nulos à árvore raiz.
  if (!isOpen) return null;

  // Processa a montagem estrutural e emite a requisição POST embutindo as informações captadas.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/equipamentos",
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main
        role="dialog"
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <header className="bg-slate-50 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            Cadastrar Equipamento
          </h2>
          <button onClick={onClose} aria-label="Fechar">
            <FaXmark />
          </button>
        </header>
        <form
          id="form-cad"
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto"
        >
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Nome
            </label>
            <input
              required
              className="w-full p-3 border rounded-lg"
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Categoria
              </label>
              <input
                required
                className="w-full p-3 border rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Série
              </label>
              <input
                required
                className="w-full p-3 border rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, numero_serie: e.target.value })
                }
              />
            </div>
          </div>
        </form>
        <footer className="p-4 border-t flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-cad"
            disabled={salvando}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </footer>
      </main>
    </div>
  );
}
