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
  LabelList,
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

  // Executa o resgate de dados em paralelo e processa as métricas de negócio de forma centralizada.
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [resEq, resEmp, resDoacoes, resEntregas, resBen] =
          await Promise.all([
            fetch("https://ong-apoio-pleno-api.onrender.com/api/equipamentos"),
            fetch("https://ong-apoio-pleno-api.onrender.com/api/emprestimos"),
            fetch("https://ong-apoio-pleno-api.onrender.com/api/doacoes"),
            fetch("https://ong-apoio-pleno-api.onrender.com/api/entregas"),
            fetch("https://ong-apoio-pleno-api.onrender.com/api/beneficiarios"),
          ]);

        const todosEquipamentos = await resEq.json();
        const todosEmprestimos = await resEmp.json();
        const todasDoacoes = await resDoacoes.json();
        const todasEntregas = await resEntregas.json();
        const todosBeneficiarios = await resBen.json();

        // Calcula KPIs básicos baseando-se no estado atual do banco de dados.
        const qtdManutencao = Array.isArray(todosEquipamentos)
          ? todosEquipamentos.filter(
              (e) => e.status?.toLowerCase() === "em manutenção",
            ).length
          : 0;
        const qtdDisponivel = Array.isArray(todosEquipamentos)
          ? todosEquipamentos.filter(
              (e) => e.status?.toLowerCase() === "disponível",
            ).length
          : 0;
        const qtdUso = Array.isArray(todosEquipamentos)
          ? todosEquipamentos.filter(
              (e) => e.status?.toLowerCase() === "emprestado",
            ).length
          : 0;
        const qtdFamilias = Array.isArray(todosBeneficiarios)
          ? todosBeneficiarios.length
          : 0;

        // Mapeia a frequência de uso dos equipamentos para compor o gráfico de requisitados.
        const contagemEquipamentos = {};
        if (Array.isArray(todosEmprestimos)) {
          todosEmprestimos.forEach((emp) => {
            if (emp.equipamento_nome) {
              contagemEquipamentos[emp.equipamento_nome] =
                (contagemEquipamentos[emp.equipamento_nome] || 0) + 1;
            }
          });
        }

        const graficoMaisRequisitados = Object.keys(contagemEquipamentos)
          .map((nome) => ({ name: nome, value: contagemEquipamentos[nome] }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        // Soma as quantidades de suprimentos de forma granular para os relatórios de estoque.
        const somarItem = (lista, categoriaAlvo, termo) =>
          lista
            .filter(
              (item) =>
                item.categoria === categoriaAlvo ||
                (item.item && item.item.toLowerCase().includes(termo)),
            )
            .reduce((acc, curr) => acc + Number(curr.quantidade || 0), 0);

        const cestasRecebidas = somarItem(todasDoacoes, "Alimento", "cesta");
        const cestasDoadas = somarItem(todasEntregas, "Alimento", "cesta");
        const roupasRecebidas = somarItem(todasDoacoes, "Vestuário", "roupa");
        const roupasDoadas = somarItem(todasEntregas, "Vestuário", "roupa");

        setResumo({
          kpis: {
            familias: qtdFamilias,
            equipamentos_uso: qtdUso,
            estoque_disponivel: qtdDisponivel,
            manutencao: qtdManutencao,
          },
          mais_requisitados: graficoMaisRequisitados,
          suprimentos: {
            cestas: { recebidas: cestasRecebidas, doadas: cestasDoadas },
            roupas: { recebidas: roupasRecebidas, doadas: roupasDoadas },
          },
        });

        // Identifica empréstimos ativos com data de devolução vencida para compor o alerta.
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        setAlertaBeneficiarios(
          Array.isArray(todosEmprestimos)
            ? todosEmprestimos.filter((emp) => {
                if (emp.status && emp.status.toLowerCase() === "devolvido")
                  return false;
                const dataDev = new Date(emp.data_devolucao);
                dataDev.setHours(0, 0, 0, 0);
                return hoje > dataDev;
              })
            : [],
        );
      } catch (erro) {
        console.error("Erro ao processar dados:", erro);
      }
    };

    buscarDados();
  }, []);

  const alertasFiltrados = alertaBeneficiarios.filter((b) =>
    b.beneficiario_nome?.toLowerCase().includes(termoBusca.toLowerCase()),
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
      </header>

      {alertasFiltrados.length > 0 && (
        <section className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm">
          <div className="flex items-center gap-3 text-amber-800 font-bold mb-2">
            <FaTriangleExclamation /> <h2>Empréstimos Vencidos</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
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

        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
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
                  width={120}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6">
                  <LabelList dataKey="value" position="right" fill="#64748b" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800 mb-4">Resumo de Suprimentos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 border p-4 rounded-lg bg-slate-50">
            <FaBasketShopping className="text-3xl text-emerald-600" />
            <div>
              <p className="font-bold text-slate-800">Cestas Básicas</p>
              <div className="flex gap-4 text-sm mt-1">
                <span className="text-emerald-700 font-medium bg-emerald-100 px-2 rounded">
                  Recebidas: {resumo.suprimentos.cestas.recebidas}
                </span>
                <span className="text-blue-700 font-medium bg-blue-100 px-2 rounded">
                  Doadas: {resumo.suprimentos.cestas.doadas}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 border p-4 rounded-lg bg-slate-50">
            <FaShirt className="text-3xl text-emerald-600" />
            <div>
              <p className="font-bold text-slate-800">Roupas / Vestuário</p>
              <div className="flex gap-4 text-sm mt-1">
                <span className="text-emerald-700 font-medium bg-emerald-100 px-2 rounded">
                  Recebidas: {resumo.suprimentos.roupas.recebidas}
                </span>
                <span className="text-blue-700 font-medium bg-blue-100 px-2 rounded">
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
