import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'

const RecentMatches = ({ matches, loading }) => {
  const navigate = useNavigate()

  const handleMatchClick = (matchId) => {
    navigate(`/partido/${matchId}`)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Resultados Recientes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 sm:p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Función para formatear tiempo sin segundos
  const formatTime = (timeString) => {
    if (!timeString) return ''
    // timeString viene como "21:30:00" o "22:00:00"
    return timeString.substring(0, 5) // Toma solo "21:30" o "22:00"
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
          PARTIDOS RECIENTES
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {matches.map((match) => {
          // Usar la fecha directamente desde Supabase
          const matchDate = new Date(match.match_date)
          const homeTeam = match.home_team
          const awayTeam = match.away_team

          if (!homeTeam || !awayTeam) return null

          return (
            <div
              key={match.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg cursor-pointer border border-orange-500 flex flex-col transition-shadow duration-200"
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
                      {match.home_score ?? 0} - {match.away_score ?? 0}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      {/* Usar match_time directamente en lugar de toLocaleTimeString */}
                      {match.match_time ? formatTime(match.match_time) : '--:--'}
                    </div>
                    {match.status === 'finished' && (
                      <div className="text-xs mt-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-semibold">
                        FINAL
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
                    <div className="text-sm sm:text-base font-bold truncate w-full text-center">{homeTeam.short_name || homeTeam.name}</div>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-400 font-bold mx-2">VS</div>

                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-bold truncate w-full text-center">{awayTeam.short_name || awayTeam.name}</div>
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
                    <span>Ver estadísticas</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {matches.length === 0 && !loading && (
        <div className="text-center py-10 sm:py-16">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4"></div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mb-2">No hay resultados recientes</h3>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto px-4">Los partidos aparecerán aquí una vez que se hayan jugado</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="text-center mt-8 sm:mt-10">
          <button 
            onClick={() => navigate('/calendario')}
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            <span>Ver todos los partidos</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default RecentMatches