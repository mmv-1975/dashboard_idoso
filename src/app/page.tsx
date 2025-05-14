// page_corrigido_v4.tsx
// Correção: Renderização condicional para WordCloud
'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import WordCloud from 'react-wordcloud';

interface RespostaCompletaItem {
  municipio: string;
  idade: string;
  perfil: string;
  cnh: string;
  interesse_curso_transito: string;
  [key: string]: any;
}

interface AppData {
  total_respondentes: number;
  distribuicao_idade: Record<string, number>;
  distribuicao_municipio: Record<string, number>;
  distribuicao_perfil: Record<string, number>;
  distribuicao_cnh: Record<string, number>;
  respostas_interesses: string[];
  respostas_mensagem_gestores_transito: string[];
  respostas_completas_filtragem: Array<RespostaCompletaItem>;
}

interface ChartData {
  name: string;
  value: number;
}

interface WordCloudData {
  text: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const transformDataForChart = (dataObject: Record<string, number> | undefined): ChartData[] => {
  if (!dataObject || Object.keys(dataObject).length === 0) return [];
  return Object.entries(dataObject).map(([name, value]) => ({ name, value }));
};

const transformDataForWordCloud = (textArray: string[] | undefined): WordCloudData[] => {
  if (!textArray || textArray.length === 0) return [];
  const frequencyMap: Record<string, number> = {};
  textArray.forEach(text => {
    if (typeof text === 'string') {
      const words = text.toLowerCase().split(/[\s,.;!?-]+/);
      words.forEach(word => {
        if (word && word.length > 2) {
          frequencyMap[word] = (frequencyMap[word] || 0) + 1;
        }
      });
    }
  });
  return Object.entries(frequencyMap).map(([text, value]) => ({ text, value }));
};

const HomePage: React.FC = () => {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMunicipio, setSelectedMunicipio] = React.useState<string>("Todos");
  const [selectedIdade, setSelectedIdade] = React.useState<string>("Todos");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAppData({
            total_respondentes: data.total_respondentes ?? 0,
            distribuicao_idade: data.distribuicao_idade ?? {},
            distribuicao_municipio: data.distribuicao_municipio ?? {},
            distribuicao_perfil: data.distribuicao_perfil ?? {},
            distribuicao_cnh: data.distribuicao_cnh ?? {},
            respostas_interesses: Array.isArray(data.respostas_interesses) ? data.respostas_interesses : [],
            respostas_mensagem_gestores_transito: Array.isArray(data.respostas_mensagem_gestores_transito) ? data.respostas_mensagem_gestores_transito : [],
            respostas_completas_filtragem: Array.isArray(data.respostas_completas_filtragem) ? data.respostas_completas_filtragem : [],
        });
      } catch (e: any) {
        setError(e.message);
        console.error("Erro ao carregar os dados:", e);
        setAppData({
             total_respondentes: 0,
             distribuicao_idade: {},
             distribuicao_municipio: {},
             distribuicao_perfil: {},
             distribuicao_cnh: {},
             respostas_interesses: [],
             respostas_mensagem_gestores_transito: [],
             respostas_completas_filtragem: [],
         });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <DashboardLayout><div className="flex justify-center items-center h-screen"><p className="text-2xl">Carregando dados...</p></div></DashboardLayout>;
  }

  if (error || !appData) {
    return <DashboardLayout><div className="flex justify-center items-center h-screen"><p className="text-2xl text-red-500">Erro ao carregar dados: {error || 'Dados não puderam ser carregados.'}</p></div></DashboardLayout>;
  }
  
  const respostasFiltragem = appData.respostas_completas_filtragem || [];

  const municipiosUnicos = respostasFiltragem.length > 0
    ? ["Todos", ...new Set(respostasFiltragem.map(item => item?.municipio).filter(m => m != null))]
    : ["Todos"];

  const idadesUnicas = respostasFiltragem.length > 0
    ? ["Todos", ...new Set(respostasFiltragem.map(item => item?.idade).filter(i => i != null))]
    : ["Todos"];

  const filteredData = respostasFiltragem.length > 0
    ? respostasFiltragem.filter(item =>
      item && 
      (selectedMunicipio === "Todos" || item.municipio === selectedMunicipio) &&
      (selectedIdade === "Todos" || item.idade === selectedIdade)
    )
    : [];

  const recalculateChartData = (key: keyof RespostaCompletaItem) => {
    const counts: Record<string, number> = {};
    if (filteredData.length > 0) {
        filteredData.forEach(item => {
            if (item && typeof item[key] !== 'undefined' && item[key] !== null) {
                const value = String(item[key]);
                counts[value] = (counts[value] || 0) + 1;
            }
        });
    }
    return transformDataForChart(counts);
  };

  const distribuicaoIdadeData = transformDataForChart(appData.distribuicao_idade);
  const distribuicaoMunicipioData = transformDataForChart(appData.distribuicao_municipio);
  const interessesWordCloudData = transformDataForWordCloud(appData.respostas_interesses);
  const mensagensGestoresWordCloudData = transformDataForWordCloud(appData.respostas_mensagem_gestores_transito);
  
  const filteredDistribuicaoPerfilData = recalculateChartData('perfil');
  const filteredDistribuicaoCnhData = recalculateChartData('cnh');
  const filteredInteresseCursoData = recalculateChartData('interesse_curso_transito');

  const options = {
    rotations: 2,
    rotationAngles: [-90, 0] as [number, number],
    fontSizes: [20, 60] as [number, number],
    padding: 1,
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2 text-blue-600">Total de Respondentes</h3>
          <p className="text-4xl font-bold">{appData?.total_respondentes ?? 'N/A'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <label htmlFor="municipio-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Município:</label>
          <select 
            id="municipio-filter"
            value={selectedMunicipio}
            onChange={(e) => setSelectedMunicipio(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {municipiosUnicos.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <label htmlFor="idade-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Idade:</label>
          <select 
            id="idade-filter"
            value={selectedIdade}
            onChange={(e) => setSelectedIdade(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {idadesUnicas.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Distribuição por Idade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distribuicaoIdadeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Distribuição por Município (Geral)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={distribuicaoMunicipioData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {distribuicaoMunicipioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Perfil dos Respondentes (Filtrado)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredDistribuicaoPerfilData} layout="vertical" margin={{ top: 5, right: 20, left: 120, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false}/>
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Posse de CNH (Filtrado)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={filteredDistribuicaoCnhData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#00C49F" label>
                 {filteredDistribuicaoCnhData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Interesse em Curso de Trânsito (Filtrado)</h3>
           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredInteresseCursoData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false}/>
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#FFBB28" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* CORREÇÃO APLICADA AQUI: Renderização condicional para WordCloud */}
        {interessesWordCloudData && interessesWordCloudData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Principais Interesses (Geral)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <WordCloud words={interessesWordCloudData} options={options} />
            </ResponsiveContainer>
          </div>
        )}

        {/* CORREÇÃO APLICADA AQUI: Renderização condicional para WordCloud */}
        {mensagensGestoresWordCloudData && mensagensGestoresWordCloudData.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-3">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Mensagens aos Gestores (Nuvem de Palavras - Geral)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <WordCloud words={mensagensGestoresWordCloudData} options={{...options, fontSizes: [14, 40]}} />
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default HomePage;
