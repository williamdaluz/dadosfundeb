
import { MunicipalityData } from '../types';

const parseBrazilianNumber = (numStr: string): number => {
  if (numStr.trim() === '-' || !numStr) {
    return 0;
  }
  return parseFloat(numStr.replace(/\./g, '').replace(',', '.'));
};

export const parseCSV = (csvText: string): MunicipalityData[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  const data: MunicipalityData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/(?:"[^"]*"|[^,]+)/g);
    if (!values || values.length < headers.length) continue;

    const cleanedValues = values.map(v => v.replace(/"/g, '').trim());

    // Filter out the state government row
    if (cleanedValues[2] === 'GOVERNO DO ESTADO') {
        continue;
    }

    const row: MunicipalityData = {
      uf: cleanedValues[0],
      ibgeCode: cleanedValues[1],
      entity: cleanedValues[2],
      fundebContribution: parseBrazilianNumber(cleanedValues[3]),
      vaafComplement: parseBrazilianNumber(cleanedValues[4]),
      vaatComplement: parseBrazilianNumber(cleanedValues[5]),
      vaarComplement: parseBrazilianNumber(cleanedValues[6]),
      totalUnionComplement: parseBrazilianNumber(cleanedValues[7]),
      totalRevenue: parseBrazilianNumber(cleanedValues[8]),
    };
    data.push(row);
  }

  return data;
};
