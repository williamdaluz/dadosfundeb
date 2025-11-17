
import React from 'react';
import { MunicipalityData } from '../types';
import Card from './ui/Card';

interface DetailsModalProps {
  municipality: MunicipalityData | null;
  onClose: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const DetailsModal: React.FC<DetailsModalProps> = ({ municipality, onClose }) => {
  if (!municipality) return null;

  const fourPercent = municipality.totalRevenue * 0.04;

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
    >
      <Card 
        className="w-full max-w-lg animate-fade-in-up border-sky-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-sky-300">{municipality.entity}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">&times;</button>
        </div>
        
        <div className="space-y-3 text-slate-300">
          <div className="flex justify-between">
            <span>Código IBGE:</span>
            <span className="font-mono">{municipality.ibgeCode}</span>
          </div>
          <div className="flex justify-between">
            <span>Contribuição ao Fundeb:</span>
            <span className="font-semibold">{formatCurrency(municipality.fundebContribution)}</span>
          </div>
          <div className="flex justify-between">
            <span>Complementação da União:</span>
            <span className="font-semibold">{formatCurrency(municipality.totalUnionComplement)}</span>
          </div>
           <div className="flex justify-between border-t border-slate-700 pt-3 mt-3">
            <span className="font-bold text-slate-100">Total das Receitas Previstas:</span>
            <span className="font-bold text-lg text-sky-300">{formatCurrency(municipality.totalRevenue)}</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-sky-900/50 border border-sky-700 rounded-lg text-center">
            <p className="text-lg font-semibold text-sky-200">Cálculo de 4% da Receita Total</p>
            <p className="text-3xl font-bold text-white mt-2">{formatCurrency(fourPercent)}</p>
        </div>

      </Card>
    </div>
  );
};

export default DetailsModal;
