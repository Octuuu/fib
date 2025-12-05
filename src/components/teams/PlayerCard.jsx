import React from 'react'
import { 
  FaBasketballBall,
  FaAssistiveListeningSystems,
  FaChartBar,
  FaUser,
  FaCaretRight,
  FaShieldAlt,
  FaBolt
} from 'react-icons/fa'

const PlayerCardHorizontal = ({ player }) => {
  // Estadísticas del jugador
  const stats = {
    points: player.points || 0,
    assists: player.assists || 0,
    rebounds: player.rebounds || 0,
    steals: player.steals || 0,
    blocks: player.blocks || 0,
    games_played: player.games_played || 0
  }

  // Promedios
  const avgPoints = stats.games_played > 0 ? (stats.points / stats.games_played).toFixed(1) : '0.0'
  const avgAssists = stats.games_played > 0 ? (stats.assists / stats.games_played).toFixed(1) : '0.0'
  const avgRebounds = stats.games_played > 0 ? (stats.rebounds / stats.games_played).toFixed(1) : '0.0'

  // Color según posición
  const getPositionColor = (position) => {
    const positions = {
      'Base': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      'Escolta': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      'Alero': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
      'Ala-pívot': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
      'Pívot': 'bg-gradient-to-r from-red-500 to-red-600 text-white'
    }
    return positions[position] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
  }

  const positionColor = getPositionColor(player.player_position)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 hover:shadow-md transition-shadow duration-200">
      
     
      <div className="flex items-center justify-between mb-2">
        {/* Nombre y equipo */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
         
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              {player.photo_url ? (
                <img 
                  src={player.photo_url} 
                  alt={player.first_name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-white text-sm font-bold">
                  #{player.jersey_number || '00'}
                </span>
              )}
            </div>
          </div>

          {/* Nombre */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800 text-sm truncate">
                {player.first_name} {player.last_name}
              </h3>
              {player.is_active && (
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
              )}
            </div>
            
            {/* Equipo */}
            {player.team && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-600 truncate">
                <FaUser className="text-gray-400 flex-shrink-0" size={10} />
                <span className="truncate">{player.team.short_name || player.team.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Posición */}
        <div className="flex-shrink-0">
          <span className={`px-3 py-1 rounded-full text-xs font-medium`}>
            {player.player_position || 'N/A'}
          </span>
        </div>
      </div>

  
      <div className="grid grid-cols-4 gap-2 mb-2">
    
        <div className="text-center  rounded-lg p-1.5">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            
            <span className="text-sm font-bold text-gray-800">{stats.points}</span>
          </div>
          <div className="text-[10px] text-gray-600">Puntos</div>
          <div className="text-[10px] text-gray-500">{avgPoints} PPG</div>
        </div>

  
        <div className="text-center rounded-lg p-1.5">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            
            <span className="text-sm font-bold text-gray-800">{stats.assists}</span>
          </div>
          <div className="text-[10px] text-gray-600">Asist.</div>
          <div className="text-[10px] text-gray-500">{avgAssists} APG</div>
        </div>

      
        <div className="text-center  rounded-lg p-1.5">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            
            <span className="text-sm font-bold text-gray-800">{stats.rebounds}</span>
          </div>
          <div className="text-[10px] text-gray-600">Rebotes</div>
          <div className="text-[10px] text-gray-500">{avgRebounds} RPG</div>
        </div>

        <div className="text-center rounded-lg p-1.5">
          <div className="flex items-center justify-center gap-1 mb-0.5">
           
            <span className="text-sm font-bold text-gray-800">{stats.games_played}</span>
          </div>
          <div className="text-[10px] text-gray-600">P.J.</div>
          <div className="text-[10px] text-gray-500">Partidos</div>
        </div>
      </div>

    
      <div className="grid grid-cols-3 gap-2">
        
        <div className="text-center rounded-lg p-1.5">
          <div className="flex items-center justify-center gap-1 mb-0.5">
         
            <span className="text-xs font-bold text-gray-800">{stats.steals}</span>
          </div>
          <div className="text-[10px] text-gray-600">Robos</div>
        </div>

        <div className="text-center  rounded-lg p-1.5">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            
            <span className="text-xs font-bold text-gray-800">{stats.blocks}</span>
          </div>
          <div className="text-[10px] text-gray-600">Tapones</div>
        </div>

       
        <div className="text-center text-black rounded-lg p-1.5">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <span className="text-xs font-bold">
              {(parseFloat(avgPoints) + parseFloat(avgAssists) + parseFloat(avgRebounds)).toFixed(1)}
            </span>
          </div>
          <div className="text-[10px] ">Eficiencia</div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCardHorizontal