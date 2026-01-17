import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'

const MatchCalendar = ({ matches }) => {
  const navigate = useNavigate()

  const handleMatchClick = (matchId) => {
    navigate(`/partido/${matchId}`)
  }

  // Función para formatear tiempo sin segundos
  const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString.substring(0, 5) // Toma solo "21:30" o "22:00"
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 sm:py-12 lg:py-16">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 text-gray-300">📅</div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-600 mb-3 sm:mb-4">
            Calendario de Partidos
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            No hay partidos programados en este momento.
          </p>
        </div>
      </div>
    )
  }

  // Agrupar partidos por fecha
  const matchesByDate = matches.reduce((acc, match) => {
    if (!match.match_date) return acc
    
    const dateStr = new Date(match.match_date).toDateString()
    if (!acc[dateStr]) {
      acc[dateStr] = []
    }
    acc[dateStr].push(match)
    return acc
  }, {})

  // Ordenar fechas cronológicamente
  const sortedDates = Object.keys(matchesByDate).sort((a, b) => new Date(a) - new Date(b))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
          Calendario de Partidos
        </h1>
      </div>
      
      {/* Lista de días */}
      <div className="space-y-8 sm:space-y-10">
        {sortedDates.map((dateStr) => {
          const date = new Date(dateStr)
          const dayMatches = matchesByDate[dateStr]
          
          return (
            <div key={dateStr} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Cabecera de la fecha */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold text-gray-800">
                      {date.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h2>
                  </div>
                  <div className="text-sm font-semibold text-gray-500">
                    {dayMatches.length} partido{dayMatches.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Grid de partidos */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {dayMatches.map((match) => {
                    const matchDate = new Date(match.match_date)
                    const homeTeam = match.home_team
                    const awayTeam = match.away_team

                    if (!homeTeam || !awayTeam) return null

                    return (
                      <div
                        key={match.id}
                        className="bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer border border-gray-200 hover:border-orange-300 flex flex-col transition-all duration-200"
                        onClick={() => handleMatchClick(match.id)}
                      >
                        <div className="p-3 sm:p-4 border-b border-gray-100">
                          <div className="flex flex-col xs:flex-row justify-between gap-2 text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Calendar size={14} className="sm:w-4 sm:h-4" />
                              <span>{matchDate.toLocaleDateString('es-ES', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}</span>
                            </div>
                            {match.location && (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <MapPin size={14} className="sm:w-4 sm:h-4" />
                                <span className="truncate max-w-[120px] xs:max-w-[140px] sm:max-w-[160px]">{match.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4 sm:p-6 flex-grow">
                          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14">
                              {homeTeam.logo_url ? (
                                <img 
                                  src={homeTeam.logo_url} 
                                  alt={homeTeam.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                                  <span className="text-xl">🏀</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-col items-center mx-1 sm:mx-2">
                              <div className="text-3xl sm:text-4xl font-bold">
                                {match.home_score !== null && match.away_score !== null 
                                  ? `${match.home_score} - ${match.away_score}`
                                  : match.status === 'scheduled' 
                                    ? 'VS'
                                    : '--'
                                }
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                {match.match_time ? formatTime(match.match_time) : '--:--'}
                              </div>
                              {match.status === 'finished' && (
                                <div className="text-xs mt-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-semibold">
                                  FINAL
                                </div>
                              )}
                              {match.status === 'scheduled' && (
                                <div className="text-xs mt-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-semibold">
                                  PROGRAMADO
                                </div>
                              )}
                              {match.status === 'live' && (
                                <div className="text-xs mt-1 px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full font-semibold animate-pulse">
                                  EN VIVO
                                </div>
                              )}
                            </div>

                            <div className="w-12 h-12 sm:w-14 sm:h-14">
                              {awayTeam.logo_url ? (
                                <img 
                                  src={awayTeam.logo_url} 
                                  alt={awayTeam.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                                  <span className="text-xl">🏀</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-col items-center flex-1 min-w-0">
                              <div className="text-sm sm:text-base font-bold truncate w-full text-center">
                                {homeTeam.short_name || homeTeam.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Local
                              </div>
                            </div>

                            <div className="text-xs sm:text-sm text-gray-400 font-bold mx-2">VS</div>

                            <div className="flex flex-col items-center flex-1 min-w-0">
                              <div className="text-sm sm:text-base font-bold truncate w-full text-center">
                                {awayTeam.short_name || awayTeam.name}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Visitante
                              </div>
                            </div>
                          </div>

                          {match.mvp && (
                            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2">
                                <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                                  <span className="text-sm font-medium text-gray-700">MVP:</span>
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-center sm:text-right truncate ml-0 sm:ml-2 max-w-full">
                                  {match.mvp.first_name} {match.mvp.last_name}
                                  {match.mvp.jersey_number && ` #${match.mvp.jersey_number}`}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-3 sm:mt-4">
                            <button className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base group">
                              <span>Ver detalles</span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mensaje si no hay partidos (ya manejado arriba, pero por si acaso) */}
      {sortedDates.length === 0 && (
        <div className="text-center py-10 sm:py-16">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📅</div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mb-2">
            No hay partidos programados
          </h3>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto px-4">
            Los partidos aparecerán aquí una vez que se hayan programado
          </p>
        </div>
      )}
    </div>
  )
}

export default MatchCalendar