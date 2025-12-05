import React from 'react'
import MatchDay from './MatchDay'

const MatchCalendar = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-300">📅</div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-600 mb-3 sm:mb-4">
            Calendario de Partidos
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            No hay partidos programados en este momento.
          </p>
        </div>
      </div>
    )
  }

  // Agrupar partidos por fecha
  const matchesByDate = matches.reduce((acc, match) => {
    if (!match.match_date) return acc
    
    const dateStr = new Date(match.match_date).toDateString()
    if (!acc[dateStr]) {
      acc[dateStr] = []
    }
    acc[dateStr].push(match)
    return acc
  }, {})

  // Ordenar fechas cronológicamente
  const sortedDates = Object.keys(matchesByDate).sort((a, b) => new Date(a) - new Date(b))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
          Calendario de Partidos
        </h1>
      </div>
      
      {/* Lista de días */}
      <div className="space-y-6 sm:space-y-8">
        {sortedDates.map((date) => (
          <MatchDay 
            key={date} 
            date={date} 
            matches={matchesByDate[date]} 
          />
        ))}
      </div>
    </div>
  )
}

export default MatchCalendar