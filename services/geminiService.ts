
import { GoogleGenAI } from "@google/genai";
import { MunicipalityData } from '../types';

export async function getFinancialInsights(data: MunicipalityData[]): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Sort data and take top 5 and bottom 5 to create a representative sample
  const sortedData = [...data].sort((a, b) => b.totalRevenue - a.totalRevenue);
  const top5 = sortedData.slice(0, 5).map(d => ({ Cidade: d.entity, 'Receita Total': d.totalRevenue }));
  const bottom5 = sortedData.slice(-5).map(d => ({ Cidade: d.entity, 'Receita Total': d.totalRevenue }));

  const prompt = `
    Você é um analista financeiro especializado em contas públicas brasileiras.
    Analise os seguintes dados de amostra sobre as receitas do Fundeb para municípios do Rio Grande do Sul.
    
    A amostra inclui os 5 municípios com as maiores receitas e os 5 com as menores.
    
    Maiores Receitas:
    ${JSON.stringify(top5, null, 2)}
    
    Menores Receitas:
    ${JSON.stringify(bottom5, null, 2)}
    
    Com base nesta amostra, forneça um resumo conciso e extraia 3 insights principais.
    Formate sua resposta em markdown. Comece com um título "Análise de IA das Receitas do Fundeb".
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocorreu um erro ao gerar a análise. Por favor, tente novamente.";
  }
}
