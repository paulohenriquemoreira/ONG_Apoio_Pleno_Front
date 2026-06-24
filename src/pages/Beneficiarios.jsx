import { useState, useEffect } from "react";
import {
  FaUserGroup,
  FaUser,
  FaPlus,
  FaPen,
  FaRegTrashCan,
} from "react-icons/fa6";

export default function Beneficiarios() {
  const [beneficiarios, setBeneficiarios] = useState([]);

  useEffect(() => {
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
    buscarDadosApi();
  }, []);

  return (
    <main
      role="main"
      className="space-y-8 animate-fade-in"
      aria-label="Página Beneficiários"
    >
      {/* 1. CABEÇALHO DA PÁGINA */}
      <header className="flex justify-between items-center">
        <div>
          <h1
            id="titulo-pagina"
            className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-2"
          >
            <FaUserGroup className="text-blue-600" aria-hidden="true" />
            <span>Gestão de Beneficiários</span>
          </h1>
          <p className="text-slate-500 mt-1">
            Cadastre e gerencie as famílias atendidas pela ONG.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
          <FaPlus aria-hidden="true" />
          <span>Novo Beneficiário</span>
        </button>
      </header>
      {/* Tabela de Dados */}
      <section
        aria-label="Lista de Beneficiários"
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase">
            <tr>
              <th className="p-4">Foto</th>
              <th className="p-4">Nome Completo</th>
              <th className="p-4">Documento / CPF</th>
              <th className="p-4">Telefone</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
            {beneficiarios.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                    {item.foto ? (
                      <img
                        src={`https://ong-apoio-pleno-api.onrender.com/upload/${item.foto}`}
                        alt={`Foto de perfil de ${item.nome}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* Se o beneficiário não tiver foto, mostra uma letra ou ícone padrão */
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-100">
                        {item.nome.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium text-slate-900">{item.nome}</td>
                <td className="p-4">{item.documento}</td>
                <td className="p-4">{item.telefone}</td>
                <td className="p-4 text-center">
                  {/* Espaço para os futuros botões de ação */}
                  <div className="flex justify-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      <FaPen />
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-medium">
                      <FaRegTrashCan />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
