import React, { useState, useEffect } from "react";
import { FaXmark, FaFloppyDisk } from "react-icons/fa6";

export default function ModalEdicao({
  isOpen,
  onClose,
  equipamento,
  equipamentos,
  atualizarLista,
}) {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    numero_serie: "",
    status: "",
    observacoes: "",
  });

  const [salvando, setSalvando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState("");

  // 1. Sincroniza os dados assim que o modal abre
  useEffect(() => {
    if (equipamento) {
      setForm({
        nome: equipamento.nome || "",
        descricao: equipamento.descricao || "",
        categoria: equipamento.categoria || "",
        numero_serie: equipamento.numero_serie || "",
        status: equipamento.status || "Disponível", // Puxa o status real que vem do banco
        observacoes: equipamento.observacoes || "",
      });
      setErroValidacao("");
    }
  }, [equipamento, isOpen]);

  // 2.ACESSIBILIDADE: Fechar com a tecla ESC 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose(); // "key" minúsculo
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown); // removeEventListener no cleanup!
  }, [isOpen, onClose]);

  // Se não tem modal aberto ou não tem equipamento, não renderiza nada
  if (!isOpen || !equipamento) return null;

  // 3. Controlador de Digitação
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErroValidacao("");
  };

  // 4. Lógica de Envio (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroValidacao("");

    // --- Validação de Duplicidade (Ignorando o ID atual) ---
    const numeroSerieDigitado = form.numero_serie.trim().toLowerCase();
    const duplicado = equipamentos.find((item) => {
      return (
        item.id !== equipamento.id &&
        item.numero_serie.trim().toLowerCase() === numeroSerieDigitado
      );
    });

    if (duplicado) {
      setErroValidacao(`Atenção! Outro equipamento já utiliza a série (${duplicado.numero_serie}).`);
      setSalvando(false);
      return;
    }

    // --- Disparo para a API ---
    try {
      const dados = {
        nome: form.nome,
        descricao: form.descricao,
        categoria: form.categoria,
        numero_serie: form.numero_serie,
        status: form.status, // Envia o status atualizado do <select>
        observacoes: form.observacoes,
      };

      const resposta = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/equipamentos/${equipamento.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        }
      );

      if (resposta.ok) {
        atualizarLista();
        onClose();
      } else {
        const dadosErro = await resposta.json();
        setErroValidacao(dadosErro.erro || "Erro ao atualizar no servidor.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErroValidacao("Não foi possível conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  };

  // 5. O LAYOUT RESPONSIVO E ACESSÍVEL
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      
      {/*Caixa principal com ARIA Dialog */}
      <main
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edicao-title"
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
      >
        <header className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 id="modal-edicao-title" className="text-xl font-bold text-slate-800">
            Editar Equipamento
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            aria-label="Fechar modal de edição"
          >
            <FaXmark className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-left">
          
          {/*Alerta lido pelos leitores de tela */}
          {erroValidacao && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm font-medium">
              {erroValidacao}
            </div>
          )}

          <div>
            {/* Id amarrado ao htmlFor */}
            <label htmlFor="edit-nome" className="block text-xs font-bold text-slate-600 uppercase mb-1">Nome do Equipamento</label>
            <input required id="edit-nome" type="text" name="nome" value={form.nome} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors" />
          </div>

          <div>
            <label htmlFor="edit-descricao" className="block text-xs font-bold text-slate-600 uppercase mb-1">Descrição Breve</label>
            <input required id="edit-descricao" type="text" name="descricao" value={form.descricao} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors" />
          </div>

          {/* Responsividade: Empilha no celular (grid-cols-1), lado a lado no PC (sm:grid-cols-2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-categoria" className="block text-xs font-bold text-slate-600 uppercase mb-1">Categoria</label>
              <input required id="edit-categoria" type="text" name="categoria" value={form.categoria} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors" />
            </div>
            <div>
              <label htmlFor="edit-numero_serie" className="block text-xs font-bold text-slate-600 uppercase mb-1">Série/Patrimônio</label>
              <input required id="edit-numero_serie" type="text" name="numero_serie" value={form.numero_serie} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors" />
            </div>
          </div>

          <div>
            <label htmlFor="edit-status" className="block text-xs font-bold text-slate-600 uppercase mb-1">Status Atual</label>
            <select 
              id="edit-status" 
              name="status" 
              value={form.status} 
              onChange={handleChange} 
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors bg-white cursor-pointer"
            >
              <option value="Disponível">Disponível</option>
              <option value="Emprestado">Emprestado</option>
              <option value="Em Manutenção">Em Manutenção</option>
              <option value="Baixa">Baixa (Inutilizado)</option>
            </select>
          </div>

          <div>
            <label htmlFor="edit-observacoes" className="block text-xs font-bold text-slate-600 uppercase mb-1">Observações</label>
            <textarea 
              id="edit-observacoes" 
              name="observacoes" 
              value={form.observacoes} 
              onChange={handleChange} 
              rows="3" 
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors resize-none"
            />
          </div>
        </form>

        <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white p-4">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={salvando} 
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 min-h-[44px]"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={salvando} 
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 min-h-[44px]"
          >
            <FaFloppyDisk aria-hidden="true" />
            <span>{salvando ? "Salvando..." : "Salvar Alterações"}</span>
          </button>
        </footer>
      </main>
    </div>
  );
}