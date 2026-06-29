import React, { useState, useEffect } from "react";
import { FaXmark, FaHandHoldingHeart } from "react-icons/fa6";

export default function ModalNovoEmprestimo({
  isOpen,
  onClose,
  atualizarLista,
}) {
  const [equipamentos, setEquipamentos] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [form, setForm] = useState({
    equipamento_id: "",
    beneficiario_id: "",
    data_devolucao: "",
  });
  const [salvando, setSalvando] = useState(false);

  // Solicita ao back-end as listas de dependências assim que a janela de empréstimo for aberta.
  useEffect(() => {
    if (isOpen) {
      Promise.all([
        fetch("https://ong-apoio-pleno-api.onrender.com/api/equipamentos").then(
          (res) => res.json(),
        ),
        fetch(
          "https://ong-apoio-pleno-api.onrender.com/api/beneficiarios",
        ).then((res) => res.json()),
      ]).then(([eq, ben]) => {
        // Separa da listagem de equipamentos apenas os itens livres no estoque.
        setEquipamentos(eq.filter((e) => e.status === "Disponível"));
        setBeneficiarios(ben);
      });
    }
  }, [isOpen]);

  // Transmite as seleções via payload para inicializar a locação na base de dados.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/emprestimos",
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
    } finally {
      setSalvando(false);
    }
  };

  // Finaliza a função se o modal estiver retraído.
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <main
        role="dialog"
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <header className="bg-slate-50 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Novo Empréstimo</h2>
          <button onClick={onClose}>
            <FaXmark />
          </button>
        </header>
        <form
          id="form-emp"
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto"
        >
          <div>
            <label className="block text-xs font-bold uppercase">
              Equipamento
            </label>
            <select
              required
              className="w-full p-3 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, equipamento_id: e.target.value })
              }
            >
              <option value="">Selecione...</option>
              {equipamentos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase">
              Responsável
            </label>
            <select
              required
              className="w-full p-3 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, beneficiario_id: e.target.value })
              }
            >
              <option value="">Selecione...</option>
              {beneficiarios.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nome}
                </option>
              ))}
            </select>
          </div>
        </form>
        <footer className="p-4 border-t flex justify-end gap-3 bg-white">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancelar
          </button>
          <button
            type="submit"
            form="form-emp"
            disabled={salvando}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </footer>
      </main>
    </div>
  );
}
