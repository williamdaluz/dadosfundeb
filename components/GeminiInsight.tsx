
import React, { useState, useCallback } from 'react';
import { getFinancialInsights } from '../services/geminiService';
import { MunicipalityData } from '../types';
import Card from './ui/Card';
import Spinner from './ui/Spinner';

interface GeminiInsightProps {
  data: MunicipalityData[];
}

// A simple markdown-to-html renderer
const MarkdownRenderer = ({ content }: { content: string }) => {
    const htmlContent = content
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-sky-400 mt-4 mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-sky-300 mt-6 mb-3">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-sky-200 mt-8 mb-4">$1</h1>')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
        .replace(/\n/g, '<br />');

    return <div className="prose prose-invert text-slate-300" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


const GeminiInsight: React.FC<GeminiInsightProps> = ({ data }) => {
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateInsight = useCallback(async () => {
    if (!data.length) return;
    setIsLoading(true);
    setError('');
    setInsight('');
    try {
      const result = await getFinancialInsights(data);
      setInsight(result);
    } catch (err: any) {
      setError(err.message || 'Falha ao gerar análise.');
    } finally {
      setIsLoading(false);
    }
  }, [data]);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold text-sky-300 mb-2 sm:mb-0">Análise com Gemini AI</h2>
        <button
          onClick={handleGenerateInsight}
          disabled={isLoading || !data.length}
          className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? 'Analisando...' : 'Gerar Análise'}
        </button>
      </div>

      <div className="mt-4 min-h-[200px] p-4 bg-slate-900/70 rounded-md border border-slate-700">
        {isLoading && <Spinner />}
        {error && <p className="text-red-400">{error}</p>}
        {insight ? (
          <MarkdownRenderer content={insight} />
        ) : (
          !isLoading && <p className="text-slate-400">Clique no botão para gerar uma análise financeira dos dados usando IA.</p>
        )}
      </div>
    </Card>
  );
};

export default GeminiInsight;
