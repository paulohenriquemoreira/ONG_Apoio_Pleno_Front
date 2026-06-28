export default function ModalDetalhesEntrega({ isOpen, onClose, entrega }) {
  if (!isOpen || !entrega) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div role="dialog" className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold border-b pb-2">Detalhes da Entrega</h2>
        <div className="text-sm space-y-2">
          <p><span className="font-bold">Família:</span> {entrega.beneficiario_nome}</p>
          <p><span className="font-bold">Item:</span> {entrega.item}</p>
          <p><span className="font-bold">Quantidade:</span> {entrega.quantidade}</p>
          <p><span className="font-bold">Data:</span> {entrega.data_entrega}</p>
        </div>
        <button onClick={onClose} className="w-full py-2.5 bg-slate-100 rounded-lg text-sm font-bold">Fechar</button>
      </div>
    </div>
  );
}