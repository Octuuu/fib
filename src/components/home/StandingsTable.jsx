import React from 'react'
import { useStandings } from '../../hooks/useStandings'
import { FaBasketballBall } from 'react-icons/fa'

const StandingsTable = () => {
  const { standings, headToHeadResults, loading, error, activeTournament } = useStandings()

  // Función para obtener resultados de enfrentamientos directos entre dos equipos
  const getHeadToHeadResults = (teamAId, teamBId) => {
    if (!headToHeadResults || headToHeadResults.length === 0) return []
    
    return headToHeadResults.filter(match => 
      (match.home_team_id === teamAId && match.away_team_id === teamBId) ||
      (match.home_team_id === teamBId && match.away_team_id === teamAId)
    )
  }

  // Función para calcular quién gana en enfrentamientos directos
  const calculateHeadToHeadWinner = (teamAId, teamBId) => {
    const matches = getHeadToHeadResults(teamAId, teamBId)
    
    if (matches.length === 0) return 0 // No hay enfrentamientos
    
    let teamAWins = 0
    let teamBWins = 0
    let teamAPoints = 0
    let teamBPoints = 0
    
    matches.forEach(match => {
      if (match.home_team_id === teamAId) {
        teamAPoints += match.home_score || 0
        teamBPoints += match.away_score || 0
        if ((match.home_score || 0) > (match.away_score || 0)) {
          teamAWins++
        } else if ((match.away_score || 0) > (match.home_score || 0)) {
          teamBWins++
        }
      } else {
        teamAPoints += match.away_score || 0
        teamBPoints += match.home_score || 0
        if ((match.away_score || 0) > (match.home_score || 0)) {
          teamAWins++
        } else if ((match.home_score || 0) > (match.away_score || 0)) {
          teamBWins++
        }
      }
    })
    
    // Comparar victorias
    if (teamAWins > teamBWins) return 1 // Team A gana
    if (teamBWins > teamAWins) return -1 // Team B gana
    
    // Empate en victorias, comparar diferencia de puntos
    const teamADiff = teamAPoints - teamBPoints
    const teamBDiff = teamBPoints - teamAPoints
    
    if (teamADiff > teamBDiff) return 0.5 // Team A tiene mejor diferencia
    if (teamBDiff > teamADiff) return -0.5 // Team B tiene mejor diferencia
    
    return 0 // Empate total
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Clasificación</h2>
          <p className="text-gray-600 text-sm">Cargando datos de la temporada...</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
          <div className="h-12 bg-gray-100"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-14 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Clasificación</h2>
        </div>
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold mb-2">Error al cargar la clasificación</div>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-900"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Calcular estadísticas finales y ordenar
  const sortedStandings = [...standings]
    .map((standing) => {
      const winPercentage = standing.games_played > 0 
        ? ((standing.wins / standing.games_played) * 100).toFixed(1)
        : '0.0'
      
      const pointsDifference = standing.points_difference || 
        (standing.points_for - standing.points_against)
      
      // Usar total_points que ya está calculado en el hook
      const totalPoints = standing.total_points || 
        (standing.wins * 2 + standing.losses * 1)
      
      return {
        ...standing,
        winPercentage,
        pointsDifference,
        totalPoints,
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
      // 1. Puntos totales (2 por victoria, 1 por derrota)
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
      
      // 2. EMPATE EN PUNTOS - usar enfrentamientos directos
      const headToHead = calculateHeadToHeadWinner(a.team_id, b.team_id)
      if (headToHead !== 0) {
        return -headToHead // Negativo porque queremos orden descendente
      }
      
      // 3. Diferencia de puntos general
      if (b.pointsDifference !== a.pointsDifference) {
        return b.pointsDifference - a.pointsDifference
      }
      
      // 4. Puntos a favor
      if (b.points_for !== a.points_for) {
        return b.points_for - a.points_for
      }
      
      // 5. Orden alfabético
      return a.team_name.localeCompare(b.team_name)
    })
    .map((standing, index) => ({
      ...standing,
      position: index + 1
    }))

  // Identificar grupos de empate
  const groupedByPoints = {}
  sortedStandings.forEach(standing => {
    const key = standing.totalPoints
    if (!groupedByPoints[key]) {
      groupedByPoints[key] = []
    }
    groupedByPoints[key].push(standing)
  })

  // Identificar empates reales (mismo puntos y mismo enfrentamiento directo)
  const tieGroups = Object.values(groupedByPoints).filter(group => group.length > 1)

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {activeTournament?.name || 'Tabla de Clasificación'}
        </h2>
        <p className="text-gray-600 text-sm">Los 3 primeros equipos se clasifican • Victoria = 2 pts • Derrota = 1 pt</p>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">Pos.</th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">Equipo</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">PJ</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">PTS</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">G</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">P</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">%</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">PF</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">PC</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">+/-</th>
                <th className="py-3 px-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider border-b border-gray-300">Estado</th>
              </tr>
            </thead>
            <tbody>
              {sortedStandings.map((standing) => {
                const position = standing.position
                const isQualified = position <= 3
                
                // Verificar si este equipo está en un grupo de empate
                const tieGroup = tieGroups.find(group => 
                  group.some(team => team.id === standing.id)
                )
                const hasTie = tieGroup && tieGroup.length > 1
                
                return (
                  <tr 
                    key={standing.id} 
                    className={`border-t border-gray-200 ${
                      isQualified ? 'bg-gray-50' : ''
                    }`}
                  >
                    
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className={`w-7 h-7 rounded flex items-center justify-center font-bold ${
                          position === 1 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          position === 2 ? 'bg-gray-100 text-gray-700 border border-gray-300' :
                          position === 3 ? 'bg-gray-50 text-gray-700 border border-gray-300' :
                          'bg-white text-gray-600 border border-gray-300'
                        }`}>
                          {position}
                        </div>
                        {hasTie && (
                          <span className="ml-1 text-xs text-gray-500" title="Equipo empatado en puntos">
                            =
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {standing.team_logo ? (
                            <img 
                              src={standing.team_logo} 
                              alt={standing.team_name}
                              className="w-9 h-9 object-contain"
                            />
                          ) : (
                            <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full">
                              <FaBasketballBall className="text-gray-600 text-sm" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 truncate max-w-[180px] text-sm">
                            {standing.team_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[160px]">
                            {standing.team_short_name}
                            {standing.team_city && ` • ${standing.team_city}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center font-semibold text-gray-700 text-sm">
                      {standing.games_played}
                    </td>
                    
                    <td className="py-3 px-4 text-center">
                      <div className="font-bold text-gray-800 text-base">
                        {standing.totalPoints}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-800 font-bold rounded text-xs">
                        {standing.wins}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-800 font-bold rounded text-xs">
                        {standing.losses}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="font-semibold text-gray-800 text-sm">
                        {standing.winPercentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {standing.wins}-{standing.losses}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-gray-700 text-sm">
                      {standing.points_for}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-gray-700 text-sm">
                      {standing.points_against}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-semibold ${
                        standing.pointsDifference >= 0 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {standing.pointsDifference >= 0 ? '+' : ''}{standing.pointsDifference}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4 text-center">
                      {isQualified ? (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">
                          Clasificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                          Fuera
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

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-300">
          <h4 className="font-bold text-gray-800 mb-3 text-sm">Equipos Clasificados</h4>
          {sortedStandings.slice(0, 3).map((team, index) => (
            <div key={team.id} className="flex items-center gap-3 mb-2 p-2 bg-white rounded border border-gray-200">
              <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                index === 0 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                index === 1 ? 'bg-gray-100 text-gray-700 border border-gray-300' :
                'bg-gray-50 text-gray-700 border border-gray-300'
              }`}>
                {index + 1}
              </div>
              <div className="flex items-center gap-2">
                {team.team_logo ? (
                  <img src={team.team_logo} alt={team.team_name} className="w-6 h-6 object-contain" />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaBasketballBall className="text-gray-600 text-xs" />
                  </div>
                )}
                <span className="font-semibold text-gray-800 text-sm">{team.team_name}</span>
              </div>
              <div className="ml-auto flex flex-col items-end">
                <div className="text-xs font-bold text-gray-800">{team.totalPoints} pts</div>
                <div className="text-xs text-gray-600">
                  {team.wins}-{team.losses} • {team.winPercentage}%
                </div>
              </div>
            </div>
          ))}
          {sortedStandings.length < 3 && (
            <p className="text-gray-500 italic text-xs mt-2">
              Aún faltan equipos para completar la clasificación...
            </p>
          )}
        </div>

        {sortedStandings.length > 3 && (
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-300">
            <h4 className="font-bold text-gray-800 mb-3 text-sm">Equipos Fuera de Clasificación</h4>
            {sortedStandings.slice(3, 6).map((team, index) => (
              <div key={team.id} className="flex items-center gap-3 mb-2 p-2 bg-white rounded border border-gray-200">
                <div className="w-6 h-6 rounded flex items-center justify-center font-bold text-xs bg-gray-100 text-gray-700 border border-gray-300">
                  {index + 4}
                </div>
                <div className="flex items-center gap-2">
                  {team.team_logo ? (
                    <img src={team.team_logo} alt={team.team_name} className="w-6 h-6 object-contain" />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaBasketballBall className="text-gray-600 text-xs" />
                    </div>
                  )}
                  <span className="font-semibold text-gray-800 text-sm">{team.team_name}</span>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <div className="text-xs font-bold text-gray-800">{team.totalPoints} pts</div>
                  <div className="text-xs text-gray-600">
                    {team.wins}-{team.losses} • {team.winPercentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {sortedStandings.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-3">
            <FaBasketballBall className="text-gray-400 text-5xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay datos de clasificación</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Los datos de clasificación aparecerán aquí después de que se jueguen los primeros partidos
          </p>
        </div>
      )}
    </div>
  )
}

export default StandingsTable