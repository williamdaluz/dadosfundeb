
import React, { useState, useMemo } from 'react';
import { MunicipalityData } from '../types';
import Card from './ui/Card';

interface DataTableProps {
  data: MunicipalityData[];
  onRowClick: (municipality: MunicipalityData) => void;
  searchTerm: string;
}

type SortKey = keyof MunicipalityData;
type SortOrder = 'asc' | 'desc';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const SortableHeader: React.FC<{
  column: SortKey;
  label: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSort: (key: SortKey) => void;
}> = ({ column, label, sortKey, sortOrder, onSort }) => {
  const icon = sortKey === column ? (sortOrder === 'asc' ? '▲' : '▼') : '';
  return (
    <th
      scope="col"
      className="px-4 py-3 text-left text-xs font-medium text-sky-300 uppercase tracking-wider cursor-pointer select-none"
      onClick={() => onSort(column)}
    >
      {label} <span className="text-xs">{icon}</span>
    </th>
  );
};

const DataTable: React.FC<DataTableProps> = ({ data, onRowClick, searchTerm }) => {
  const [sortKey, setSortKey] = useState<SortKey>('totalRevenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedAndFilteredData = useMemo(() => {
    const filtered = data.filter(item =>
      item.entity.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [data, searchTerm, sortKey, sortOrder]);

  return (
    <Card className="mt-8">
        <h2 className="text-xl font-bold text-sky-300 mb-4">Dados Completos dos Municípios</h2>
        <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-700">
                <thead className="bg-slate-800 sticky top-0">
                    <tr>
                    <SortableHeader column="entity" label="Município" sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableHeader column="totalRevenue" label="Receita Total" sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableHeader column="fundebContribution" label="Contrib. Fundeb" sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                    <SortableHeader column="totalUnionComplement" label="Compl. União" sortKey={sortKey} sortOrder={sortOrder} onSort={handleSort} />
                    </tr>
                </thead>
                <tbody className="bg-slate-900 divide-y divide-slate-800">
                    {sortedAndFilteredData.map((item) => (
                    <tr key={item.ibgeCode} onClick={() => onRowClick(item)} className="hover:bg-slate-800 cursor-pointer transition-colors duration-200">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-200">{item.entity}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{formatCurrency(item.totalRevenue)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{formatCurrency(item.fundebContribution)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">{formatCurrency(item.totalUnionComplement)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    </Card>
  );
};

export default DataTable;
