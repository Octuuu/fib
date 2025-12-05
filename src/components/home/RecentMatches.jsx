import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Trophy } from 'lucide-react'

const RecentMatches = ({ matches, loading }) => {
  const navigate = useNavigate()

  const handleMatchClick = (matchId) => {
    navigate(`/partido/${matchId}`)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Resultados Recientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">PARTIDOS (FECHAS MAS RECIENTES)</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {matches.map((match) => {
          const matchDate = new Date(match.match_date)
          const homeTeam = match.home_team
          const awayTeam = match.away_team

          if (!homeTeam || !awayTeam) return null

          return (
            <div
              key={match.id}
              className="bg-white rounded-xl shadow-lg cursor-pointer border border-orange-600 flex flex-col"
              onClick={() => handleMatchClick(match.id)}
            >
             
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{matchDate.toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short'
                    })}</span>
                  </div>
                  {match.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">{match.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contenido del partido */}
              <div className="p-6 flex-grow">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                  {/* Equipo local */}
                  <div className="flex flex-col items-center sm:items-end flex-1 min-w-0">
                    <div className="text-lg font-bold truncate w-full text-right">{homeTeam.name}</div>
                    <div className="text-sm text-gray-500">{homeTeam.short_name}</div>
                    <div className="text-4xl font-bold mt-2">{match.home_score || 0}</div>
                  </div>

                  {/* Logo local */}
                  <div className="order-first sm:order-none">
                    {homeTeam.logo_url ? (
                      <img 
                        src={homeTeam.logo_url} 
                        alt={homeTeam.name}
                        className="w-16 h-16 sm:w-14 sm:h-14 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-100 rounded-full">
                        <span className="text-3xl"></span>
                      </div>
                    )}
                  </div>

                  {/* VS */}
                  <div className="text-2xl text-gray-400 font-bold mx-2">VS</div>

                  {/* Logo visitante */}
                  <div className="order-first sm:order-none">
                    {awayTeam.logo_url ? (
                      <img 
                        src={awayTeam.logo_url} 
                        alt={awayTeam.name}
                        className="w-16 h-16 sm:w-14 sm:h-14 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-100 rounded-full">
                        <span className="text-3xl"></span>
                      </div>
                    )}
                  </div>

                  {/* Equipo visitante */}
                  <div className="flex flex-col items-center sm:items-start flex-1 min-w-0">
                    <div className="text-lg font-bold truncate w-full text-left">{awayTeam.name}</div>
                    <div className="text-sm text-gray-500">{awayTeam.short_name}</div>
                    <div className="text-4xl font-bold mt-2">{match.away_score || 0}</div>
                  </div>
                </div>

                {/* MVP del partido */}
                {match.mvp && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl"></span>
                        <span className="text-sm font-medium text-gray-700 truncate">MVP:</span>
                      </div>
                      <div className="text-sm font-bold text-right truncate ml-2">
                        {match.mvp.first_name} {match.mvp.last_name}
                        {match.mvp.jersey_number && ` #${match.mvp.jersey_number}`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Botón ver detalles */}
                <div className="mt-4">
                  <button className="w-full py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group">
                    <span>Ver estadísticas completas</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {matches.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">No hay resultados recientes</h3>
          <p className="text-gray-500 max-w-md mx-auto">Los partidos aparecerán aquí una vez que se hayan jugado</p>
        </div>
      )}

      {matches.length > 0 && (
        <div className="text-center mt-10">
          <button 
            onClick={() => navigate('/calendario')}
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r"
          >
            <span>Ver todos los partidos</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default RecentMatches