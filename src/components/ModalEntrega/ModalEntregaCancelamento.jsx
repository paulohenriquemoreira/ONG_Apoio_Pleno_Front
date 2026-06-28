export default function ModalCancelamentoEntrega({
  isOpen,
  onClose,
  entrega,
  atualizarLista,
}) {
  if (!isOpen || !entrega) return null;

  const cancelar = async () => {
    /* fetch DELETE ou PUT status=cancelado */ atualizarLista();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        role="alertdialog"
        className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl"
      >
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Cancelar Entrega
        </h2>
        <p className="text-sm mb-6">
          Deseja realmente cancelar a entrega para {entrega.beneficiario_nome}?
          O item retornará ao estoque.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-full py-2.5 border rounded-lg text-sm"
          >
            Não
          </button>
          <button
            onClick={cancelar}
            className="w-full py-2.5 bg-red-600 text-white rounded-lg text-sm"
          >
            Sim, Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
