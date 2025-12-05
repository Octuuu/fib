import React from 'react'

const PlayerStatCard = ({ player, statType, statValue, totalValue, percentage, rank }) => {

  const getStatConfig = () => {
    switch(statType) {
      case 'points':
        return {
          title: 'Máximo Anotador',
          unit: 'PPG',
          icon: '',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          description: 'Puntos por partido'
        }
      case 'assists':
        return {
          title: 'Máximo Asistente',
          unit: 'APG',
          icon: '',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          description: 'Asistencias por partido'
        }
      case 'rebounds':
        return {
          title: 'Máximo Reboteador',
          unit: 'RPG',
          icon: '',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          description: 'Rebotes por partido'
        }
      case 'threePoints':
        return {
          title: 'Máximo Triplista',
          unit: '3PM',
          icon: '',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          description: 'Triples anotados'
        }
      default:
        return {
          title: 'Figura Destacada',
          unit: '',
          icon: '',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          description: ''
        }
    }
  }

  const config = getStatConfig()
  const playerName = player ? `${player.first_name} ${player.last_name}` : 'Sin datos'
  const teamName = player?.team?.short_name || player?.team?.name || ''
  const jerseyNumber = player?.jersey_number ? `#${player.jersey_number}` : ''

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
     
      <div className="flex justify-between items-start mb-4">
        <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center`}>
          <span className="font-bold text-lg">{rank}</span>
        </div>
        <div className="text-3xl">{config.icon}</div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-lg text-gray-800">{config.title}</h3>
        <div className="flex items-center mt-2">
          {player?.photo_url ? (
            <img 
              src={player.photo_url} 
              alt={playerName}
              className="w-12 h-12 rounded-full mr-3 object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
              <span className="text-gray-500"></span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{playerName}</p>
            <div className="flex items-center text-sm text-gray-600">
              <span>{teamName}</span>
              {jerseyNumber && (
                <>
                  <span className="mx-2">•</span>
                  <span>{jerseyNumber}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <div className={`${config.bgColor} rounded-lg p-4`}>
        <div className="flex items-baseline">
          <span className={`text-3xl font-bold ${config.color}`}>
            {statValue.toFixed(statType === 'threePoints' ? 0 : 1)}
          </span>
          <span className="ml-2 text-gray-600">{config.unit}</span>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        
        
        {statType === 'threePoints' && percentage !== undefined && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Eficacia: <span className="font-semibold">{percentage}%</span>
            </p>
          </div>
        )}
        
        {totalValue !== undefined && statType !== 'threePoints' && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">{totalValue}</span>
            </p>
          </div>
        )}
      </div>

      {player?.gamesPlayed && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          {player.gamesPlayed} partido{player.gamesPlayed !== 1 ? 's' : ''} jugado{player.gamesPlayed !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default PlayerStatCard