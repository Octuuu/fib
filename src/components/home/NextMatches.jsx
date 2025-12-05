import React from 'react'
import MatchCard from './MatchCard'

const NextMatches = ({ matches, loading }) => {
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">Próximos Partido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Próximos Partidos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
      
      {matches.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-600">No hay partidos programados</h3>
          <p className="text-gray-500">Vuelve pronto para ver los próximos encuentros</p>
        </div>
      )}
    </div>
  )
}

export default NextMatches