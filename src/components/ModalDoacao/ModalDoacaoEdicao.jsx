import React, { useState, useEffect } from "react";
import { FaXmark, FaFloppyDisk } from "react-icons/fa6";

export default function ModalEdicaoDoacao({
  isOpen,
  onClose,
  doacao,
  atualizarLista,
}) {
  const [form, setForm] = useState({
    doador: "",
    item: "",
    quantidade: "",
    observacoes: "",
    categoria: "",
    unidade_medida: "",
  });

  // Preenche os campos do formulário com os dados carregados na edição de doação.
  useEffect(() => {
    if (doacao)
      setForm({
        doador: doacao.doador || "",
        item: doacao.item || "",
        quantidade: doacao.quantidade || "",
        observacoes: doacao.observacoes || "",
        categoria: doacao.categoria || "Outros",
        unidade_medida: doacao.unidade_medida || "Unid",
      });
  }, [doacao, isOpen]);

  // Interrompe o processo caso os dados estejam ausentes.
  if (!isOpen || !doacao) return null;

  // Gerencia o fluxo de salvamento de dados via requisição PUT.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/doacoes/${doacao.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      if (res.ok) {
        atualizarLista();
        onClose();
      } else {
        const erro = await res.json();
        alert("Erro ao salvar: " + (erro.mensagem || "Verifique os dados"));
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <header className="bg-slate-50 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Editar Doação</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:bg-slate-200 rounded"
          >
            <FaXmark />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Doador
            </label>
            <input
              value={form.doador}
              onChange={(e) => setForm({ ...form, doador: e.target.value })}
              className="w-full px-3 py-2.5 border rounded-lg text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Item Doado
              </label>
              <input
                value={form.item}
                onChange={(e) => setForm({ ...form, item: e.target.value })}
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Quantidade
              </label>
              <input
                type="number"
                value={form.quantidade}
                onChange={(e) =>
                  setForm({ ...form, quantidade: e.target.value })
                }
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Observações
            </label>
            <textarea
              value={form.observacoes}
              onChange={(e) =>
                setForm({ ...form, observacoes: e.target.value })
              }
              className="w-full px-3 py-2.5 border rounded-lg text-sm"
            />
          </div>
          <footer className="pt-4 flex justify-end border-t">
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
            >
              <FaFloppyDisk /> Salvar Alterações
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}
