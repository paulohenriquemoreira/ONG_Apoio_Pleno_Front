import React, { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";

export default function ModalExclusao({
  isOpen,
  onClose,
  equipamento,
  atualizarLista,
}) {
  const [excluindo, setExcluindo] = useState(false);

  // Exclui de forma contínua da listagem remota o registro apontado ao confirmar o acionamento.
  const handleDeletar = async () => {
    setExcluindo(true);
    try {
      const res = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/equipamentos/${equipamento.id}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (res.ok) {
        atualizarLista();
        onClose();
      } else {
        alert(data.mensagem);
      }
    } catch (error) {
      alert("Falha na conexão com o servidor.");
    } finally {
      setExcluindo(false);
    }
  };

  // Barra renderização vazia em caso de inatividade prévia da função.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-xl">
        <FaTrashCan className="mx-auto text-red-600 text-4xl mb-4" />
        <h2 className="text-xl font-bold mb-4">Confirmar exclusão?</h2>
        <p className="text-sm text-slate-500 mb-6">
          Deseja remover: {equipamento.nome}?
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancelar
          </button>
          <button
            onClick={handleDeletar}
            disabled={excluindo}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {excluindo ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
