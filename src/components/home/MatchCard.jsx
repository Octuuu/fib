import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, Trophy } from 'lucide-react'

const MatchCard = ({ match }) => {
  const navigate = useNavigate()
  const homeTeam = match.home_team
  const awayTeam = match.away_team

  if (!homeTeam || !awayTeam) {
    console.log('Missing team data:', match)
    return null
  }

  const matchDate = new Date(match.match_date)
  
  const formattedDate = matchDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
  
  // Función para formatear tiempo sin segundos
  const formatTime = (timeString) => {
    if (!timeString) return '--:--'
    // timeString viene como "21:30:00" o "22:00:00"
    return timeString.substring(0, 5) // Toma solo "21:30" o "22:00"
  }
  
  // Usar match_time en lugar de toLocaleTimeString
  const formattedTime = match.match_time ? formatTime(match.match_time) : '--:--'

  return (
    <div className="bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Clock size={16} />
            <span className="font-medium">{formattedDate}</span>
          </div>
          {match.location && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin size={14} />
              <span className="truncate max-w-[180px] lg:max-w-[220px]">{match.location}</span>
            </div>
          )}
        </div>
        <div className="text-gray-500 text-sm mt-1">
          {formattedTime} • {match.tournament?.name || 'Torneo'}
        </div>
      </div>
      
      
      <div className="p-6 flex-grow">
        
        <div className="flex items-center justify-between gap-3 lg:gap-4">
         
          <div className="flex flex-col items-center text-center flex-1 min-w-0">
            <div className="mb-3">
              {homeTeam.logo_url ? (
                <img 
                  src={homeTeam.logo_url} 
                  alt={homeTeam.name}
                  className="w-16 h-16 lg:w-20 lg:h-20 object-contain mx-auto"
                />
              ) : (
                <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 rounded-full mx-auto">
                  <span className="text-3xl"></span>
                </div>
              )}
            </div>
            <div className="w-full">
              <div className="font-bold text-gray-800 truncate text-sm lg:text-base">
                {homeTeam.name}
              </div>
              <div className="text-gray-500 text-xs mt-1 truncate">
                {homeTeam.short_name || homeTeam.city || 'Local'}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mx-2 lg:mx-4">
            <div className="text-2xl lg:text-3xl font-bold text-gray-400 mb-2">VS</div>
            {match.status === 'finished' ? (
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-2 rounded-lg">
                <div className="text-2xl lg:text-3xl font-bold text-gray-800">
                  {match.home_score || 0} - {match.away_score || 0}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 font-medium bg-yellow-50 px-3 py-1 rounded-full">
                Por jugar
              </div>
            )}
          </div>

          <div className="flex flex-col items-center text-center flex-1 min-w-0">
            <div className="mb-3">
              {awayTeam.logo_url ? (
                <img 
                  src={awayTeam.logo_url} 
                  alt={awayTeam.name}
                  className="w-16 h-16 lg:w-20 lg:h-20 object-contain mx-auto"
                />
              ) : (
                <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 rounded-full mx-auto">
                  <span className="text-3xl"></span>
                </div>
              )}
            </div>
            <div className="w-full">
              <div className="font-bold text-gray-800 truncate text-sm lg:text-base">
                {awayTeam.name}
              </div>
              <div className="text-gray-500 text-xs mt-1 truncate">
                {awayTeam.short_name || awayTeam.city || 'Visitante'}
              </div>
            </div>
          </div>
        </div>

        {match.status === 'finished' && match.mvp && (
          <div className="mt-6 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-orange-500" />
                <span className="font-semibold text-gray-700">MVP:</span>
              </div>
              <div className="text-sm font-bold text-gray-800 truncate max-w-[200px]">
                {match.mvp.first_name} {match.mvp.last_name}
                {match.mvp.jersey_number && ` #${match.mvp.jersey_number}`}
              </div>
            </div>
          </div>
        )}
      </div>
      
    
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        {match.status === 'finished' ? (
          <button 
            onClick={() => navigate(`/partido/${match.id}`)}
            className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-primary text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <span>Ver estadísticas</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm font-medium">
              <Clock size={14} />
              <span>Programado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchCard