'use client'

import { useEffect, useState } from 'react'
import yahooFinance from 'yahoo-finance2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface FundChartProps {
  isin: string
  name: string
}

// Tipos para Yahoo Finance
interface YahooQuote {
  exchange?: string
  shortname?: string
  quoteType?: string
  symbol: string
  index?: string
  score?: number
  typeDisp?: string
  longname?: string
  exchDisp?: string
  sector?: string
  industry?: string
  isYahooFinance?: boolean
}

interface YahooSearchResult {
  explains: any[]
  count: number
  quotes: YahooQuote[]
  news: any[]
  nav: any[]
  lists: any[]
  researchReports: any[]
  totalTime: number
  timeTaken: number
  screenerFieldResults?: any[]
  culturalAssets?: any[]
  timeTakenForScreenerField?: number
  timeTakenForCulturalAssets?: number
  timeTakenForNews: number
  timeTakenForAlgowatchlist: number
  timeTakenForPredefinedScreener: number
  timeTakenForCrunchbase: number
  timeTakenForNav: number
  timeTakenForResearchReports: number
}

interface HistoricalDataPoint {
  date: Date
  close: number
  high: number
  low: number
  open: number
  volume: number
  adjClose: number
}

export default function FundChart({ isin, name }: FundChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Intentamos diferentes variaciones del símbolo
        const symbolVariations = [
          isin, // ISIN directo
          `${isin}.MC`, // Mercado español
          `${isin}.MI`, // Mercado italiano
          `${isin}.DE`, // Mercado alemán
          `${isin}.PA`, // Mercado francés
          `${name.replace(/\s+/g, '-')}`, // Nombre del fondo formateado
        ]

        let result: HistoricalDataPoint[] | null = null
        let usedSymbol: string | null = null

        // Intentamos buscar el símbolo correcto primero
        try {
          const searchResults = await yahooFinance.search(name, { 
            quotesCount: 5,
            newsCount: 0,
            enableFuzzyQuery: true,
            enableCb: false,
          }) as unknown as YahooSearchResult

          if (searchResults.quotes && searchResults.quotes.length > 0) {
            // Filtramos para encontrar coincidencias con el ISIN o nombre similar
            const matchingQuote = searchResults.quotes.find(quote => 
              quote.symbol.includes(isin) || 
              quote.longname?.toLowerCase().includes(name.toLowerCase())
            )
            
            if (matchingQuote) {
              usedSymbol = matchingQuote.symbol
              result = await yahooFinance.historical(usedSymbol, {
                period1: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
                period2: new Date(),
                interval: '1mo'
              }) as HistoricalDataPoint[]
            }
          }
        } catch (searchError) {
          console.error('Error en la búsqueda:', searchError)
        }

        // Si la búsqueda no funcionó, probamos las variaciones
        if (!result) {
          for (const symbol of symbolVariations) {
            try {
              const data = await yahooFinance.historical(symbol, {
                period1: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
                period2: new Date(),
                interval: '1mo'
              }) as HistoricalDataPoint[]

              if (data && data.length > 0) {
                result = data
                usedSymbol = symbol
                break
              }
            } catch (err) {
              continue
            }
          }
        }

        if (result && result.length > 0) {
          const dates = result.map(item => item.date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short'
          }))
          const prices = result.map(item => item.close)

          setChartData({
            labels: dates,
            datasets: [
              {
                label: 'Valor Liquidativo',
                data: prices,
                borderColor: '#D1472C',
                backgroundColor: 'rgba(209, 71, 44, 0.1)',
                tension: 0.1,
                fill: true
              }
            ]
          })
        } else {
          setError('No se encontraron datos históricos para este fondo')
        }
      } catch (err) {
        console.error('Error fetching historical data:', err)
        setError('No se pudieron obtener los datos históricos del fondo')
      } finally {
        setLoading(false)
      }
    }

    fetchHistoricalData()
  }, [isin, name])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D1472C]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center max-w-md mx-auto">
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500">
            Los datos históricos no están disponibles en este momento. 
            Esto puede deberse a que el fondo es muy nuevo, no cotiza en mercados públicos, 
            o los datos no están accesibles a través de nuestras fuentes.
          </p>
        </div>
      </div>
    )
  }

  if (!chartData) {
    return null
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} €`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return value.toFixed(2) + ' €'
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  }

  return (
    <div className="h-96">
      <Line data={chartData} options={options} />
    </div>
  )
} 