import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import data from '/home/ubuntu/dashboard_idoso/public/data.json'; // Ajuste o caminho se necessário
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import WordCloud from 'react-wordcloud';

// Tipagem para os dados (simplificada, ajuste conforme a estrutura real do seu data.json)
interface ChartData {
  name: string;
  value: number;
}

interface WordCloudData {
  text: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Função para transformar dados de contagem em formato para Recharts
const transformDataForChart = (dataObject: Record<string, number> | undefined): ChartData[] => {
  if (!dataObject) return [];
  return Object.entries(dataObject).map(([name, value]) => ({ name, value }));
};

// Função para transformar dados de texto para WordCloud
const transformDataForWordCloud = (textArray: string[] | undefined): WordCloudData[] => {
  if (!textArray) return [];
  const frequencyMap: Record<string, number> = {};
  textArray.forEach(text => {
    // Tratamento básico de palavras, pode ser mais elaborado
    const words = text.toLowerCase().split(/[\s,.;!?-]+/);
    words.forEach(word => {
      if (word && word.length > 2) { // Ignora palavras curtas e vazias
        frequencyMap[word] = (frequencyMap[word] || 0) + 1;
      }
    });
  });
  return Object.entries(frequencyMap).map(([text, value]) => ({ text, value }));
};

const HomePage: React.FC = () => {
  // Dados para os gráficos (exemplos, use os dados reais do seu JSON)
  const distribuicaoIdadeData = transformDataForChart(data.distribuicao_idade);
  const distribuicaoMunicipioData = transformDataForChart(data.distribuicao_municipio);
  const distribuicaoPerfilData = transformDataForChart(data.distribuicao_perfil);
  const distribuicaoCnhData = transformDataForChart(data.distribuicao_cnh);
  const interessesWordCloudData = transformDataForWordCloud(data.respostas_interesses);
  const mensagensGestoresWordCloudData = transformDataForWordCloud(data.respostas_mensagem_gestores_transito);

  const [selectedMunicipio, setSelectedMunicipio] = React.useState<string>("Todos");
  const [selectedIdade, setSelectedIdade] = React.useState<string>("Todos");

  const municipiosUnicos = ["Todos", ...new Set(data.respostas_completas_filtragem.map(item => item.municipio))];
  const idadesUnicas = ["Todos", ...new Set(data.respostas_completas_filtragem.map(item => item.idade))];

  const filteredData = data.respostas_completas_filtragem.filter(item => 
    (selectedMunicipio === "Todos" || item.municipio === selectedMunicipio) &&
    (selectedIdade === "Todos" || item.idade === selectedIdade)
  );

  // Recalcular dados para gráficos com base nos filtros
  const recalculateChartData = (key: keyof typeof data.respostas_completas_filtragem[0]) => {
    const counts: Record<string, number> = {};
    filteredData.forEach(item => {
      const value = item[key] as string;
      counts[value] = (counts[value] || 0) + 1;
    });
    return transformDataForChart(counts);
  };

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
          <p className="text-4xl font-bold">{data.total_respondentes}</p>
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
        {/* Visão Geral */} 
        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Distribuição por Idade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transformDataForChart(data.distribuicao_idade)} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
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
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mobilidade e Transporte */}
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

        {/* Interesses e Educação no Trânsito */}
        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Interesse em Curso de Trânsito (Filtrado)</h3>
           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredInteresseCursoData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#FFBB28" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Principais Interesses (Geral)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <WordCloud words={interessesWordCloudData} options={options} />
          </ResponsiveContainer>
        </div>

        {/* Mensagens aos Gestores */}
        <div className="bg-white p-6 rounded-lg shadow col-span-1 md:col-span-3">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Mensagens aos Gestores (Nuvem de Palavras - Geral)</h3>
          <ResponsiveContainer width="100%" height={400}>
             <WordCloud words={mensagensGestoresWordCloudData} options={{...options, fontSizes: [14, 40]}} />
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default HomePage;

