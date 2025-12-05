import React from 'react'
import { 
  FaBasketballBall, 
  FaAssistiveListeningSystems, 
  FaChartBar,
  FaBolt,
  FaShieldAlt,
  FaBullseye,
  FaTrophy
} from 'react-icons/fa'

const TeamLeaders = ({ players }) => {
 
  const leaders = [
    { 
      stat: 'points', 
      label: 'Puntos', 
      icon: <FaBasketballBall className="text-orange-500" />,
    },
    { 
      stat: 'assists', 
      label: 'Asistencias', 
      icon: <FaAssistiveListeningSystems className="text-blue-500" />
    },
    { 
      stat: 'rebounds', 
      label: 'Rebotes', 
      icon: <FaChartBar className="text-green-500" />
    },
    { 
      stat: 'steals', 
      label: 'Robos', 
      icon: <FaBolt className="text-purple-500" />
    },
    { 
      stat: 'blocks', 
      label: 'Tapones', 
      icon: <FaShieldAlt className="text-red-500" />
    },
    { 
      stat: 'efficiency', 
      label: 'Eficiencia', 
      icon: <FaBullseye className="text-indigo-500" />
    }
  ]

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Líderes del Equipo</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaders.map((leader) => (
          <div 
            key={leader.stat} 
            className={`border rounded-lg p-4 transition-all duration-300 ${leader.borderColor} bg-gradient-to-br ${leader.color}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {leader.icon}
                <span className="font-semibold text-gray-700">{leader.label}</span>
              </div>
              <div className="text-xl font-bold text-gray-800">
                {Math.floor(Math.random() * 100) + 50}
              </div>
            </div>
          
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                #{
                  players.length > 0 
                    ? players[Math.floor(Math.random() * players.length)]?.jersey_number || '00'
                    : '00'
                }
              </div>
              <div className="min-w-0 flex-1">
                {players.length > 0 ? (
                  <>
                    <div className="font-semibold text-gray-800 truncate">
                      {players[0]?.first_name} {players[0]?.last_name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {players[0]?.player_position || 'Sin posición'}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-sm">Sin datos</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <FaTrophy className="text-gray-400 text-4xl" />
          </div>
          <p className="text-gray-500">No hay datos de líderes disponibles</p>
        </div>
      )}
    </div>
  )
}

export default TeamLeaders