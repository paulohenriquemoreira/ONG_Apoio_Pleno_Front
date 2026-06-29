import React, { useState, useEffect } from "react";
import { FaXmark, FaBoxOpen } from "react-icons/fa6";

export default function ModalNovaEntrega({ isOpen, onClose, atualizarLista }) {
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [form, setForm] = useState({
    beneficiario_id: "",
    item: "",
    quantidade: "",
    categoria: "Doação",
  });

  // Busca e converte em JSON a listagem geral de potenciais beneficiários habilitados à doação.
  useEffect(() => {
    if (isOpen) {
      fetch("https://ong-apoio-pleno-api.onrender.com/api/beneficiarios")
        .then((res) => res.json())
        .then((data) => setBeneficiarios(data));
    }
  }, [isOpen]);

  // Transfere o pacote de dados do formulário preenchido em direção à rota para processamento final.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      "https://ong-apoio-pleno-api.onrender.com/api/entregas",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    if (res.ok) {
      atualizarLista();
      onClose();
    }
  };

  // Garante a não renderização invisível de componentes em tela inativa.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden p-6">
        <h2 className="text-xl font-bold mb-4">Registrar Entrega</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            required
            name="beneficiario_id"
            onChange={(e) =>
              setForm({ ...form, beneficiario_id: e.target.value })
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione o beneficiário...</option>
            {beneficiarios.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nome}
              </option>
            ))}
          </select>
          <input
            required
            name="item"
            placeholder="Item"
            onChange={(e) => setForm({ ...form, item: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            required
            type="number"
            name="quantidade"
            placeholder="Qtd"
            onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Finalizar Entrega
          </button>
        </form>
      </main>
    </div>
  );
}
