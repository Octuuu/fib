import React, { useState, useEffect } from 'react'
import PlayerStatCard from './PlayerStatCard'
import { usePlayers } from '../../hooks/usePlayers'
import { 
  FaBasketballBall, 
  FaFire, 
  FaAssistiveListeningSystems, 
  FaBullseye, 
  FaChartBar,
  FaTrophy,
  FaMedal,
  FaArrowUp,
  FaUsers
} from 'react-icons/fa'

const TopPlayers = () => {
  const { players, loading, getTopPlayers, refetch } = usePlayers()
  const [topPlayers, setTopPlayers] = useState([])
  
  // Mínimo de partidos para aparecer como figura destacada
  const MINIMUM_GAMES = 3
  
  useEffect(() => {
    if (!loading && players.length > 0) {
      const playersWithGames = players.filter(p => p.games_played >= MINIMUM_GAMES)
      console.log('Jugadores disponibles para figuras destacadas:', {
        total: players.length,
        conPartidos: playersWithGames.length,
        minPartidosRequeridos: MINIMUM_GAMES,
        partidosPorJugador: playersWithGames.map(p => ({
          nombre: `${p.first_name} ${p.last_name}`,
          partidos: p.games_played,
          ppp: p.points_per_game
        }))
      })
      
      const tops = getTopPlayers()
      setTopPlayers(tops || [])
    }
  }, [loading, players, getTopPlayers])
  
  // Función para obtener los líderes reales considerando mínimo de partidos
  const getRealLeaders = () => {
    const playersWithEnoughGames = players.filter(p => p.games_played >= MINIMUM_GAMES)
    
    if (playersWithEnoughGames.length === 0) {
      return {
        pointsLeader: null,
        assistsLeader: null,
        reboundsLeader: null,
        threePointsLeader: null,
        pointsTop3: [],
        assistsTop3: [],
        reboundsTop3: [],
        threePointsTop3: []
      }
    }
    
    // Encontrar TOP 3 en puntos
    const pointsTop3 = [...playersWithEnoughGames]
      .sort((a, b) => {
        // Primero por puntos por partido, luego por total de puntos
        const ppgDiff = parseFloat(b.points_per_game) - parseFloat(a.points_per_game)
        if (ppgDiff !== 0) return ppgDiff
        return (b.points || 0) - (a.points || 0)
      })
      .slice(0, 3)
    
    // Encontrar TOP 3 en asistencias
    const assistsTop3 = [...playersWithEnoughGames]
      .sort((a, b) => {
        const apgDiff = parseFloat(b.assists_per_game) - parseFloat(a.assists_per_game)
        if (apgDiff !== 0) return apgDiff
        return (b.assists || 0) - (a.assists || 0)
      })
      .slice(0, 3)
    
    // Encontrar TOP 3 en rebotes
    const reboundsTop3 = [...playersWithEnoughGames]
      .sort((a, b) => {
        const rpgDiff = parseFloat(b.rebounds_per_game) - parseFloat(a.rebounds_per_game)
        if (rpgDiff !== 0) return rpgDiff
        return (b.rebounds || 0) - (a.rebounds || 0)
      })
      .slice(0, 3)
    
    // Encontrar TOP 3 en triples anotados
    const threePointsTop3 = [...playersWithEnoughGames]
      .sort((a, b) => {
        // Primero por triples anotados, luego por porcentaje
        const madeDiff = (b.three_points_made || 0) - (a.three_points_made || 0)
        if (madeDiff !== 0) return madeDiff
        
        const percentageDiff = parseFloat(b.three_point_percentage || 0) - parseFloat(a.three_point_percentage || 0)
        if (percentageDiff !== 0) return percentageDiff
        
        return parseFloat(b.three_point_percentage || 0) - parseFloat(a.three_point_percentage || 0)
      })
      .slice(0, 3)
    
    return {
      pointsLeader: pointsTop3[0] || null,
      assistsLeader: assistsTop3[0] || null,
      reboundsLeader: reboundsTop3[0] || null,
      threePointsLeader: threePointsTop3[0] || null,
      pointsTop3,
      assistsTop3,
      reboundsTop3,
      threePointsTop3
    }
  }
  
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Figuras Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse border border-gray-200">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Calcular estadísticas
  const playersWithGames = players.filter(p => p.games_played > 0)
  const playersWithMinGames = players.filter(p => p.games_played >= MINIMUM_GAMES)
  
  // Obtener líderes reales y top 3
  const realLeaders = getRealLeaders()
  
  // Configurar las categorías de líderes
  const leaderConfigs = [
    { 
      type: 'points', 
      title: 'Máximo anotador',
      icon: FaFire,
      description: 'Puntos por partido',
      leader: realLeaders.pointsLeader,
      top3: realLeaders.pointsTop3
    },
    { 
      type: 'assists', 
      title: 'Máximo asistente',
      icon: FaAssistiveListeningSystems,
      description: 'Asistencias por partido',
      leader: realLeaders.assistsLeader,
      top3: realLeaders.assistsTop3
    },
    { 
      type: 'rebounds', 
      title: 'Máximo reboteador',
      icon: FaBullseye,
      description: 'Rebotes por partido',
      leader: realLeaders.reboundsLeader,
      top3: realLeaders.reboundsTop3
    },
    { 
      type: 'threePoints', 
      title: 'Máximo triplista',
      icon: FaBasketballBall,
      description: 'Triples anotados',
      leader: realLeaders.threePointsLeader,
      top3: realLeaders.threePointsTop3
    }
  ]

  // Crear líderes basados en líderes reales
  const leaders = leaderConfigs.map((config, index) => {
    const player = config.leader
    const top3 = config.top3 || []
    
    if (player && player.games_played >= MINIMUM_GAMES) {
      let statValue, totalValue, percentage, displayValue
      
      switch(config.type) {
        case 'points':
          statValue = parseFloat(player.points_per_game) || 0
          totalValue = player.points || 0
          displayValue = statValue.toFixed(1)
          break
        case 'assists':
          statValue = parseFloat(player.assists_per_game) || 0
          totalValue = player.assists || 0
          displayValue = statValue.toFixed(1)
          break
        case 'rebounds':
          statValue = parseFloat(player.rebounds_per_game) || 0
          totalValue = player.rebounds || 0
          displayValue = statValue.toFixed(1)
          break
        case 'threePoints':
          statValue = player.three_points_made || 0
          totalValue = player.three_points_attempted || 0
          percentage = parseFloat(player.three_point_percentage) || 0
          displayValue = `${statValue}`
          break
        default:
          statValue = 0
          displayValue = '0'
      }
      
      return {
        player,
        type: config.type,
        title: config.title,
        icon: config.icon,
        description: config.description,
        value: statValue,
        displayValue: displayValue,
        totalValue: totalValue,
        percentage: percentage,
        rank: index + 1,
        gamesPlayed: player.games_played,
        hasMinimumGames: true,
        top3: top3.slice(0, 3)
      }
    } else {
      // Si no hay jugador con mínimo de partidos
      const playersWithGames = players.filter(p => p.games_played > 0 && p.games_played < MINIMUM_GAMES)
      
      // Top 3 entre jugadores con pocos partidos
      const bestWithFewGames = [...playersWithGames]
        .sort((a, b) => {
          switch(config.type) {
            case 'points':
              return parseFloat(b.points_per_game || 0) - parseFloat(a.points_per_game || 0)
            case 'assists':
              return parseFloat(b.assists_per_game || 0) - parseFloat(a.assists_per_game || 0)
            case 'rebounds':
              return parseFloat(b.rebounds_per_game || 0) - parseFloat(a.rebounds_per_game || 0)
            case 'threePoints':
              return (b.three_points_made || 0) - (a.three_points_made || 0)
            default:
              return 0
          }
        })
        .slice(0, 3)
      
      return {
        player: null,
        type: config.type,
        title: config.title,
        icon: config.icon,
        description: config.description,
        value: 0,
        displayValue: '0',
        rank: index + 1,
        gamesPlayed: 0,
        hasMinimumGames: false,
        top3: bestWithFewGames,
        noLeadersWithMinGames: playersWithMinGames.length === 0
      }
    }
  })

  // Si hay jugadores pero no suficientes con el mínimo de partidos
  const noLeadersWithMinimumGames = leaders.every(leader => !leader.hasMinimumGames)
  
  if (playersWithGames.length > 0 && noLeadersWithMinimumGames) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Figuras Destacadas</h2>
        
        {/* Panel informativo */}
        <div className="bg-white rounded-xl p-8 mb-8 border border-gray-300">
          <div className="flex items-center gap-3 mb-4">
            <FaChartBar className="text-gray-700" />
            <h3 className="text-xl font-bold text-gray-800">Analizando estadísticas</h3>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <FaTrophy className="text-gray-700" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Mínimo de partidos requeridos</h4>
                <p className="text-gray-700">
                  Se requieren al menos <span className="font-bold">{MINIMUM_GAMES} partidos</span> para aparecer como figura destacada.
                  Actualmente hay <span className="font-bold">{playersWithMinGames.length} jugadores</span> que cumplen este requisito.
                </p>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-semibold">{playersWithGames.length} jugadores</span> han jugado al menos 1 partido
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={refetch}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium border border-gray-800"
            >
              Actualizar estadísticas
            </button>
            <p className="mt-2 text-sm text-gray-500">
              Revisaremos automáticamente cuando los jugadores alcancen {MINIMUM_GAMES} partidos
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Figuras Destacadas</h2>
      </div>
      
      {/* Figuras destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {leaders.map((leader, index) => (
          leader.player && leader.hasMinimumGames ? (
            <PlayerStatCard
              key={`${leader.type}-${leader.player.id}`}
              player={leader.player}
              statType={leader.type}
              statValue={leader.value}
              displayValue={leader.displayValue}
              totalValue={leader.totalValue}
              percentage={leader.percentage}
              rank={leader.rank}
              title={leader.title}
              icon={leader.icon}
              description={leader.description}
              gamesPlayed={leader.gamesPlayed}
            />
          ) : (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 text-center flex flex-col items-center justify-center min-h-[300px] border border-gray-300"
            >
              <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-4 border border-gray-700">
                <leader.icon className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{leader.title}</h3>
              <p className="text-gray-600 font-medium mb-4">Esperando candidato...</p>
              <p className="text-sm text-gray-500 mb-4">
                {leader.description}
              </p>
              <div className="mt-2">
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-2 border border-gray-300">
                  Mínimo {MINIMUM_GAMES} partidos requeridos
                </div>
                <div className="text-xs text-gray-600">
                  {playersWithMinGames.length} de {playersWithGames.length} jugadores elegibles
                </div>
              </div>
            </div>
          )
        ))}
      </div>
      
      {/* Top 3 en cada categoría */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-gray-900 text-xl" />
          <h2 className="text-2xl font-bold text-gray-900">Top 3 por categoría</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaders.map((leader, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl overflow-hidden border border-gray-300">
              {/* Encabezado de la categoría */}
              <div className="bg-gray-900 p-4">
                <div className="flex items-center gap-3">
                  <leader.icon className="text-white text-xl" />
                  <h3 className="text-white font-bold text-lg">{leader.title}</h3>
                </div>
                <p className="text-gray-300 text-sm mt-1">{leader.description}</p>
              </div>
              
              {/* Lista de jugadores del top 3 */}
              <div className="p-4">
                {leader.top3 && leader.top3.length > 0 ? (
                  <div className="space-y-3">
                    {leader.top3.map((player, playerIndex) => {
                      // Calcular estadística específica para cada jugador
                      let statValue = '0'
                      let statDescription = leader.description
                      
                      switch(leader.type) {
                        case 'points':
                          statValue = parseFloat(player.points_per_game || 0).toFixed(1)
                          statDescription = 'PPP'
                          break
                        case 'assists':
                          statValue = parseFloat(player.assists_per_game || 0).toFixed(1)
                          statDescription = 'APP'
                          break
                        case 'rebounds':
                          statValue = parseFloat(player.rebounds_per_game || 0).toFixed(1)
                          statDescription = 'RPP'
                          break
                        case 'threePoints':
                          statValue = player.three_points_made || '0'
                          const percentage = parseFloat(player.three_point_percentage || 0).toFixed(1)
                          statDescription = `${percentage}%`
                          break
                      }
                      
                      return (
                        <div 
                          key={player.id} 
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            playerIndex === 0 
                              ? 'border-gray-300 bg-gray-50' 
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              playerIndex === 0 
                                ? 'bg-gray-900' 
                                : playerIndex === 1
                                ? 'bg-gray-700'
                                : 'bg-gray-600'
                            }`}>
                              {playerIndex + 1}
                            </div>
                            <div className="flex items-center gap-2">
                              {player.avatar_url ? (
                                <img 
                                  src={player.avatar_url} 
                                  alt={`${player.first_name} ${player.last_name}`}
                                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                                  <FaBasketballBall className="text-gray-500 text-xs" />
                                </div>
                              )}
                              <div>
                                <div className={`font-bold ${
                                  playerIndex === 0 ? 'text-gray-900' : 'text-gray-800'
                                }`}>
                                  {player.first_name} {player.last_name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {player.team?.name || 'Sin equipo'}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={`font-bold text-lg ${
                              playerIndex === 0 ? 'text-gray-900' : 'text-gray-800'
                            }`}>
                              {statValue}
                            </div>
                            <div className="text-xs text-gray-600">
                              {statDescription}
                            </div>
                            {player.games_played < MINIMUM_GAMES && leader.noLeadersWithMinGames && (
                              <div className="text-xs text-gray-500 mt-1">
                                {player.games_played} partido{player.games_played !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-2">No hay jugadores</div>
                    <div className="text-sm text-gray-500">
                      {playersWithMinGames.length === 0 
                        ? 'Ningún jugador tiene el mínimo de partidos' 
                        : 'Cargando datos...'}
                    </div>
                  </div>
                )}
                
                {/* Pie de información */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      {leader.top3 ? leader.top3.length : 0} jugadores
                    </div>
                    {leader.top3 && leader.top3.length > 0 && leader.top3[0] && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaArrowUp className="text-gray-700" />
                        <span>Mínimo {MINIMUM_GAMES} partidos</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopPlayers