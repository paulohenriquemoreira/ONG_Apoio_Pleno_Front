import React, { useState } from "react";
import { FaXmark, FaCheckDouble } from "react-icons/fa6";

export default function ModalDevolucaoEmprestimo({ isOpen, onClose, emprestimo, atualizarLista }) {
  if (!isOpen || !emprestimo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <header className="bg-teal-50 p-4 border-b border-teal-100 flex justify-between">
          <h2 className="text-xl font-bold text-teal-800">Registrar Devolução</h2>
          <button onClick={onClose} className="text-teal-400 hover:bg-teal-200 p-1 rounded"><FaXmark className="w-5 h-5" /></button>
        </header>
        <form className="p-4 sm:p-6 space-y-4">
          <div className="bg-slate-50 p-3 rounded text-sm text-slate-700">
            Recebendo <strong>{emprestimo.equipamento_nome}</strong> de <strong>{emprestimo.beneficiario_nome}</strong>.
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Estado da Devolução</label>
            <select required name="estado" className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white">
              <option value="Disponível">Perfeito Estado (Retornar para Disponível)</option>
              <option value="Em Manutenção">Com Defeito (Enviar para Manutenção)</option>
              <option value="Baixa">Inutilizado (Dar Baixa no Equipamento)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Observações da Devolução</label>
            <textarea rows="3" className="w-full px-3 py-2.5 border rounded-lg text-sm resize-none"></textarea>
          </div>
          <footer className="pt-4 flex justify-end gap-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border rounded-lg text-sm">Cancelar</button>
            <button type="submit" className="px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm flex items-center gap-2"><FaCheckDouble /> Concluir Devolução</button>
          </footer>
        </form>
      </main>
    </div>
  );
}