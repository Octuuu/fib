import React, { useState } from 'react'

const MatchItem = ({ match }) => {
  const [imageError, setImageError] = useState({
    home: false,
    away: false
  })

  const homeTeam = match.home_team
  const awayTeam = match.away_team

  if (!homeTeam || !awayTeam) {
    return null
  }

  const matchDate = new Date(match.match_date)
  
  // Formato responsivo para fecha
  const formattedDate = matchDate.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
  
  // Función para formatear tiempo sin segundos
  const formatTime = (timeString) => {
    if (!timeString) return '--:--'
    // timeString viene como "21:30:00" o "22:00:00"
    return timeString.substring(0, 5) // Toma solo "21:30" o "22:00"
  }
  
  // Usar match_time en lugar de toLocaleTimeString
  const formattedTime = match.match_time ? formatTime(match.match_time) : '--:--'

  const isWinner = (teamId) => {
    if (match.status !== 'finished') return null
    if (match.home_score === null || match.away_score === null) return null
    return match.home_score > match.away_score ? teamId === match.home_team_id : teamId === match.away_team_id
  }

  const getStatusBadge = () => {
    switch(match.status) {
      case 'finished':
        return { text: 'FINAL', color: 'bg-red-100 text-red-800' }
      case 'scheduled':
        return { text: 'PROG.', color: 'bg-blue-100 text-blue-800' }
      case 'ongoing':
        return { text: 'EN JUEGO', color: 'bg-green-100 text-green-800' }
      case 'postponed':
        return { text: 'APLAZ.', color: 'bg-yellow-100 text-yellow-800' }
      case 'cancelled':
        return { text: 'CANC.', color: 'bg-gray-100 text-gray-800' }
      default:
        return { text: 'PEND.', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const statusBadge = getStatusBadge()

  return (
    <div className="bg-white rounded-lg shadow-sm sm:shadow-md transition duration-200 p-4 sm:p-6">
      
      <div className="text-center mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2 mb-2">
          <div className="text-base sm:text-lg font-semibold text-gray-800 capitalize">
            {formattedDate}
          </div>
          <div className="hidden sm:block text-gray-400">•</div>
          <div className="text-gray-600">
            <span className="font-medium">{formattedTime}</span>
          </div>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-500 flex flex-col items-center space-y-1">
          {match.location && (
            <div className="inline-flex items-center">
              <span className="truncate">{match.location}</span>
            </div>
          )}
          {match.tournament && (
            <div className="inline-flex items-center ml-0 sm:ml-2">
              <span className="truncate">{match.tournament.name}</span>
            </div>
          )}
        </div>
      </div>


      <div className="flex items-center justify-between mb-4">
        
        <div className="flex items-center flex-1">
          
          <div className="flex-shrink-0 mr-2 sm:mr-4">
            {homeTeam.logo_url && !imageError.home ? (
              <img 
                src={homeTeam.logo_url} 
                alt={homeTeam.name}
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                onError={() => setImageError(prev => ({...prev, home: true}))}
              />
            ) : (
              <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl"></span>
              </div>
            )}
          </div>
          
          <div className="text-right flex-1 min-w-0">
            <div className={`text-sm sm:text-base font-semibold truncate ${
              isWinner(match.home_team_id) ? 'text-green-600' : 'text-gray-800'
            }`}>
              {homeTeam.short_name || homeTeam.name}
            </div>
            {match.home_score !== null && (
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">{match.home_score}</div>
            )}
          </div>
        </div>

        
        <div className="mx-2 sm:mx-4 md:mx-6 flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
          <div className={`${statusBadge.color} px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-1 sm:mb-2 whitespace-nowrap`}>
            {statusBadge.text}
          </div>
          <div className="text-gray-400 font-bold text-base sm:text-lg">VS</div>
        </div>

  
        <div className="flex items-center flex-1 justify-end">
        
          <div className="text-left flex-1 min-w-0 mr-2 sm:mr-4">
            <div className={`text-sm sm:text-base font-semibold truncate ${
              isWinner(match.away_team_id) ? 'text-green-600' : 'text-gray-800'
            }`}>
              {awayTeam.short_name || awayTeam.name}
            </div>
            {match.away_score !== null && (
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">{match.away_score}</div>
            )}
          </div>
          
  
          <div className="flex-shrink-0">
            {awayTeam.logo_url && !imageError.away ? (
              <img 
                src={awayTeam.logo_url} 
                alt={awayTeam.name}
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                onError={() => setImageError(prev => ({...prev, away: true}))}
              />
            ) : (
              <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl"></span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sm:hidden grid grid-cols-2 gap-2 text-xs text-gray-500 mt-2 border-t pt-2">
        <div className="truncate pr-2">
          {homeTeam.name !== homeTeam.short_name && homeTeam.short_name ? homeTeam.name : ''}
        </div>
        <div className="truncate pl-14">
          {awayTeam.name !== awayTeam.short_name && awayTeam.short_name ? awayTeam.name : ''}
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-2 gap-4 text-sm text-gray-500 mt-2">
        <div className="truncate text-right pr-4">
          {homeTeam.name !== homeTeam.short_name && homeTeam.short_name ? homeTeam.name : ''}
        </div>
        <div className="truncate pl-4">
          {awayTeam.name !== awayTeam.short_name && awayTeam.short_name ? awayTeam.name : ''}
        </div>
      </div>

      {match.status === 'finished' && (
        <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-4 sm:mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        
            <div className="text-sm sm:text-base text-gray-700">
              <span className="font-medium">Resultado: </span>
              {match.home_score > match.away_score ? (
                <span className="font-semibold text-green-600">{homeTeam.short_name || homeTeam.name} gana</span>
              ) : match.home_score < match.away_score ? (
                <span className="font-semibold text-green-600">{awayTeam.short_name || awayTeam.name} gana</span>
              ) : (
                <span className="font-semibold text-yellow-600">Empate</span>
              )}
            </div>
            
          
            {match.home_score !== null && match.away_score !== null && (
              <div className="text-sm sm:text-base text-gray-700">
                <span className="font-medium">Diferencia: </span>
                <span className={`font-semibold ${Math.abs(match.home_score - match.away_score) >= 10 ? 'text-red-600' : 'text-blue-600'}`}>
                  {Math.abs(match.home_score - match.away_score)} pts
                </span>
              </div>
            )}
          </div>
          
        
          {match.mvp && match.mvp.length > 0 && (
            <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100">
              <div className="text-sm sm:text-base">
                <span className="font-medium text-gray-600">MVP:</span>
                <span className="ml-2 font-semibold">
                  #{match.mvp[0].jersey_number} {match.mvp[0].first_name} {match.mvp[0].last_name}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {match.status === 'scheduled' && (
        <div className="border-t border-gray-200 pt-3 sm:pt-4 mt-4 sm:mt-6">
          <div className="text-center text-sm sm:text-base text-gray-600 space-y-1">
            {match.match_time && (
              <div>Hora: {formatTime(match.match_time)}</div>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {match.round_number && (
                <span>Jornada {match.round_number}</span>
              )}
              {match.phase && match.phase !== 'group' && (
                <span>• Fase: {match.phase}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {match.is_playoff && (
        <div className="border-t border-gray-200 pt-3 mt-4">
          <div className="text-center">
            <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs font-bold uppercase">
              PLAYOFF
            </span>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              {match.playoff_round && `Ronda ${match.playoff_round}`}
              {match.playoff_game && match.playoff_game > 1 && ` • Juego ${match.playoff_game}`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchItem