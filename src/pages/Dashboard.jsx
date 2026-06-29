import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FaUserGroup,
  FaWheelchairMove,
  FaBox,
  FaWrench,
  FaTriangleExclamation,
  FaBasketShopping,
  FaShirt,
} from "react-icons/fa6";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [resumo, setResumo] = useState({
    kpis: {
      familias: 0,
      equipamentos_uso: 0,
      estoque_disponivel: 0,
      manutencao: 0,
    },
    mais_requisitados: [],
    suprimentos: {
      cestas: { recebidas: 0, doadas: 0 },
      roupas: { recebidas: 0, doadas: 0 },
    },
  });
  const [alertaBeneficiarios, setAlertaBeneficiarios] = useState([]);
  const [termoBusca] = useOutletContext();

  // Executa rotinas preparatórias e acumula respostas processadas ativando matrizes consolidadas primárias.
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resResumo = await fetch(
          "https://ong-apoio-pleno-api.onrender.com/api/dashboard",
        );
        const dados = await resResumo.json();
        setResumo(dados);

        const resEmp = await fetch(
          "https://ong-apoio-pleno-api.onrender.com/api/emprestimos",
        );
        const todosEmprestimos = await resEmp.json();

        const hoje = new Date();
        setAlertaBeneficiarios(
          todosEmprestimos.filter((emp) => {
            if (emp.status !== "Ativo") return false;
            return (
              (hoje - new Date(emp.data_inicio)) / (1000 * 60 * 60 * 24) > 30
            );
          }),
        );
      } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
      }
    };
    buscarDados();
  }, []);

  // Extrai as frações identificadas repassando elementos específicos dependentes em formato limpo.
  const alertasFiltrados = alertaBeneficiarios.filter((b) =>
    b.beneficiario_nome.toLowerCase().includes(termoBusca.toLowerCase()),
  );

  const dadosEstoque = [
    {
      name: "Emprestados",
      value: resumo.kpis.equipamentos_uso,
      color: "#3b82f6",
    },
    {
      name: "Disponíveis",
      value: resumo.kpis.estoque_disponivel,
      color: "#22c55e",
    },
    { name: "Em Manutenção", value: resumo.kpis.manutencao, color: "#ef4444" },
  ];

  return (
    <main role="main" className="space-y-8 animate-fade-in p-4 sm:p-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500">Visão geral da operação da ONG</p>
      </header>

      {/* Condiciona visualmente relatórios provindos dos cálculos passados se as respostas acusarem retornos. */}
      {alertasFiltrados.length > 0 && (
        <section className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-sm">
          <div className="flex items-center gap-3 text-amber-800 font-bold mb-2">
            <FaTriangleExclamation />{" "}
            <h2>Atenção: Acompanhamento Necessário</h2>
          </div>
          <ul className="list-disc list-inside text-sm text-amber-800">
            {alertasFiltrados.map((b) => (
              <li key={b.id}>
                {b.beneficiario_nome} - {b.equipamento_nome}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Acopla e disponibiliza os resumos atrelados baseados no repasse constante do front-end contínuo. */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Famílias",
            val: resumo.kpis.familias,
            icon: <FaUserGroup />,
            color: "blue",
          },
          {
            label: "Em Uso",
            val: resumo.kpis.equipamentos_uso,
            icon: <FaWheelchairMove />,
            color: "green",
          },
          {
            label: "Estoque",
            val: resumo.kpis.estoque_disponivel,
            icon: <FaBox />,
            color: "orange",
          },
          {
            label: "Manutenção",
            val: resumo.kpis.manutencao,
            icon: <FaWrench />,
            color: "red",
          },
        ].map((kpi, idx) => (
          <article
            key={idx}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-sm"
          >
            <div
              className={`text-2xl text-${kpi.color}-600 bg-${kpi.color}-100 p-3 rounded-lg`}
            >
              {kpi.icon}
            </div>
            <div>
              <h2 className="text-[10px] font-bold uppercase text-slate-400">
                {kpi.label}
              </h2>
              <p className="text-2xl font-bold text-slate-800">{kpi.val}</p>
            </div>
          </article>
        ))}
      </section>

      {/* Estabelece molduras visuais de medição fracionadas garantindo espaço de renderização condicional externa. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">Saúde do Estoque</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosEstoque}
                  innerRadius={60}
                  outerRadius={80}
                  dataKey="value"
                >
                  {dadosEstoque.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-sm">
          <h2 className="font-bold text-slate-800 mb-4">
            Equipamentos Mais Requisitados
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resumo.mais_requisitados} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-sm">
        <h2 className="font-bold text-slate-800 mb-4">Resumo de Suprimentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 border p-4 rounded-lg">
            <FaBasketShopping className="text-3xl text-emerald-600" />
            <div>
              <p className="font-bold">Cestas Básicas</p>
              <div className="flex gap-4 text-sm">
                <span className="text-emerald-600">
                  Recebidas: {resumo.suprimentos.cestas.recebidas}
                </span>
                <span className="text-blue-600">
                  Doadas: {resumo.suprimentos.cestas.doadas}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 border p-4 rounded-lg">
            <FaShirt className="text-3xl text-emerald-600" />
            <div>
              <p className="font-bold">Roupas</p>
              <div className="flex gap-4 text-sm">
                <span className="text-emerald-600">
                  Recebidas: {resumo.suprimentos.roupas.recebidas}
                </span>
                <span className="text-blue-600">
                  Doadas: {resumo.suprimentos.roupas.doadas}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
