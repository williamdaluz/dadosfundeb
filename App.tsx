
import React, { useState, useEffect } from 'react';
import { MunicipalityData } from './types';
import { parseCSV } from './utils/parser';
import { data as rawCSVData } from './data/sourceData';
import DataChart from './components/DataChart';
import DataTable from './components/DataTable';
import DetailsModal from './components/DetailsModal';
import Spinner from './components/ui/Spinner';

const App: React.FC = () => {
  const [allData, setAllData] = useState<MunicipalityData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMunicipality, setSelectedMunicipality] = useState<MunicipalityData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  useEffect(() => {
    try {
      const parsedData = parseCSV(rawCSVData);
      setAllData(parsedData);
    } catch (error) {
      console.error("Failed to parse CSV data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRowClick = (municipality: MunicipalityData) => {
    setSelectedMunicipality(municipality);
  };

  const handleCloseModal = () => {
    setSelectedMunicipality(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-40 border-b border-slate-700">
        <div className="container mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-sky-300">
            Dashboard de Receitas Fundeb - RS
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="mb-8">
                <DataChart data={allData} />
            </div>

            <div>
              <input
                type="text"
                placeholder="Buscar por município..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none transition-shadow"
              />
              <DataTable data={allData} onRowClick={handleRowClick} searchTerm={searchTerm} />
            </div>

            <DetailsModal municipality={selectedMunicipality} onClose={handleCloseModal} />
          </>
        )}
      </main>

      <footer className="text-center p-4 mt-8 text-slate-500 text-sm">
        <p>Desenvolvido com React e TailwindCSS.</p>
      </footer>
    </div>
  );
};

export default App;
