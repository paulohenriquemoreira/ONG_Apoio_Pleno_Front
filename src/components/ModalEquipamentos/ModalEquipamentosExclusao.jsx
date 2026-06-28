import React, { useState, useEffect } from "react";
import { FaTrashCan, FaXmark } from "react-icons/fa6";

export default function ModalExclusaoEquipamentos({ isOpen, onClose, equipamento, atualizarLista }) {
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  //ACESSIBILIDADE: Tecla ESC para fechar (obrigatório para navegação via teclado)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !equipamento) return null;

  const handleDeletar = async () => {
    setExcluindo(true);
    setErro("");

    try {
      const resposta = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/equipamentos/${equipamento.id}`,
        { method: "DELETE" }
      );

      if (resposta.ok) {
        atualizarLista(); 
        onClose();
      } else {
        const dadosErro = await resposta.json();
        setErro(dadosErro.erro || "Não foi possível dar baixa neste equipamento.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Falha de conexão com o servidor.");
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      
      {/*ACESSIBILIDADE: role="alertdialog" e tamanho fixo (w-[400px]) sem responsividade */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-delete-title"
        aria-describedby="modal-delete-desc"
        className="bg-white rounded-2xl w-[400px] shadow-xl overflow-hidden border border-slate-100 p-6 space-y-6 text-center"
      >
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50 border border-red-100">
          <FaTrashCan className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h2 id="modal-delete-title" className="text-xl font-bold text-slate-800">
            Confirmar Baixa/Exclusão
          </h2>
          <p id="modal-delete-desc" className="text-slate-500 text-sm leading-relaxed">
            Tem certeza que deseja excluir o registro do equipamento <strong className="text-slate-900 font-semibold">{equipamento.nome}</strong> (Série: {equipamento.numero_serie})? Esta ação não pode ser desfeita.
          </p>
        </div>

        {/* Alerta de erro acessível */}
        {erro && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-medium text-left">
            {erro}
          </div>
        )}

        {/* Botões sem classes responsivas, fixos lado a lado */}
        <footer className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={excluindo}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDeletar}
            disabled={excluindo}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center justify-center gap-2 min-h-[44px]"
          >
            {excluindo ? "Excluindo..." : "Sim, Excluir"}
          </button>
        </footer>
      </div>
    </div>
  );
}