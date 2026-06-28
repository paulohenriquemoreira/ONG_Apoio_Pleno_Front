import React, { useState, useEffect } from "react";
import { FaXmark, FaFloppyDisk } from "react-icons/fa6";

export default function ModalCadastroEquipamento({
  isOpen,
  onClose,
  equipamentos,
  atualizarLista,
}) {
  // Estado inicial para limpar o formulário depois
  const estadoInicial = {
    nome: "",
    descricao: "",
    categoria: "",
    numero_serie: "",
    status: "Disponível",
    observacoes: "",
  };

  const [form, setForm] = useState(estadoInicial);
  const [salvando, setSalvando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState("");

  //Escultar o teclado ao apertar ESC para fechar o modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Se o modal não estiver aberto, não renderiza nada na tela
  if (!isOpen) return null;

  // Manipulador dos inputs de texto normais
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErroValidacao(""); // Limpa o erro enquanto o usuário digita
  };

  // O Coração do Envio e Validação de Duplicados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroValidacao("");

    // --- ESCUDO DO FRONT-END: Validação de Duplicidade ---
    const numeroSerieDigitado = form.numero_serie.trim().toLowerCase();

    const equipamentoExistente = equipamentos.find((item) => {
      return item.numero_serie.trim().toLowerCase() === numeroSerieDigitado;
    });

    if (equipamentoExistente) {
      setErroValidacao(
        `Atenção! Já existe um equipamento com este número de série registrado (${equipamentoExistente.numero_serie}).`,
      );
      setSalvando(false);
      return;
    }

    try {
      const dados = {
        nome: form.nome,
        descricao: form.descricao,
        categoria: form.categoria,
        numero_serie: form.numero_serie,
        status: form.status, // Puxa o "Disponível" do estado inicial
        data_aquisicao: new Date().toISOString().split("T")[0],
        observacoes: form.observacoes,
      };

      const resposta = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/equipamentos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // 🚨 Corrigido: era Content-Type e não Context-Type
          body: JSON.stringify(dados),
        },
      );

      if (resposta.ok) {
        atualizarLista(); // Avisa o Pai para recarregar a tabela automaticamente
        setForm(estadoInicial); // Limpa os campos do formulário
        onClose(); //Fecha modal
      } else {
        const dadosErro = await resposta.json();
        setErroValidacao(dadosErro.erro || "Erro ao salvar no servidor.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErroValidacao("Não foi possível conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    // Backdrop escuro do Modal
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Caixa estrutural do Modal com tags ARIA de Diálogo */}
      <main
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Cabeçalho do Modal */}
        <header className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 id="modal-title" className="text-xl font-bold text-slate-800">
            Cadastrar Novo Equipamento
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            aria-label="Fechar modal" /* Evita botões sem nome no leitor de tela */
          >
            <FaXmark className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        {/* Corpo do Formulário com Rolagem Responsiva */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-left"
        >
          {/* Exibição de Erros de Validação */}
          {erroValidacao && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm font-medium"
            >
              {erroValidacao}
            </div>
          )}

          <div>
            {/* Ligação do label com input através do htmlFor e id */}
            <label
              htmlFor="nome"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Nome do Equipamento
            </label>
            <input
              required
              id="nome"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
              placeholder="Ex: Cadeira de Rodas"
            />
          </div>

          {/* Campo Descrição adicionado para amarrar com o estado inicial */}
          <div>
            <label
              htmlFor="descricao"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Descrição Breve
            </label>
            <input
              required
              id="descricao"
              type="text"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
              placeholder="Ex: Cadeira de rodas adulto em alumínio"
            />
          </div>

          {/* Grid responsiva: 1 coluna no mobile, 2 colunas a partir do 'sm:' */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="categoria"
                className="block text-xs font-bold text-slate-600 uppercase mb-1"
              >
                Categoria
              </label>
              <input
                required
                id="categoria"
                type="text"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
                placeholder="Ex: Mobilidade"
              />
            </div>
            <div>
              <label
                htmlFor="numero_serie"
                className="block text-xs font-bold text-slate-600 uppercase mb-1"
              >
                Número de Série
              </label>
              <input
                required
                id="numero_serie"
                type="text" // Mantido como text para suportar letras em códigos de patrimônio
                name="numero_serie"
                value={form.numero_serie}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
                placeholder="Ex: 1009005"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="observacoes"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Observações
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={form.observacoes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors resize-none"
              placeholder="Ex: Equipamento com..."
            />
          </div>
        </form>

        {/* Rodapé de Ações do Form - Fixo na base para facilitar rolagem */}
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
            <span>{salvando ? "Salvando..." : "Salvar Equipamento"}</span>
          </button>
        </footer>
      </main>
    </div>
  );
}
