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
  // Caixa vazia para evitar o famoso erro Cannot read properties of undefined
  const [resumo, setResumo] = useState({
    kpis: { familias: 0, equipamentos_uso: 0, estoque_disponivel: 0, manutencao: 0 },
    suprimentos: {
      cestas: { recebidas: 0, doadas: 0 },
      roupas: { recebidas: 0, doadas: 0 },
    },
  });

  useEffect(() => {
    const buscarDadosApi = async () => {
      try {
        const resposta = await fetch("https://ong-apoio-pleno-api.onrender.com/api/dashboard");
        const dadosReais = await resposta.json();
        setResumo(dadosReais);
      } catch (erro) {
        console.error("Opa! Erro ao buscar os dados:", erro);
      }
    };
    buscarDadosApi();
  }, []);
/* BLOCO DE CÓDIGOS DO Gráfico de Barras (Top 5 Equipamentos) E DO GRÁFICO FLUXO DE DOAÇÕES MÊS A MÊS
   QUE SERÃO UTILIZADOS EM SEGUNDO MOMENTO.
  // Arrays de gráficos (mantidos fictícios conforme regra anterior até integrarmos essas rotas)
  const dadosFluxo = [
    { name: 'Jan', recebidas: 110, entregues: 50 },
    { name: 'Fev', recebidas: 140, entregues: 70 },
    { name: 'Mar', recebidas: 180, entregues: 100 },
    { name: 'Abr', recebidas: 160, entregues: 80 },
    { name: 'Mai', recebidas: 220, entregues: 130 },
    { name: 'Jun', recebidas: 180, entregues: 110 },
  ];

  const dadosRequisitados = [
    { name: 'Cadeira de Rodas', quantidade: 98 },
    { name: 'Muletas', quantidade: 76 },
    { name: 'Cama Hospitalar', quantidade: 54 },
    { name: 'Andador', quantidade: 41 },
    { name: 'Bengala', quantidade: 29 },
  ];
*/
  const dadosEstoque = [
    { name: "Emprestados", value: resumo.kpis.equipamentos_uso, color: "#3b82f6" },
    { name: "Disponíveis", value: resumo.kpis.estoque_disponivel, color: "#22c55e" },
    { name: "Em Manutenção", value: resumo.kpis.manutencao, color: "#ef4444" },
  ];

  return (
    // role="main" ajuda navegadores antigos a identificar o conteúdo central
    <main role="main" className="space-y-8 animate-fade-in" aria-label="Dashboard Principal">
      
      {/* 1. CABEÇALHO DA PÁGINA */}
      <header aria-labelledby="titulo-pagina">
        <h1 id="titulo-pagina" className="text-3xl font-bold text-slate-800">Visão Geral</h1>
        <p className="text-slate-500 mt-1">
          Bem-vindo ao painel de controle da ONG Apoio Pleno.
        </p>
      </header>

      {/* 2. ROW: KPIs PRINCIPAIS */}
      <section aria-label="Indicadores Principais" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card Famílias */}
        <article className="bg-white hover:bg-blue-50 p-5 rounded-xl shadow-sm border border-slate-200 flex gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-3xl shrink-0">
            <FaUserGroup aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-blue-600 uppercase">Famílias Assistidas</h2>
            <p className="text-2xl font-bold text-slate-800" aria-label={`${resumo.kpis.familias} famílias assistidas`}>
              {resumo.kpis.familias}
            </p>
            <p className="text-xs text-slate-400">beneficiários ativos</p>
          </div>
        </article>

        {/* Card Equipamentos Uso */}
        <article className="bg-white hover:bg-green-50 p-5 rounded-xl shadow-sm border border-slate-200 flex gap-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-3xl shrink-0">
            <FaWheelchairMove aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-green-600 uppercase">Equipamentos em Uso</h2>
            <p className="text-2xl font-bold text-slate-800" aria-label={`${resumo.kpis.equipamentos_uso} equipamentos em uso`}>
              {resumo.kpis.equipamentos_uso}
            </p>
            <p className="text-xs text-slate-400">empréstimos ativos</p>
          </div>
        </article>

        {/* Card Estoque */}
        <article className="bg-white hover:bg-orange-50 p-5 rounded-xl shadow-sm border border-slate-200 flex gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center text-3xl shrink-0">
            <FaBox aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-orange-500 uppercase">Estoque Disponível</h2>
            <p className="text-2xl font-bold text-slate-800" aria-label={`${resumo.kpis.estoque_disponivel} itens prontos para uso`}>
              {resumo.kpis.estoque_disponivel}
            </p>
            <p className="text-xs text-slate-400">itens prontos para uso</p>
          </div>
        </article>

        {/* Card Manutenção */}
        <article className="bg-white hover:bg-red-50 p-5 rounded-xl shadow-sm border border-slate-200 flex gap-4">
          <div className="w-14 h-14 bg-red-100 text-red-500 rounded-lg flex items-center justify-center text-3xl shrink-0">
            <FaWrench aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-red-500 uppercase">Em Manutenção</h2>
            <p className="text-2xl font-bold text-slate-800" aria-label={`${resumo.kpis.manutencao} itens aguardando conserto`}>
              {resumo.kpis.manutencao}
            </p>
            <p className="text-xs text-slate-400">itens aguardando conserto</p>
          </div>
        </article>
      </section>

    {/* 
      Bloco de Gráfico Fluxo - areas
      
      <section aria-labelledby="titulo-fluxo" className="bg-white hover:bg-gray-50 p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 id="titulo-fluxo" className="font-bold text-slate-800">Fluxo da Solidariedade</h2>
        <p className="text-xs text-slate-500 mb-6">Entradas vs. Saídas nos últimos 6 meses</p>
         
        <div role="figure" aria-label="Gráfico de área mostrando entradas e saídas de doações ao longo dos últimos seis meses." className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dadosFluxo} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="corRecebidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="corEntregues" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip />
              <Area type="monotone" dataKey="recebidas" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#corRecebidas)" />
              <Area type="monotone" dataKey="entregues" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#corEntregues)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      
    */}

      {/*4. ROW: GRÁFICOS SECUNDÁRIOS*/}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        
        {/* Saúde do Estoque (Rosca) */}
        <section aria-labelledby="titulo-saude-estoque" className="bg-white hover:bg-gray-50 p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 id="titulo-saude-estoque" className="font-bold text-slate-800">Saúde do Estoque</h2>
          <p className="text-xs text-slate-500 mb-4">Distribuição dos equipamentos</p>
          
          <div className="flex items-center justify-center h-52 pr-3">
            <div role="figure" aria-label="Gráfico de rosca exibindo a porcentagem de equipamentos emprestados, disponíveis e em manutenção." className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dadosEstoque} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {dadosEstoque.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legenda Customizada - aria-hidden pois os dados já estão no gráfico para quem enxerga, mas serve de tabela para leitores */}
            <div className="flex flex-col gap-2 ml-4">
              {dadosEstoque.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true"></span>
                  <span className="text-slate-500">{item.name}</span>
                  <span className="font-bold text-slate-800 ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipamentos Requisitados (Barras) 
        <section aria-labelledby="titulo-top-equipamentos" className="bg-white hover:bg-gray-50 p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 id="titulo-top-equipamentos" className="font-bold text-slate-800">Equipamentos Mais Requisitados</h2>
          <p className="text-xs text-slate-500 mb-4">Top 5 empréstimos por tipo</p>
          
          <div role="figure" aria-label="Gráfico de barras horizontais listando os cinco equipamentos mais requisitados pela ONG." className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosRequisitados} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#475569" }} width={120} />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="quantidade" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>*/}
      </div>

      {/* 5. ROW: RESUMO DE SUPRIMENTOS */}
      <section aria-labelledby="titulo-suprimentos" className="bg-white hover:bg-gray-50 p-6 rounded-xl shadow-sm border border-slate-200 ">
        <h2 id="titulo-suprimentos" className="font-bold text-slate-800 mb-4">Resumo de Suprimentos</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Cestas */}
          <article className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl shrink-0">
                <FaBasketShopping aria-hidden="true" />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">Cestas Básicas</h3>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-[10px] text-green-600 font-bold uppercase">Recebidas</p>
                <p className="text-lg font-bold text-slate-800" aria-label={`${resumo.suprimentos.cestas.recebidas} cestas básicas recebidas`}>
                  {resumo.suprimentos.cestas.recebidas}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase">Doadas</p>
                <p className="text-lg font-bold text-slate-800" aria-label={`${resumo.suprimentos.cestas.doadas} cestas básicas doadas`}>
                  {resumo.suprimentos.cestas.doadas}
                </p>
              </div>
            </div>
          </article>

          {/* Card Roupas */}
          <article className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl shrink-0">
                <FaShirt aria-hidden="true" />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">Roupas</h3>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-[10px] text-green-600 font-bold uppercase">Recebidas</p>
                <p className="text-lg font-bold text-slate-800" aria-label={`${resumo.suprimentos.roupas.recebidas} peças de roupas recebidas`}>
                  {resumo.suprimentos.roupas.recebidas}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-blue-600 font-bold uppercase">Doadas</p>
                <p className="text-lg font-bold text-slate-800" aria-label={`${resumo.suprimentos.roupas.doadas} peças de roupas doadas`}>
                  {resumo.suprimentos.roupas.doadas}
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

    </main>
  );
}