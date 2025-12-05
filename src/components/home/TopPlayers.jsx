import React from 'react'
import PlayerStatCard from './PlayerStatCard'
import { usePlayers } from '../../hooks/usePlayers'

const TopPlayers = () => {
  const { getTopPlayers, loading, players } = usePlayers()
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">Figuras Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Obtener los mejores jugadores
  const topPlayers = getTopPlayers()
  
  // Crear el array de líderes con las estadísticas correctas
  const leaders = [
    { 
      player: topPlayers[0], 
      type: 'points', 
      value: topPlayers[0]?.pointsPerGame || 0,
      total: topPlayers[0]?.points || 0,
      rank: 1 
    },
    { 
      player: topPlayers[1], 
      type: 'assists', 
      value: topPlayers[1]?.assistsPerGame || 0,
      total: topPlayers[1]?.assists || 0,
      rank: 2 
    },
    { 
      player: topPlayers[2], 
      type: 'rebounds', 
      value: topPlayers[2]?.reboundsPerGame || 0,
      total: topPlayers[2]?.rebounds || 0,
      rank: 3 
    },
    { 
      player: topPlayers[3], 
      type: 'threePoints', 
      value: topPlayers[3]?.threePointsMade || 0,
      percentage: topPlayers[3]?.threePointsPercentage || 0,
      rank: 4 
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">Figuras Destacadas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaders.map((leader, index) => (
          leader.player ? (
            <PlayerStatCard
              key={`${leader.type}-${index}`}
              player={leader.player}
              statType={leader.type}
              statValue={leader.value}
              totalValue={leader.total}
              percentage={leader.percentage}
              rank={leader.rank}
            />
          ) : (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center justify-center">
              <div className="text-4xl mb-4"></div>
              <p className="text-gray-500 font-medium">Sin datos disponibles</p>
              <p className="text-sm text-gray-400 mt-2">
                {index === 0 && "Máximo anotador"}
                {index === 1 && "Máximo asistente"}
                {index === 2 && "Máximo reboteador"}
                {index === 3 && "Máximo triplista"}
              </p>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

export default TopPlayers