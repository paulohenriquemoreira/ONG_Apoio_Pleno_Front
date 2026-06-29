import { useState, useEffect } from "react";
import {
  FaUserGroup,
  FaWheelchairMove,
  FaBox,
  FaWrench,
  FaBasketShopping,
  FaShirt,
} from "react-icons/fa6";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [resumo, setResumo] = useState({
    kpis: {
      familias: 0,
      equipamentos_uso: 0,
      estoque_disponivel: 0,
      manutencao: 0,
    },
    suprimentos: {
      cestas: { recebidas: 0, doadas: 0 },
      roupas: { recebidas: 0, doadas: 0 },
    },
  });

  useEffect(() => {
    const buscarDadosApi = async () => {
      try {
        const resposta = await fetch(
          "https://ong-apoio-pleno-api.onrender.com/api/dashboard",
        );
        const dados = await resposta.json();
        setResumo(dados);
      } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
      }
    };
    buscarDadosApi();
  }, []);

  const dadosFluxo = [
    { name: "Jan", recebidas: 110, entregues: 50 },
    { name: "Fev", recebidas: 140, entregues: 70 },
    { name: "Mar", recebidas: 180, entregues: 100 },
    { name: "Abr", recebidas: 160, entregues: 80 },
    { name: "Mai", recebidas: 220, entregues: 130 },
    { name: "Jun", recebidas: 180, entregues: 110 },
  ];

  const dadosRequisitados = [
    { name: "Cadeira de Rodas", quantidade: 98 },
    { name: "Muletas", quantidade: 76 },
    { name: "Cama Hospitalar", quantidade: 54 },
    { name: "Andador", quantidade: 41 },
    { name: "Bengala", quantidade: 29 },
  ];

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
     <main
      role="main"
      className="space-y-8 animate-fade-in p-4 sm:p-6"
      aria-labelledby="pagina-dashboard"
    >
      {/* CABEÇALHO */}
      <header>
        <h1
        id="pagina-dashboard"
        className="text-3xl font-bold text-slate-800">Visão Geral</h1>
        <p className="text-slate-500 mt-1">
          Painel de controle da ONG Apoio Pleno.
        </p>
      </header>

      {/* KPIS */}
      <section
        aria-label="Indicadores Principais"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
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
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4"
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

      {/* GRÁFICOS */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800">Fluxo da Solidariedade</h2>
        <div className="h-64 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosFluxo}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="recebidas"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="entregues"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="font-bold text-slate-800 mb-4">Saúde do Estoque</h2>
          <div className="h-52">
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

        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="font-bold text-slate-800 mb-4">Mais Requisitados</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosRequisitados} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar
                  dataKey="quantidade"
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
}
