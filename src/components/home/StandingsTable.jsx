import React from 'react'
import { useStandings } from '../../hooks/useStandings'
import { FaTrophy, FaMedal, FaBasketballBall, FaStar } from 'react-icons/fa'

const StandingsTable = () => {
  const { standings, loading, error, activeTournament } = useStandings()

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Clasificación</h2>
          <p className="text-gray-600">Cargando datos de la temporada...</p>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="h-14 bg-gray-200"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 border-b border-gray-200"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Clasificación</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">Error al cargar la clasificación</div>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }
  const sortedStandings = [...standings]
    .map((standing, index) => {
      const winPercentage = standing.games_played > 0 
        ? ((standing.wins / standing.games_played) * 100).toFixed(1)
        : '0.0'
      
      const pointsDifference = standing.points_difference || 
        (standing.points_for - standing.points_against)
      
      return {
        ...standing,
        position: index + 1,
        winPercentage,
        pointsDifference,
        team_name: standing.team?.name || 'Sin nombre',
        team_city: standing.team?.city || '',
        team_logo: standing.team?.logo_url,
        team_short_name: standing.team?.short_name || standing.team?.name?.substring(0, 3).toUpperCase(),
      
        games_played: standing.games_played || 0,
        wins: standing.wins || 0,
        losses: standing.losses || 0,
        points_for: standing.points_for || 0,
        points_against: standing.points_against || 0
      }
    })
    .sort((a, b) => {
  
      if (b.wins !== a.wins) return b.wins - a.wins
      if (b.points_difference !== a.points_difference) return b.points_difference - a.points_difference
      return b.points_for - a.points_for
    })

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          {activeTournament?.name || 'Tabla de Clasificación'}
        </h2>
        
      </div>

      <div className="bg-white overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="">
              <tr>
                <th className="py-4 px-4 text-left font-semibold text-sm uppercase tracking-wider">Pos.</th>
                <th className="py-4 px-4 text-left font-semibold text-sm uppercase tracking-wider">Equipo</th>
                <th className="py-4 px-4 text-center font-semibold text-sm uppercase tracking-wider">PJ</th>
                <th className="py-4 px-4 text-center font-semibold text-sm uppercase tracking-wider">G</th>
                <th className="py-4 px-4 text-center font-semibold text-sm uppercase tracking-wider">P</th>
                <th className="py-4 px-4 text-center font-semibold text-sm uppercase tracking-wider">%</th>
                <th className="py-4 px-4 text-center font-semibold text-sm uppercase tracking-wider">PF</th>
                <th className="py-4 px-4 text-center font-semibold text-sm uppercase tracking-wider">PC</th>
                <th className="py-4 px-4 text-center font-semibold text-sm uppercase tracking-wider">+/-</th>
                <th className="py-4 px-4 text-center font-semibold text-sm uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedStandings.map((standing, index) => {
                const isQualified = index < 2 
                const position = index + 1
                
                return (
                  <tr 
                    key={standing.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      isQualified ? 'bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100' : ''
                    } ${position > 2 ? 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200' : ''}`}
                  >
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          position === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md' :
                          position === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {position}
                        </div>
                        
                      
                      </div>
                    </td>

              
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {standing.team_logo ? (
                            <img 
                              src={standing.team_logo} 
                              alt={standing.team_name}
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 rounded-full">
                              <FaBasketballBall className="text-white text-lg" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-800 truncate max-w-[200px]">
                            {standing.team_name}
                            {isQualified && (
                              <span className="ml-2 text-green-600">
                                
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-[180px]">
                            {standing.team_short_name}
                            {standing.team_city && ` • ${standing.team_city}`}
                          </div>
                        </div>
                      </div>
                    </td>

                   
                    <td className="py-4 px-4 text-center font-semibold text-gray-700">
                      {standing.games_played}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 font-bold rounded-full">
                        {standing.wins}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-800 font-bold rounded-full">
                        {standing.losses}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="font-bold text-gray-800">
                        {standing.winPercentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {standing.wins}-{standing.losses}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-semibold">
                      {standing.points_for}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold">
                      {standing.points_against}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold ${
                        standing.pointsDifference >= 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {standing.pointsDifference >= 0 ? '+' : ''}{standing.pointsDifference}
                      </div>
                    </td>
                    
                
                    <td className="py-4 px-4 text-center">
                      {isQualified ? (
                        <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-bold">
                          Clasificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                          Eliminado
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r p-6 rounded-xl border border-orange-300">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
            <FaTrophy className="text-black-500" />
            Equipos Clasificados a Finales
          </h4>
          {sortedStandings.slice(0, 2).map((team, index) => (
            <div key={team.id} className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg border border-green-100">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' :
                'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
              }`}>
                {index + 1}
              </div>
              <div className="flex items-center gap-2">
                {team.team_logo ? (
                  <img src={team.team_logo} alt={team.team_name} className="w-8 h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaBasketballBall className="text-blue-600 text-sm" />
                  </div>
                )}
                <span className="font-semibold text-gray-800">{team.team_name}</span>
              </div>
              <div className="ml-auto text-sm text-gray-600">
                {team.wins}-{team.losses} • {team.winPercentage}%
              </div>
            </div>
          ))}
          {sortedStandings.length < 2 && (
            <p className="text-gray-500 italic text-sm">
              Esperando más equipos para completar la clasificación...
            </p>
          )}
        </div>

      </div>

      

      {sortedStandings.length === 0 && (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <FaBasketballBall className="text-gray-400 text-6xl" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-3">No hay datos de clasificación</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Los datos de clasificación aparecerán aquí después de que se jueguen los primeros partidos
          </p>
        </div>
      )}
    </div>
  )
}

export default StandingsTable