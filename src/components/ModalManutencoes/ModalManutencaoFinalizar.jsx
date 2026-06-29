import React, { useState, useEffect } from "react";
import { FaXmark, FaCheck } from "react-icons/fa6";

export default function ModalFinalizarManutencao({
  isOpen,
  onClose,
  equipamento,
  atualizarLista,
}) {
  const [salvando, setSalvando] = useState(false);

  // Monitora o uso do teclado para ativar a rota rápida de cancelamento na visualização.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Se o gatilho booleano for inativo encerra a montagem inicial visual da página base.
  if (!isOpen || !equipamento) return null;

  // Interfere diretamente nas referências do ativo liberando a máquina retida em oficina.
  const handleFinalizar = async () => {
    setSalvando(true);
    try {
      await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/equipamentos/${equipamento.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...equipamento, status: "Disponível" }),
        },
      );
      atualizarLista();
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
        aria-labelledby="title-finalizar"
        className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center"
      >
        <h2
          id="title-finalizar"
          className="text-xl font-bold text-slate-800 mb-2"
        >
          Finalizar Reparo
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Deseja confirmar que o equipamento <strong>{equipamento.nome}</strong>{" "}
          está pronto para uso e deve retornar ao estoque?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50 min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            onClick={handleFinalizar}
            disabled={salvando}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center justify-center gap-2 min-h-[44px]"
          >
            <FaCheck /> {salvando ? "Processando..." : "Confirmar"}
          </button>
        </div>
      </main>
    </div>
  );
}
