'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { FundTable } from '@/components/FundTable'
import { RiskLevel } from '@/types/fund'
import Link from 'next/link'

export default function Home() {
  const [isinSearch, setIsinSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<RiskLevel[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(category);
      if (isSelected) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleRiskLevelChange = (riskLevel: RiskLevel) => {
    setSelectedRiskLevels(prev => {
      const isSelected = prev.includes(riskLevel);
      if (isSelected) {
        return prev.filter(r => r !== riskLevel);
      } else {
        return [...prev, riskLevel];
      }
    });
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold">Buscador de Fondos de Inversión</h1>
            <Link 
              href="https://www.selfbank.es/"
              className="bg-[#D1472C] text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              ¡EMPIEZA A OPERAR CON FONDOS YA!
            </Link>
          </div>

          {/* Botón para mostrar/ocultar filtros en móvil */}
          <button
            onClick={toggleFilterPanel}
            className="md:hidden flex items-center gap-2 mb-4 bg-gray-100 px-4 py-2 rounded-md"
          >
            <Filter size={20} />
            <span>{isFilterPanelOpen ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Panel lateral de filtros */}
            <div className={`
              md:w-72 md:flex-shrink-0
              fixed md:static inset-0 z-30 bg-white md:bg-transparent
              transition-transform duration-300 ease-in-out
              ${isFilterPanelOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
              <div className="bg-white h-full md:h-auto overflow-y-auto md:rounded-lg md:shadow p-6">
                <div className="flex justify-between items-center mb-6 md:hidden">
                  <h2 className="text-xl font-semibold">Filtros</h2>
                  <button onClick={toggleFilterPanel} className="p-2">
                    <X size={24} />
                  </button>
                </div>

                <h2 className="hidden md:block text-xl font-semibold mb-6">Filtrar fondos de inversión</h2>
                
                {/* Búsqueda por ISIN */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Buscar</h3>
                  <input
                    type="text"
                    placeholder="ISIN"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={isinSearch}
                    onChange={(e) => setIsinSearch(e.target.value)}
                  />
                </div>

                {/* Categorías */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Categoría</h3>
                  <div className="space-y-2">
                    {[
                      'Renta Fija',
                      'Renta Variable',
                      'Mixtos',
                      'Monetario',
                      'Gestion Alternativa',
                      'Convertibles',
                      'Inmobiliario',
                      'Materias Primas',
                      'Otros'
                    ].map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-red-600"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        <span className="ml-2 text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Riesgo */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Riesgo</h3>
                  <div className="space-y-2">
                    {[
                      'Sin valorar',
                      'Riesgo bajo',
                      'Riesgo moderado',
                      'Riesgo medio-alto',
                      'Riesgo alto',
                      'Riesgo muy alto'
                    ].map(risk => (
                      <label key={risk} className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-red-600"
                          checked={selectedRiskLevels.includes(risk as RiskLevel)}
                          onChange={() => handleRiskLevelChange(risk as RiskLevel)}
                        />
                        <span className="ml-2 text-sm">{risk}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divisa */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Divisa</h3>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    <option value="">Todas</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Overlay para cerrar el panel en móvil */}
            {isFilterPanelOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                onClick={toggleFilterPanel}
              />
            )}

            {/* Contenido principal */}
            <div className="flex-1 overflow-x-auto">
              <FundTable 
                isinSearch={isinSearch}
                selectedCategories={selectedCategories}
                selectedCurrency={selectedCurrency}
                selectedRiskLevels={selectedRiskLevels}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 