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

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r rounded-t-lg p-4">
        <h3 className="text-xl font-bold capitalize">{formattedDate}</h3>
        <p className="">{matches.length} partido{matches.length !== 1 ? 's' : ''} programado{matches.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="bg-gray-50 rounded-b-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <MatchItem key={match.id} match={match} />
          ))}
        </div>
        
        {matches.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4"></div>
            <h4 className="text-lg font-semibold text-gray-600">No hay partidos este día</h4>
            <p className="text-gray-500">Descansa y prepárate para la siguiente fecha</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchDay