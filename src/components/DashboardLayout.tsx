import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-blue-700">Painel de Pesquisa - Pessoa Idosa</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="bg-white shadow-md mt-auto">
        <div className="container mx-auto px-6 py-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} - Desenvolvido por Manus</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;

