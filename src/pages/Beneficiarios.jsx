import { useState, useEffect } from "react";
import { FaUserGroup, FaPlus, FaPen, FaRegTrashCan } from "react-icons/fa6";
import ModalCadastro from "../components/ModalBeneficiarios/ModalBeneficiariosCadastro";
import ModalEdicao from "../components/ModalBeneficiarios/ModalBeneficiariosEdicao";
import ModalExclusao from "../components/ModalBeneficiarios/ModalBeneficiariosExclusao";

export default function Beneficiarios() {
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [beneficiarioSelecionado, setBeneficiarioSelecionado] = useState(null);

  const buscarDadosApi = async () => {
    try {
      const resposta = await fetch(
        "https://ong-apoio-pleno-api.onrender.com/api/beneficiarios",
      );
      const dadosReais = await resposta.json();
      setBeneficiarios(dadosReais);
    } catch (error) {
      console.error("Opa! Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    buscarDadosApi();
  }, []);

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
      className="space-y-8 animate-fade-in p-4 sm:p-6"
      aria-labelledby="pagina-beneficiarios"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            id="pagina-beneficiarios"
            className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2"
          >
            <FaUserGroup className="text-blue-600" aria-hidden="true" />
            <span>Gestão de Beneficiários</span>
          </h1>
        </div>
        <button
          onClick={() => setModalCadastroAberto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <FaPlus aria-hidden="true" /> Novo Beneficiário
        </button>
      </header>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          {/* Esconde o cabeçalho no mobile */}
          <thead className="hidden sm:table-header-group bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
            <tr>
              <th className="p-4">Foto</th>
              <th className="p-4">Nome Completo</th>
              <th className="p-4">Documento / CPF</th>
              <th className="p-4">Telefone</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {beneficiarios.map((item) => (
              <tr
                key={item.id}
                className="block sm:table-row p-4 sm:p-0 hover:bg-slate-50"
              >
                {/* Foto: Escondida no Mobile */}
                <td className="hidden sm:table-cell p-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {item.foto ? (
                      <img
                        src={`https://ong-apoio-pleno-api.onrender.com/upload/${item.foto}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-slate-400">
                        {item.nome.charAt(0)}
                      </span>
                    )}
                  </div>
                </td>

                {/* Nome: Com label no Mobile */}
                <td
                  className="p-2 sm:p-4 block sm:table-cell text-right sm:text-left before:content-[attr(data-label)] before:float-left before:font-bold before:text-slate-500 sm:before:content-none"
                  data-label="Nome:"
                >
                  {item.nome}
                </td>

                {/* Documento: Com label no Mobile */}
                <td
                  className="p-2 sm:p-4 block sm:table-cell text-right sm:text-left before:content-[attr(data-label)] before:float-left before:font-bold before:text-slate-500 sm:before:content-none"
                  data-label="Documento:"
                >
                  {item.documento}
                </td>

                {/* Telefone: Com label no Mobile */}
                <td
                  className="p-2 sm:p-4 block sm:table-cell text-right sm:text-left before:content-[attr(data-label)] before:float-left before:font-bold before:text-slate-500 sm:before:content-none"
                  data-label="Telefone:"
                >
                  {item.telefone}
                </td>

                {/* Ações: Sempre visíveis, com label no Mobile */}
                <td
                  className="p-4 block sm:table-cell text-right sm:text-center before:content-[attr(data-label)] before:float-left before:font-bold before:text-slate-500 sm:before:content-none"
                  data-label="Ações:"
                >
                  <div className="flex justify-end sm:justify-center gap-3">
                    <button
                      onClick={() => abrirEdicao(item)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => abrirExclusao(item)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <FaRegTrashCan />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      
      <ModalCadastro
        isOpen={modalCadastroAberto}
        onClose={() => setModalCadastroAberto(false)}
        beneficiarios={beneficiarios}
        atualizarLista={buscarDadosApi}
      />
      <ModalEdicao
        isOpen={modalEdicaoAberto}
        onClose={() => setModalEdicaoAberto(false)}
        beneficiario={beneficiarioSelecionado}
        atualizarLista={buscarDadosApi}
      />
      <ModalExclusao
        isOpen={modalExclusaoAberto}
        onClose={() => setModalExclusaoAberto(false)}
        beneficiario={beneficiarioSelecionado}
        atualizarLista={buscarDadosApi}
      />
    </main>
  );
}
