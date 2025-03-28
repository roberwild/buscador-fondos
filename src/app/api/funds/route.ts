import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Fund, RiskLevel } from '@/types/fund';

// Función para mapear el nivel de riesgo del CSV a nuestro tipo
function mapRiskLevel(risk: string): RiskLevel {
  const riskNumber = parseInt(risk) || 0;
  
  if (riskNumber === 0) return 'Sin valorar';
  if (riskNumber >= 1 && riskNumber <= 20) return 'Riesgo bajo';
  if (riskNumber >= 21 && riskNumber <= 40) return 'Riesgo moderado';
  if (riskNumber >= 41 && riskNumber <= 60) return 'Riesgo medio-alto';
  if (riskNumber >= 61 && riskNumber <= 80) return 'Riesgo alto';
  if (riskNumber >= 81 && riskNumber <= 99) return 'Riesgo muy alto';
  
  return 'Sin valorar'; // valor por defecto
}

// Función auxiliar para procesar valores numéricos
function parseNumericValue(value: string | undefined): number {
  if (!value) return 0;
  // Reemplazar la coma por punto para el separador decimal
  const cleanValue = value.replace(',', '.').replace(/[^0-9.-]+/g, '');
  return parseFloat(cleanValue) || 0;
}

// Función para leer y procesar el CSV
async function getFundsData(): Promise<Fund[]> {
  const csvFilePath = path.join(process.cwd(), 'src/data/datos-fondos.csv');
  const fileContents = await fs.readFile(csvFilePath, 'utf8');
  
  const { data } = Papa.parse(fileContents, {
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
    risk_level: mapRiskLevel(row['REQ']),
    morningstar_rating: parseInt(row['Morningstar Rating'] || '0'),
    available_for_implicit_advisory: row['Disponible para asesoramiento con cobro implícito'] === 'Y',
  }))
  .filter(fund => fund.available_for_implicit_advisory);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const currency = searchParams.get('currency') || '';
    const sortBy = searchParams.get('sortBy') || 'ytd_return';
    const riskLevels = searchParams.get('riskLevels') || '';

    const funds = await getFundsData();

    // Aplicar filtros
    let filteredFunds = funds;
    
    if (search) {
      filteredFunds = filteredFunds.filter(fund => 
        fund.isin.toLowerCase() === search.toLowerCase()
      );
    }

    if (category) {
      const categories = category.split(',').filter(Boolean);
      if (categories.length > 0) {
        filteredFunds = filteredFunds.filter(fund => 
          categories.some(cat => 
            fund.category.toLowerCase().startsWith(cat.toLowerCase())
          )
        );
      }
    }

    if (currency) {
      filteredFunds = filteredFunds.filter(fund => 
        fund.currency.toLowerCase() === currency.toLowerCase()
      );
    }

    if (riskLevels) {
      const selectedRiskLevels = riskLevels.split(',').filter(Boolean);
      if (selectedRiskLevels.length > 0) {
        filteredFunds = filteredFunds.filter(fund => 
          selectedRiskLevels.includes(fund.risk_level)
        );
      }
    }

    // Ordenar los fondos
    filteredFunds.sort((a, b) => {
      switch (sortBy) {
        case 'ytd_return':
          return (b.ytd_return || 0) - (a.ytd_return || 0);
        case 'one_year_return':
          return (b.one_year_return || 0) - (a.one_year_return || 0);
        case 'three_year_return':
          return (b.three_year_return || 0) - (a.three_year_return || 0);
        case 'morningstar_rating':
          return (b.morningstar_rating || 0) - (a.morningstar_rating || 0);
        case 'management_fee':
          return (b.management_fee || 0) - (a.management_fee || 0);
        default:
          return (b.ytd_return || 0) - (a.ytd_return || 0);
      }
    });

    // Calcular paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFunds = filteredFunds.slice(startIndex, endIndex);

    return NextResponse.json({
      funds: paginatedFunds,
      total: filteredFunds.length,
      page,
      totalPages: Math.ceil(filteredFunds.length / limit),
      limit
    });
  } catch (error) {
    console.error('Error fetching funds:', error);
    return NextResponse.json(
      { error: 'Error fetching funds' },
      { status: 500 }
    );
  }
} 