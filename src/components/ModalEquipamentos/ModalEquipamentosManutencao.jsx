import React, { useState, useEffect } from "react";
import { FaXmark, FaScrewdriverWrench } from "react-icons/fa6";

export default function ModalManutencaoEquipamentos({
  isOpen,
  onClose,
  equipamento,
  atualizarLista,
}) {
  const [form, setForm] = useState({
    motivo_defeito: "",
    data_envio: "",
    previsao_retorno: "",
    custo_estimado: "",
  });

  const [salvando, setSalvando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState("");

  // Limpa o formulário toda vez que o modal abre
  useEffect(() => {
    if (isOpen) {
      setForm({
        motivo_defeito: "",
        data_envio: new Date().toISOString().split("T")[0], // Data de hoje por padrão
        previsao_retorno: "",
        custo_estimado: "",
      });
      setErroValidacao("");
    }
  }, [isOpen]);

  // ACESSIBILIDADE: Fechar com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !equipamento) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErroValidacao("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroValidacao("");

    try {
      // Como o objetivo principal é mudar o status, envia os dados do equipamento
      // com o status forçado para "Em Manutenção" e adiciona o motivo nas observações.
      // Caso sua API tenha uma rota específica de manutenção (POST /api/manutencoes),
      // basta trocar a URL e o método abaixo.
      const dadosAtualizados = {
        ...equipamento, // Mantém os dados antigos (nome, categoria, etc)
        status: "Em Manutenção", // Força o status de bloqueio
        observacoes: `${equipamento.observacoes}\n\n[MANUTENÇÃO - ${form.data_envio}]: ${form.motivo_defeito}. Custo Estimado: R$ ${form.custo_estimado}. Retorno Previsto: ${form.previsao_retorno}`,
      };

      const resposta = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/equipamentos/${equipamento.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosAtualizados),
        },
      );

      if (resposta.ok) {
        atualizarLista();
        onClose();
      } else {
        const dadosErro = await resposta.json();
        setErroValidacao(dadosErro.erro || "Erro ao registrar manutenção.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErroValidacao("Não foi possível conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* ACESSIBILIDADE: role="dialog" e container de largura fixa w-[500px] */}
      <main
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-manutencao-title"
        className="bg-white rounded-2xl w-[500px] shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
      >
        <header className="bg-orange-50 p-4 border-b border-orange-200 flex justify-between items-center">
          <h2
            id="modal-manutencao-title"
            className="text-xl font-bold text-orange-800 flex items-center gap-2"
          >
            <FaScrewdriverWrench aria-hidden="true" />
            Registrar Manutenção
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-orange-400 hover:bg-orange-200 hover:text-orange-600 transition"
            aria-label="Fechar modal de manutenção"
          >
            <FaXmark className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        {/* Formulário em coluna única, sem grids responsivos */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto flex-1 text-left"
        >
          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-sm text-slate-700">
            Enviando{" "}
            <strong className="text-slate-900">{equipamento.nome}</strong>{" "}
            (Série: {equipamento.numero_serie}) para o conserto. O status será
            alterado para "Em Manutenção".
          </div>

          {erroValidacao && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm font-medium"
            >
              {erroValidacao}
            </div>
          )}

          <div>
            <label
              htmlFor="motivo_defeito"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Motivo / Defeito Apresentado
            </label>
            <input
              required
              id="motivo_defeito"
              type="text"
              name="motivo_defeito"
              value={form.motivo_defeito}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
              placeholder="Ex: Pneu furado, cabo solto..."
            />
          </div>

          <div>
            <label
              htmlFor="data_envio"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Data de Envio
            </label>
            <input
              required
              id="data_envio"
              type="date"
              name="data_envio"
              value={form.data_envio}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="previsao_retorno"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Previsão de Retorno
            </label>
            <input
              required
              id="previsao_retorno"
              type="date"
              name="previsao_retorno"
              value={form.previsao_retorno}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="custo_estimado"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Custo Estimado (R$)
            </label>
            <input
              id="custo_estimado"
              type="number"
              step="0.01"
              name="custo_estimado"
              value={form.custo_estimado}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
              placeholder="0.00"
            />
          </div>
        </form>

        <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white p-4">
          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition flex items-center gap-2 min-h-[44px]"
          >
            <FaScrewdriverWrench aria-hidden="true" />
            <span>{salvando ? "Registrando..." : "Confirmar Manutenção"}</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
