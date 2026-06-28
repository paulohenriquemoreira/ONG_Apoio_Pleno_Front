import React, { useState } from "react";
import { FaXmark, FaHandshake } from "react-icons/fa6";

export default function ModalNovoEmprestimo({ isOpen, onClose, beneficiarios, equipamentosDisponiveis, atualizarLista }) {
  const [form, setForm] = useState({ beneficiario_id: "", equipamento_id: "", previsao_devolucao: "" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main role="dialog" aria-modal="true" className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <header className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between">
          <h2 className="text-xl font-bold text-indigo-800">Novo Empréstimo</h2>
          <button onClick={onClose} className="text-indigo-400 hover:bg-indigo-200 rounded p-1"><FaXmark className="w-5 h-5" /></button>
        </header>
        <form className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Equipamento Disponível</label>
            <select required name="equipamento_id" className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white">
              <option value="">Selecione o equipamento...</option>
              {equipamentosDisponiveis?.map(e => <option key={e.id} value={e.id}>{e.nome} (Série: {e.numero_serie})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Beneficiário (Responsável)</label>
            <select required name="beneficiario_id" className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white">
              <option value="">Selecione o responsável...</option>
              {beneficiarios?.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Previsão de Devolução</label>
            <input required type="date" name="previsao_devolucao" className="w-full px-3 py-2.5 border rounded-lg text-sm" />
          </div>
          <footer className="pt-4 flex justify-end gap-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border rounded-lg text-sm">Cancelar</button>
            <button type="submit" className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-2"><FaHandshake /> Confirmar Empréstimo</button>
          </footer>
        </form>
      </main>
    </div>
  );
}