import React from 'react'

const MatchItem = ({ match }) => {
  const homeTeam = match.home_team
  const awayTeam = match.away_team

  if (!homeTeam || !awayTeam) {
    return null
  }

  const matchDate = new Date(match.match_date)
  const formattedDate = matchDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const formattedTime = matchDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })

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
        return { text: 'PROGRAMADO', color: 'bg-blue-100 text-blue-800' }
      case 'ongoing':
        return { text: 'EN JUEGO', color: 'bg-green-100 text-green-800' }
      case 'postponed':
        return { text: 'APLAZADO', color: 'bg-yellow-100 text-yellow-800' }
      case 'cancelled':
        return { text: 'CANCELADO', color: 'bg-gray-100 text-gray-800' }
      default:
        return { text: 'PENDIENTE', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const statusBadge = getStatusBadge()

  return (
    <div className="bg-white rounded-lg shadow-md transition duration-200 p-6">
      
      <div className="text-center mb-6">
        <div className="text-lg font-semibold text-gray-800 capitalize">
          {formattedDate}
        </div>
        <div className="text-gray-600 mt-1">
          <span className="font-medium">{formattedTime}</span> 
          {match.location && ` • ${match.location}`}
          {match.tournament && ` • ${match.tournament.name}`}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        
        <div className="flex items-center space-x-4 flex-1">
          
          <div className="flex-shrink-0">
            {homeTeam.logo_url ? (
              <img 
                src={homeTeam.logo_url} 
                alt={homeTeam.name}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23e5e7eb'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='24' fill='%239ca3af'%3E🏀%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
            )}
          </div>
          
          {/* Nombre y puntaje del equipo local */}
          <div className="text-right flex-1">
            <div className={`text-lg font-semibold ${isWinner(match.home_team_id) ? 'text-green-600' : 'text-gray-800'}`}>
              {homeTeam.short_name || homeTeam.name}
            </div>
            {match.home_score !== null && (
              <div className="text-3xl font-bold mt-1">{match.home_score}</div>
            )}
            <div className="text-sm text-gray-500 mt-1">
              {homeTeam.name !== homeTeam.short_name && homeTeam.short_name ? homeTeam.name : ''}
            </div>
          </div>
        </div>

        {/* Separador y estado */}
        <div className="mx-6 flex flex-col items-center">
          <div className={`${statusBadge.color} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-2`}>
            {statusBadge.text}
          </div>
          <div className="text-gray-400 font-bold text-lg">VS</div>
        </div>

        {/* Equipo visitante */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Nombre y puntaje del equipo visitante */}
          <div className="text-left flex-1">
            <div className={`text-lg font-semibold ${isWinner(match.away_team_id) ? 'text-green-600' : 'text-gray-800'}`}>
              {awayTeam.short_name || awayTeam.name}
            </div>
            {match.away_score !== null && (
              <div className="text-3xl font-bold mt-1">{match.away_score}</div>
            )}
            <div className="text-sm text-gray-500 mt-1">
              {awayTeam.name !== awayTeam.short_name && awayTeam.short_name ? awayTeam.name : ''}
            </div>
          </div>
          
          {/* Logo del equipo visitante */}
          <div className="flex-shrink-0">
            {awayTeam.logo_url ? (
              <img 
                src={awayTeam.logo_url} 
                alt={awayTeam.name}
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23e5e7eb'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' font-size='24' fill='%239ca3af'%3E🏀%3C/text%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información adicional */}
      {match.status === 'finished' && (
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Resultado final */}
            <div className="text-gray-700">
              <span className="font-medium">Resultado: </span>
              {match.home_score > match.away_score ? (
                <span className="font-semibold text-green-600">{homeTeam.short_name || homeTeam.name} gana</span>
              ) : match.home_score < match.away_score ? (
                <span className="font-semibold text-green-600">{awayTeam.short_name || awayTeam.name} gana</span>
              ) : (
                <span className="font-semibold text-yellow-600">Empate</span>
              )}
            </div>
            
            {/* Diferencia de puntos */}
            {match.home_score !== null && match.away_score !== null && (
              <div className="text-gray-700">
                <span className="font-medium">Diferencia: </span>
                <span className={`font-semibold ${Math.abs(match.home_score - match.away_score) >= 10 ? 'text-red-600' : 'text-blue-600'}`}>
                  {Math.abs(match.home_score - match.away_score)} pts
                </span>
              </div>
            )}
            
            {/* MVP */}
            {match.mvp && match.mvp.length > 0 && (
              <div className="text-right">
                <div className="text-gray-600 text-sm">MVP:</div>
                <div className="font-semibold">
                  #{match.mvp[0].jersey_number} {match.mvp[0].first_name} {match.mvp[0].last_name}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {match.status === 'scheduled' && (
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="text-center text-gray-600">
            {match.match_time ? `Hora: ${match.match_time}` : 'Hora por confirmar'}
            {match.round_number && ` • Jornada ${match.round_number}`}
            {match.phase && match.phase !== 'group' && ` • Fase: ${match.phase}`}
          </div>
        </div>
      )}

      {/* Información de playoffs */}
      {match.is_playoff && (
        <div className="border-t border-gray-200 pt-3 mt-4">
          <div className="text-center">
            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs font-bold uppercase">
              PLAYOFF • Ronda {match.playoff_round || 1}
            </span>
            {match.playoff_game && match.playoff_game > 1 && (
              <span className="ml-2 text-sm text-gray-600">
                (Juego {match.playoff_game})
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchItem