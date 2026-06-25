import React, { useState, useEffect } from "react";
import { FaXmark, FaFloppyDisk } from "react-icons/fa6";

export default function ModalCadastro({
  isOpen,
  onClose,
  beneficiarios,
  atualizarLista,
}) {
  // Estado inicial para limpar o formulário depois
  const estadoInicial = {
    nome: "",
    documento: "",
    email: "",
    telefone: "",
    endereco: "",
    foto: null,
    data_nascimento: "",
  };

  const [form, setForm] = useState(estadoInicial);
  const [salvando, setSalvando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState("");

  //ESCUTA DO TECLADO: Fecha o modal ao apertar a tecla ESC
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

  // Manipulador específico para o input de arquivo (Multer)
  const handleFileChange = (e) => {
    setForm({ ...form, foto: e.target.files[0] });
  };

  // O Coração do Envio e Validação de Duplicados
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroValidacao("");

    // --- ESCUDO DO FRONT-END: Validação de Duplicidade ---
    const documentoDigitado = form.documento.trim();
    const nomeDigitado = form.nome.trim().toLowerCase();

    const beneficiarioExistente = beneficiarios.find((item) => {
      return (
        item.documento.trim() === documentoDigitado ||
        item.nome.trim().toLowerCase() === nomeDigitado
      );
    });

    if (beneficiarioExistente) {
      setErroValidacao(
        `Atenção! Já existe um cadastro com este documento ou nome (${beneficiarioExistente.nome}).`
      );
      setSalvando(false);
      return; // Interrompe o fluxo se for duplicado
    }

    // O bloco try/catch agora está fora do IF!
    try {
      // Como tem foto física, precisamos usar FormData em vez de JSON comum
      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("documento", form.documento);
      formData.append("email", form.email);
      formData.append("telefone", form.telefone);
      formData.append("endereco", form.endereco);
      formData.append("data_nascimento", form.data_nascimento);
      formData.append("data_cadastro", new Date().toISOString().split("T")[0]); // Gera a data de hoje automaticamente!

      if (form.foto) {
        formData.append("foto", form.foto);
      }

      const resposta = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/beneficiarios",
        {
          method: "POST",
          body: formData,
        }
      );

      if (resposta.ok) {
        atualizarLista(); // Avisa o Pai para recarregar a tabela de beneficiários automaticamente
        setForm(estadoInicial); // Limpa os campos do formulário
        onClose(); // Fecha o modal
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
            Cadastrar Novo Beneficiário
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
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm font-medium">
              {erroValidacao}
            </div>
          )}

          <div>
            {/* Ligação do label com input através do htmlFor e id */}
            <label htmlFor="nome" className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Nome Completo
            </label>
            <input
              required
              id="nome"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
              placeholder="Ex: Bruce Willis"
            />
          </div>

          {/* Grid responsiva: 1 coluna no mobile, 2 colunas a partir do 'sm:' */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="documento" className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Documento / CPF
              </label>
              <input
                required
                id="documento"
                type="text"
                name="documento"
                value={form.documento}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
                placeholder="Apenas números"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Telefone
              </label>
              <input
                required
                id="telefone"
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase mb-1">
              E-mail
            </label>
            <input
              required
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
              placeholder="exemplo@email.com"
            />
          </div>

          <div>
            <label htmlFor="endereco" className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Endereço Residencial
            </label>
            <input
              required
              id="endereco"
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
              placeholder="Rua, número, bairro..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="data_nascimento" className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Data de Nascimento
              </label>
              <input
                required
                id="data_nascimento"
                type="date"
                name="data_nascimento"
                value={form.data_nascimento}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
              />
            </div>
            <div>
              <label htmlFor="foto" className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Foto de Perfil
              </label>
              <input
                required
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          </div>

          {/* Rodapé de Ações do Form - Fixo na base para facilitar rolagem */}
          <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
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
              <span>{salvando ? "Salvando..." : "Salvar Beneficiário"}</span>
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}