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
}

export default function FundChart({ isin }: FundChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Intentamos obtener el símbolo de Yahoo Finance basado en el ISIN
        // Nota: Esto es una aproximación, ya que no todos los fondos están disponibles en Yahoo Finance
        const symbol = `${isin}.MC` // Intentamos con el mercado español primero

        const endDate = new Date()
        const startDate = new Date()
        startDate.setFullYear(endDate.getFullYear() - 5) // Últimos 5 años

        const result = await yahooFinance.historical(symbol, {
          period1: startDate,
          period2: endDate,
          interval: '1mo' // Datos mensuales
        })

        if (result && result.length > 0) {
          const dates = result.map(item => item.date.toLocaleDateString())
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
  }, [isin])

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
        <div className="text-center">
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Los datos históricos podrían no estar disponibles en Yahoo Finance
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