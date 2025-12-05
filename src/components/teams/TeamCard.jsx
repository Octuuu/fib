import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUsers,
  FaTrophy,
  FaBasketballBall 
} from 'react-icons/fa'

const TeamCard = ({ team }) => {
  // Calcular estadísticas
  const winPercentage = team.stats.games_played > 0 
    ? Math.round((team.stats.wins / team.stats.games_played) * 100)
    : 0
  
  const pointsDiff = team.stats.points_for - team.stats.points_against

  return (
    <Link 
      to={`/equipo/${team.id}`}
      className="bg-white rounded-xl duration-300 transform p-6 block border "
    >
      <div className="text-center">
       
        <div className="mb-4">
          {team.logo_url ? (
            <img 
              src={team.logo_url} 
              alt={team.name}
              className="w-24 h-24 object-contain mx-auto"
            />
          ) : (
            <div className="w-24 h-24 mx-auto flex items-center justify-center bg-gradient-to-br rounded-full">
              <FaBasketballBall className="text-white text-4xl" />
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{team.name}</h3>
        
        <div className="flex flex-col items-center gap-2 mb-4 text-gray-600">
          {team.city && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400" />
              <span className="text-sm">{team.city}</span>
            </div>
          )}
          
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <FaUsers />
              <span className="text-lg font-bold">{team.players_count || 0}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Jugadores</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-black-600">{team.stats.wins || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Victorias</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${winPercentage > 50 ? 'text-black-600' : 'black-500'}`}>
              {winPercentage}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Efectividad</div>
          </div>
        </div>
        
    
      </div>
    </Link>
  )
}

export default TeamCard