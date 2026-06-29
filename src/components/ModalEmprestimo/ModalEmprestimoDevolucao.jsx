import React, { useState } from "react";
import { FaXmark, FaCheckDouble } from "react-icons/fa6";

export default function ModalDevolucaoEmprestimo({
  isOpen,
  onClose,
  emprestimo,
  atualizarLista,
}) {
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ estado: "Disponível", observacoes: "" });

  // Executa o envio dos dados de retorno para finalizar o empréstimo vigente.
  const handleDevolucao = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const res = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/emprestimos/devolver/${emprestimo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      if (res.ok) {
        await atualizarLista();
        onClose();
      } else {
        const data = await res.json();
        alert(data.mensagem || "Erro ao registrar devolução.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setSalvando(false);
    }
  };

  // Realiza a checagem de visibilidade inicial.
  if (!isOpen || !emprestimo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <header className="bg-teal-50 p-4 border-b border-teal-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-teal-800">
            Registrar Devolução
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-400 hover:text-teal-600 transition"
          >
            <FaXmark size={20} />
          </button>
        </header>

        <form
          id="form-devolucao"
          onSubmit={handleDevolucao}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 border">
            Recebendo <strong>{emprestimo.equipamento_nome}</strong> de{" "}
            <strong>{emprestimo.beneficiario_nome}</strong>.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Estado da Devolução
            </label>
            <select
              required
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white"
            >
              <option value="Disponível">
                Perfeito Estado (Retornar para Disponível)
              </option>
              <option value="Em Manutenção">
                Com Defeito (Enviar para Manutenção)
              </option>
              <option value="Baixa">
                Inutilizado (Dar Baixa no Equipamento)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Observações
            </label>
            <textarea
              rows="3"
              value={form.observacoes}
              onChange={(e) =>
                setForm({ ...form, observacoes: e.target.value })
              }
              className="w-full px-3 py-2.5 border rounded-lg text-sm resize-none"
            />
          </div>
        </form>

        <footer className="p-4 border-t flex justify-end gap-3 bg-white sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-devolucao"
            disabled={salvando}
            className="px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-teal-700 transition"
          >
            <FaCheckDouble />
            {salvando ? "Processando..." : "Concluir Devolução"}
          </button>
        </footer>
      </main>
    </div>
  );
}
