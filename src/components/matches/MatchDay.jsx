import React from 'react'
import MatchItem from './MatchItem'

const MatchDay = ({ date, matches }) => {
  const matchDate = new Date(date)
  
  const formattedDate = matchDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const mobileFormattedDate = matchDate.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })

  return (
    <div className="mb-6 sm:mb-8">
    
      <div className="bg-gradient-to-r  rounded-t-lg p-3 sm:p-4">
        <h3 className="text-lg sm:text-xl font-bold capitalize hidden sm:block">
          {formattedDate}
        </h3>
        <h3 className="text-lg font-bold capitalize  sm:hidden">
          {mobileFormattedDate}
        </h3>
        <p className=" text-sm sm:text-base">
          {matches.length} partido{matches.length !== 1 ? 's' : ''} programado{matches.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      
      <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {matches.map((match) => (
            <MatchItem key={match.id} match={match} />
          ))}
        </div>
        
        {matches.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📭</div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-600">
              No hay partidos este día
            </h4>
            <p className="text-gray-500 text-sm sm:text-base">
              Descansa y prepárate para la siguiente fecha
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchDay