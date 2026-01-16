import React from 'react'
import { FaBasketballBall, FaFire, FaAssistiveListeningSystems, FaBullseye } from 'react-icons/fa'

const PlayerStatCard = ({ 
  player, 
  statType, 
  statValue, 
  totalValue, 
  percentage, 
  rank, 
  title,
  icon: Icon = FaBasketballBall
}) => {
  
  // Configurar según el tipo de estadística
  const getStatConfig = () => {
    switch(statType) {
      case 'points':
        return {
          label: 'PPP',
          unit: '',
          icon: FaFire,
          color: 'text-red-600',
          description: 'Puntos por partido'
        }
      case 'assists':
        return {
          label: 'APP',
          unit: '',
          icon: FaAssistiveListeningSystems,
          color: 'text-blue-600',
          description: 'Asistencias por partido'
        }
      case 'rebounds':
        return {
          label: 'RPP',
          unit: '',
          icon: FaBullseye,
          color: 'text-green-600',
          description: 'Rebotes por partido'
        }
      case 'threePoints':
        return {
          label: 'Triples',
          unit: '',
          icon: FaBasketballBall,
          color: 'text-purple-600',
          description: 'Triples anotados'
        }
      default:
        return {
          label: 'Estadística',
          unit: '',
          icon: FaBasketballBall,
          color: 'text-gray-600',
          description: 'Estadística destacada'
        }
    }
  }

  const config = getStatConfig()
  const fullName = `${player.first_name} ${player.last_name}`
  
  // Formatear valor de estadística
  const formatStatValue = () => {
    if (statType === 'threePoints') {
      return `${statValue}${percentage ? ` (${percentage}%)` : ''}`
    }
    return statValue.toFixed(1)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Cabecera con ranking */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.color} bg-gray-100 font-bold`}>
              {rank}
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">{title || config.description}</h3>
              <p className="text-gray-600 text-xs">{config.label}</p>
            </div>
          </div>
          <Icon className={`${config.color} text-xl`} />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4">
        {/* Jugador */}
        <div className="flex items-center gap-3 mb-4">
          {player.avatar_url ? (
            <img 
              src={player.avatar_url} 
              alt={fullName}
              className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = `
                  <div class="w-14 h-14 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                    <span class="text-gray-600 font-semibold text-lg">${player.first_name?.charAt(0)}${player.last_name?.charAt(0)}</span>
                  </div>
                `
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-lg">
                {player.first_name?.charAt(0)}{player.last_name?.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800">{fullName}</h4>
            <div className="flex items-center gap-2 mt-1">
              {player.team?.logo_url && (
                <img 
                  src={player.team.logo_url} 
                  alt={player.team.name}
                  className="w-4 h-4 object-contain"
                />
              )}
              <span className="text-gray-600 text-xs">
                {player.team?.name || 'Sin equipo'}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              #{player.jersey_number || '?'} • {player.position || 'Jugador'}
            </p>
          </div>
        </div>

        {/* Estadística principal */}
        <div className="bg-gray-50 rounded-md p-3 text-center mb-4 border border-gray-200">
          <div className={`text-3xl font-bold ${config.color} mb-1`}>
            {formatStatValue()}
          </div>
          <p className="text-gray-600 text-xs">
            {config.description}
            {statType !== 'threePoints' && ' por partido'}
          </p>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-md p-3 text-center border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Partidos</div>
            <div className="text-base font-semibold text-gray-800">{player.games_played || 0}</div>
          </div>
          
          {totalValue !== undefined && (
            <div className="bg-white rounded-md p-3 text-center border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Total</div>
              <div className="text-base font-semibold text-gray-800">{totalValue}</div>
            </div>
          )}
        </div>

        {/* Promedios adicionales */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            {player.games_played || 0} partidos jugados
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlayerStatCard