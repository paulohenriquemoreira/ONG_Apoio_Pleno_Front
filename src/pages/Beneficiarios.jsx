import { useState, useEffect } from "react";
import {
  FaUserGroup,
  FaPlus,
  FaPen,
  FaRegTrashCan,
} from "react-icons/fa6";
import ModalCadastro from "../components/ModalCadastro";
import ModalEdicao from "../components/ModalEdicao";
import ModalExclusao from "../components/ModalExclusao";

export default function Beneficiarios() {
  const [beneficiarios, setBeneficiarios] = useState([]);
  
  // Estados para controlar a visibilidade de cada Modal
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

  // 🧠 A memória que guarda qual linha da tabela foi clicada (Editar ou Excluir)
  const [beneficiarioSelecionado, setBeneficiarioSelecionado] = useState(null);

  // Função para buscar dados da API
  const buscarDadosApi = async () => {
    try {
      const response = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/beneficiarios"
      );
      const dadosReais = await response.json();
      setBeneficiarios(dadosReais);
    } catch (error) {
      console.error("Opa! Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    buscarDadosApi();
  }, []);

  // Handlers para abrir os modais limpando ou setando o item ativo
  const abrirEdicao = (beneficiario) => {
    setBeneficiarioSelecionado(beneficiario);
    setModalEdicaoAberto(true);
  };

  const abrirExclusao = (beneficiario) => {
    setBeneficiarioSelecionado(beneficiario);
    setModalExclusaoAberto(true);
  };

  return (
    <main
      role="main"
      className="space-y-8 animate-fade-in p-4 sm:p-0"
      aria-label="Página de Gestão de Beneficiários"
    >
      {/* CABEÇALHO DA PÁGINA */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            id="titulo-pagina"
            className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2"
          >
            <FaUserGroup className="text-blue-600" aria-hidden="true" />
            <span>Gestão de Beneficiários</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Cadastre e gerencie as famílias atendidas pela ONG.
          </p>
        </div>
        
        <button 
          onClick={() => setModalCadastroAberto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
        >
          <FaPlus aria-hidden="true" />
          <span>Novo Beneficiário</span>
        </button>
      </header>

      {/*TABELA DE DADOS */}
      <section
        aria-label="Tabela de Beneficiários Atendidos"
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase whitespace-nowrap">
              <tr>
                <th className="p-4 w-16">Foto</th>
                <th className="p-4">Nome Completo</th>
                <th className="p-4">Documento / CPF</th>
                <th className="p-4">Telefone</th>
                <th className="p-4 text-center w-24">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-sm text-slate-700 whitespace-nowrap">
              {beneficiarios.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                      {item.foto ? (
                        <img
                          src={`https://ong-apoio-pleno-api.onrender.com/upload/${item.foto}`}
                          alt={`Foto de perfil de ${item.nome}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-100" aria-hidden="true">
                          {item.nome.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-900">{item.nome}</td>
                  <td className="p-4">{item.documento}</td>
                  <td className="p-4">{item.telefone}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      
                      {/* Botão de Editar -> Captura o item e abre o ModalEdicao */}
                      <button 
                        onClick={() => abrirEdicao(item)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition"
                        aria-label={`Editar cadastro de ${item.nome}`}
                      >
                        <FaPen aria-hidden="true" />
                      </button>
                      
                      {/* Botão de Excluir -> Captura o item e abre o ModalExclusao */}
                      <button 
                        onClick={() => abrirExclusao(item)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition"
                        aria-label={`Excluir cadastro de ${item.nome}`}
                      >
                        <FaRegTrashCan aria-hidden="true" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ModalCadastro 
        isOpen={modalCadastroAberto}
        onClose={() => setModalCadastroAberto(false)}
        beneficiarios={beneficiarios}
        atualizarLista={buscarDadosApi}
      />
      <ModalEdicao 
        isOpen={modalEdicaoAberto}
        onClose={() => {
          setModalEdicaoAberto(false);
          setBeneficiarioSelecionado(null); // Limpa a memória ao fechar
        }}
        beneficiario={beneficiarioSelecionado}
        beneficiarios={beneficiarios}
        atualizarLista={buscarDadosApi}
      />
      <ModalExclusao 
        isOpen={modalExclusaoAberto}
        onClose={() => {
          setModalExclusaoAberto(false);
          setBeneficiarioSelecionado(null); // Limpa a memória ao fechar
        }}
        beneficiario={beneficiarioSelecionado}
        atualizarLista={buscarDadosApi}
      />
    </main>
  );
}