import React from "react";

export default function ModalCancelamentoEntrega({
  isOpen,
  onClose,
  entrega,
  atualizarLista,
}) {
  // Verifica condições essenciais para a montagem visual da janela modal de exclusão.
  if (!isOpen || !entrega) return null;

  // Realiza a chamada HTTP para remoção definitiva de um evento de distribuição registrado.
  const cancelar = async () => {
    try {
      const res = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/entregas/${entrega.id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        atualizarLista();
        onClose();
      }
    } catch (e) {
      alert("Erro ao cancelar.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Cancelar Entrega
        </h2>
        <p className="mb-6">
          Deseja realmente cancelar a entrega para {entrega.beneficiario_nome}?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="w-full py-2.5 border rounded-lg">
            Não
          </button>
          <button
            onClick={cancelar}
            className="w-full py-2.5 bg-red-600 text-white rounded-lg"
          >
            Sim, Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
