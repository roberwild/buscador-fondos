import { Fund, RiskLevel } from '@/types/fund';
import Papa from 'papaparse';

function parseNumericValue(value: string | undefined): number {
  if (!value) return 0;
  const cleanValue = value.replace(',', '.').replace(/[^0-9.-]+/g, '');
  return parseFloat(cleanValue) || 0;
}

function parseRiskLevel(value: string): RiskLevel {
  const riskMap: { [key: string]: RiskLevel } = {
    '1': 'Muy bajo',
    '2': 'Bajo',
    '3': 'Moderado',
    '4': 'Medio-alto',
    '5': 'Alto',
    '6': 'Muy alto',
  };
  return riskMap[value] || 'Moderado';
}

export const processCSVData = (csvData: string): Fund[] => {
  const { data } = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    delimiter: ';'
  });

  return data.map((row: any) => ({
    isin: row['ISIN'] || '',
    name: row['Nombre'] || '',
    currency: row['Divisa'] || '',
    category: row['Categoria Singular Bank'] || '',
    subcategory: row['Categoría Morningstar'] || '',
    management_fee: parseNumericValue(row['Comisión Gestión']),
    success_fee: parseNumericValue(row['Comisión Exito']),
    min_investment: parseNumericValue(row['Mínimo Inicial']),
    min_investment_currency: row['Divisa'] || '',
    aum: row['Patrimonio'] || '',
    ytd_return: parseNumericValue(row['Rent YTD']),
    one_year_return: parseNumericValue(row['Rent 12M']),
    three_year_return: parseNumericValue(row['Rent 36M']),
    five_year_return: parseNumericValue(row['Rent 60M']),
    management_company: row['Gestora / Emisor'] || '',
    factsheet_url: row['URL Ficha Comercial'] || '',
    kiid_url: row['URL KID PRIIPS'] || '',
    risk_level: parseRiskLevel(row['REQ']),
    morningstar_rating: parseInt(row['Morningstar Rating'] || '0'),
  }));
}; 