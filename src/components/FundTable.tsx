import { useState, useEffect } from 'react';
import { useFunds } from '@/hooks/useFunds';
import { Fund, RiskLevel } from '@/types/fund';

interface FundTableProps {
  isinSearch: string;
  selectedCategories: string[];
  selectedCurrency: string;
  selectedRiskLevels: RiskLevel[];
}

export function FundTable({ 
  isinSearch, 
  selectedCategories, 
  selectedCurrency,
  selectedRiskLevels 
}: FundTableProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('ytd_return');

  const { funds, total, totalPages, isLoading, error } = useFunds({
    page,
    limit: 10,
    search: isinSearch,
    category: selectedCategories.join(','),
    currency: selectedCurrency,
    sortBy,
    riskLevels: selectedRiskLevels.join(','),
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [isinSearch, selectedCategories, selectedCurrency, selectedRiskLevels]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-gray-900">{total.toLocaleString()} Fondos de inversión</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Ordenar por</span>
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[200px]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="ytd_return">Rentabilidad año actual</option>
            <option value="one_year_return">Rentabilidad 1 año</option>
            <option value="three_year_return">Rentabilidad 3 años</option>
            <option value="morningstar_rating">Rating Morningstar</option>
            <option value="management_fee">Comisiones TER</option>
          </select>
        </div>
      </div>
      <table className="min-w-full table-fixed">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 w-[440px] min-w-[440px] max-w-[440px]">Fondo</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Riesgo</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700" colSpan={4}>Rentabilidad</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Comisiones totales (TER)</th>
            <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Rating Morningstar</th>
          </tr>
          <tr>
            <th className="px-4 py-2 bg-gray-200"></th>
            <th className="px-4 py-2 bg-gray-200"></th>
            <th className="px-4 py-2 text-center text-xs text-gray-700 bg-gray-200">2025</th>
            <th className="px-4 py-2 text-center text-xs text-gray-700 bg-gray-200">1 año</th>
            <th className="px-4 py-2 text-center text-xs text-gray-700 bg-gray-200">3 años</th>
            <th className="px-4 py-2 text-center text-xs text-gray-700 bg-gray-200">5 años</th>
            <th className="px-4 py-2 bg-gray-200"></th>
            <th className="px-4 py-2 bg-gray-200"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {funds.map((fund, index) => (
            <tr key={fund.isin} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
              <td className="px-4 py-4 w-[440px] min-w-[440px] max-w-[440px]">
                <div className="space-y-0.5 text-left">
                  <a 
                    href={`/fondos/${fund.isin}`}
                    className="text-[#D1472C] underline font-semibold block text-base"
                  >
                    {fund.name}
                  </a>
                  <div className="text-sm text-gray-900 text-left"><span className="font-bold">ISIN:</span> <span className="font-bold">{fund.isin}</span></div>
                  <div className="text-sm text-gray-500 text-left">{fund.category}</div>
                  <div className="text-sm text-gray-500 text-left">{fund.management_company}</div>
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <div className="text-sm font-medium">
                  {fund.risk_level}
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <div className="text-sm font-medium text-gray-900">{fund.ytd_return.toFixed(2)}%</div>
              </td>
              <td className="px-4 py-4 text-center">
                <div className="text-sm font-medium text-gray-900">{fund.one_year_return.toFixed(2)}%</div>
              </td>
              <td className="px-4 py-4 text-center">
                <div className="text-sm font-medium text-gray-900">{fund.three_year_return.toFixed(2)}%</div>
              </td>
              <td className="px-4 py-4 text-center">
                <div className="text-sm font-medium text-gray-900">{fund.five_year_return.toFixed(2)}%</div>
              </td>
              <td className="px-4 py-4 text-center">
                <div className="text-sm font-medium text-gray-900">{fund.management_fee.toFixed(2)}%</div>
              </td>
              <td className="px-4 py-4 text-center">
                <div className="flex justify-center items-center">
                  {Array.from({ length: fund.morningstar_rating || 0 }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                  {Array.from({ length: 5 - (fund.morningstar_rating || 0) }).map((_, i) => (
                    <span key={i} className="text-gray-300">★</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{((page - 1) * 10) + 1}</span> a{' '}
              <span className="font-medium">{Math.min(page * 10, total)}</span> de{' '}
              <span className="font-medium">{total}</span> resultados
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Anterior</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = page + i - 2;
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === pageNum
                          ? 'z-10 bg-[#D1472C] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D1472C]'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              <button
                onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                disabled={page === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <span className="sr-only">Siguiente</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
} 