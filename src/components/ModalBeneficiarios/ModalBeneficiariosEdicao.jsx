import React, { useState, useEffect } from "react";
import { FaXmark, FaFloppyDisk } from "react-icons/fa6";

export default function ModalEdicao({
  isOpen,
  onClose,
  beneficiario,
  beneficiarios = [],
  atualizarLista,
}) {
  const [form, setForm] = useState({
    nome: "",
    documento: "",
    email: "",
    telefone: "",
    endereco: "",
    foto: null,
    data_nascimento: "",
    data_cadastro: "",
  });
  const [salvando, setSalvando] = useState(false);
  const [erroValidacao, setErroValidacao] = useState("");

  // Sincroniza os dados do beneficiário selecionado com o estado do formulário sempre que o modal abrir.
  useEffect(() => {
    if (beneficiario) {
      setForm({
        nome: beneficiario.nome || "",
        documento: beneficiario.documento || "",
        email: beneficiario.email || "",
        telefone: beneficiario.telefone || "",
        endereco: beneficiario.endereco || "",
        foto: null,
        data_nascimento: beneficiario.data_nascimento || "",
        data_cadastro:
          beneficiario.data_cadastro || new Date().toISOString().split("T")[0],
      });
      setErroValidacao("");
    }
  }, [beneficiario, isOpen]);

  // Monitora o teclado e fecha a janela ao detectar o pressionamento da tecla ESC.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Evita a renderização caso os dados do modal ou do beneficiário não existam.
  if (!isOpen || !beneficiario) return null;

  // Atualiza dinamicamente os valores de texto durante a digitação.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErroValidacao("");
  };

  // Trata a alteração do arquivo de imagem injetando o anexo fisicamente no estado.
  const handleFileChange = (e) => {
    setForm({ ...form, foto: e.target.files[0] });
  };

  // Submete os dados atualizados formatando rigorosamente em FormData para compatibilidade com o Multer.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroValidacao("");

    const documentoDigitado = form.documento ? form.documento.trim() : "";
    const nomeDigitado = form.nome ? form.nome.trim().toLowerCase() : "";

    // Faz a validação segura de duplicidade, prevenindo falhas caso o array venha vazio.
    const listaSegura = Array.isArray(beneficiarios) ? beneficiarios : [];
    const duplicado = listaSegura.find((item) => {
      const itemDoc = item.documento ? item.documento.trim() : "";
      const itemName = item.nome ? item.nome.trim().toLowerCase() : "";
      return (
        item.id !== beneficiario.id &&
        (itemDoc === documentoDigitado || itemName === nomeDigitado)
      );
    });

    if (duplicado) {
      setErroValidacao(
        `Atenção! Outro beneficiário já possui este documento ou nome (${duplicado.nome}).`,
      );
      setSalvando(false);
      return;
    }

    try {
      // Estrutura obrigatoriamente os dados em FormData para ser aceito pela rota do Back-end.
      const formData = new FormData();
      formData.append("nome", form.nome);
      formData.append("documento", form.documento);
      formData.append("email", form.email);
      formData.append("telefone", form.telefone);
      formData.append("endereco", form.endereco);
      formData.append("data_nascimento", form.data_nascimento);

      if (form.data_cadastro) {
        formData.append("data_cadastro", form.data_cadastro);
      }

      if (form.foto) {
        formData.append("foto", form.foto);
      }

      // Executa a requisição de atualização apontando para a API hospedada no Render.
      const resposta = await fetch(
        `https://ong-apoio-pleno-api.onrender.com/api/beneficiarios/${beneficiario.id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (resposta.ok) {
        atualizarLista();
        onClose();
      } else {
        // Tenta ler o JSON com segurança caso o servidor retorne texto puro ou erro HTML
        let mensagemErro = "Falha do servidor ao tentar salvar as alterações.";
        try {
          const dadosErro = await resposta.json();
          mensagemErro = dadosErro.mensagem || dadosErro.erro || mensagemErro;
        } catch {
          mensagemErro = `Erro HTTP ${resposta.status}: Servidor indisponível ou resposta inválida.`;
        }
        console.error("Resposta do servidor:", mensagemErro);
        setErroValidacao(mensagemErro);
      }
    } catch (error) {
      console.error("Erro na requisição HTTP:", error);
      setErroValidacao("Não foi possível alcançar a API na nuvem.");
    } finally {
      // O bloco finally garante obrigatoriamente que o botão será destravado independentemente do sucesso ou erro
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <main
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-edicao-title"
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
      >
        <header className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
          <h2
            id="modal-edicao-title"
            className="text-xl font-bold text-slate-800"
          >
            Editar Beneficiário
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            aria-label="Fechar modal de edição"
          >
            <FaXmark className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-left"
        >
          {erroValidacao && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm font-medium"
            >
              {erroValidacao}
            </div>
          )}

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-white flex-shrink-0">
              {beneficiario.foto ? (
                <img
                  src={`https://ong-apoio-pleno-api.onrender.com/upload/${beneficiario.foto}`}
                  alt="Foto atual"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg bg-slate-100">
                  {form.nome ? form.nome.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">
                Foto cadastrada atualmente
              </p>
              <p className="text-xs text-slate-400 truncate max-w-[250px]">
                {beneficiario.foto || "Nenhuma foto salva"}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-nome"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Nome Completo
            </label>
            <input
              required
              id="edit-nome"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-documento"
                className="block text-xs font-bold text-slate-600 uppercase mb-1"
              >
                Documento / CPF
              </label>
              <input
                required
                id="edit-documento"
                type="text"
                name="documento"
                value={form.documento}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-telefone"
                className="block text-xs font-bold text-slate-600 uppercase mb-1"
              >
                Telefone
              </label>
              <input
                required
                id="edit-telefone"
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-email"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              E-mail
            </label>
            <input
              required
              id="edit-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="edit-endereco"
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Endereço
            </label>
            <input
              required
              id="edit-endereco"
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-nascimento"
                className="block text-xs font-bold text-slate-600 uppercase mb-1"
              >
                Data de Nascimento
              </label>
              <input
                required
                id="edit-nascimento"
                type="date"
                name="data_nascimento"
                value={form.data_nascimento}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="edit-foto"
                className="block text-xs font-bold text-slate-600 uppercase mb-1"
              >
                Alterar Foto (Opcional)
              </label>
              <input
                id="edit-foto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          </div>

          <footer className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
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
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 min-h-[44px]"
            >
              <FaFloppyDisk aria-hidden="true" />
              <span>{salvando ? "Atualizando..." : "Salvar Alterações"}</span>
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
}