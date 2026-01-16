import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  ArrowLeft,
  BarChart,
  Target,
  Shield,
  Zap,
  Award,
  AlertCircle
} from 'lucide-react'

const MatchDetails = () => {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const [match, setMatch] = useState(null)
  const [playerStats, setPlayerStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stats')
  const [hasStatsData, setHasStatsData] = useState(false)
  const [allPlayers, setAllPlayers] = useState([])

  useEffect(() => {
    fetchMatchDetails()
    fetchAllPlayers()
  }, [matchId])

  const fetchAllPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('is_active', true)
      
      if (!error) {
        setAllPlayers(data || [])
      }
    } catch (err) {
      console.error('Error fetching players:', err)
    }
  }

  const fetchMatchDetails = async () => {
    try {
      setLoading(true)

      // PRIMERO: Verificar si el partido existe - usar matches_complete para obtener toda la info
      const { data: matchData, error: matchError } = await supabase
        .from('matches_complete')
        .select('*')
        .eq('id', matchId)
        .single()

      if (matchError) {
        // Si no funciona con matches_complete, intentar con matches
        const { data: basicMatchData, error: basicError } = await supabase
          .from('matches')
          .select('*')
          .eq('id', matchId)
          .single()
        
        if (basicError) throw basicError
        
        // Obtener información de equipos por separado
        const homeTeamId = basicMatchData.home_team_id
        const awayTeamId = basicMatchData.away_team_id
        const mvpPlayerId = basicMatchData.mvp_player_id
        const tournamentId = basicMatchData.tournament_id
        
        // Obtener datos de equipos
        const { data: homeTeamData } = await supabase
          .from('teams')
          .select('*')
          .eq('id', homeTeamId)
          .single()
        
        const { data: awayTeamData } = await supabase
          .from('teams')
          .select('*')
          .eq('id', awayTeamId)
          .single()
        
        // Obtener datos del MVP
        let mvpData = null
        if (mvpPlayerId) {
          const { data: mvpPlayerData } = await supabase
            .from('players')
            .select('*')
            .eq('id', mvpPlayerId)
            .single()
          mvpData = mvpPlayerData
        }
        
        // Obtener datos del torneo
        const { data: tournamentData } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single()
        
        // Construir objeto match completo
        const completeMatchData = {
          ...basicMatchData,
          home_team: homeTeamData,
          away_team: awayTeamData,
          mvp_player: mvpData,
          tournament: tournamentData
        }
        
        setMatch(completeMatchData)
      } else {
        // Transformar datos de matches_complete al formato esperado
        const transformedMatchData = {
          ...matchData,
          home_team: {
            id: matchData.home_team_id,
            name: matchData.home_team_name,
            logo_url: matchData.home_team_logo,
            colors: matchData.home_team_colors,
            city: null // No disponible en matches_complete
          },
          away_team: {
            id: matchData.away_team_id,
            name: matchData.away_team_name,
            logo_url: matchData.away_team_logo,
            colors: matchData.away_team_colors,
            city: null // No disponible en matches_complete
          },
          mvp_player: matchData.mvp_player_id ? {
            id: matchData.mvp_player_id,
            first_name: matchData.mvp_first_name,
            last_name: matchData.mvp_last_name,
            jersey_number: matchData.mvp_jersey
          } : null,
          tournament: {
            id: matchData.tournament_id,
            name: matchData.tournament_name
          }
        }
        setMatch(transformedMatchData)
      }

      // SEGUNDO: Obtener estadísticas de jugadores
      const { data: statsData, error: statsError } = await supabase
        .from('player_stats')
        .select(`
          *,
          player:player_id(*),
          team:team_id(*)
        `)
        .eq('match_id', matchId)

      if (statsError) {
        console.warn('Error al obtener estadísticas:', statsError)
        setPlayerStats([])
        setHasStatsData(false)
      } else {
        console.log('Estadísticas obtenidas:', statsData?.length || 0, 'registros')
        setPlayerStats(statsData || [])
        setHasStatsData((statsData?.length || 0) > 0)
      }

    } catch (error) {
      console.error('Error fetching match details:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obtener TODOS los jugadores por equipo, incluyendo estadísticas si existen
  const getAllPlayersByTeam = (teamId) => {
    // Obtener todos los jugadores activos de este equipo
    const teamPlayers = allPlayers.filter(player => player.team_id === teamId)
    
    // Para cada jugador, buscar si tiene estadísticas en este partido
    return teamPlayers.map(player => {
      // Buscar estadísticas existentes para este jugador
      const existingStats = playerStats.find(stat => 
        stat.player_id === player.id && stat.team_id === teamId
      )
      
      if (existingStats) {
        // Si hay estadísticas existentes, usarlas
        return {
          ...existingStats,
          player: player,
          hasStats: true
        }
      }
      
      // Si no hay estadísticas, crear objeto con ceros
      return {
        id: `placeholder-${player.id}`,
        player_id: player.id,
        match_id: matchId,
        team_id: teamId,
        player: player,
        hasStats: false,
        minutes_played: 0,
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
        field_goals_made: 0,
        field_goals_attempted: 0,
        three_points_made: 0,
        three_points_attempted: 0,
        free_throws_made: 0,
        free_throws_attempted: 0,
        offensive_rebounds: 0,
        defensive_rebounds: 0
      }
    })
  }

  // Calcular estadísticas por equipo
  const getTeamStats = (teamId) => {
    const teamStats = playerStats.filter(stat => stat.team_id === teamId)
    
    if (teamStats.length === 0) {
      // Si no hay estadísticas, usar datos del marcador para puntos
      if (match) {
        const isHomeTeam = teamId === match.home_team_id
        return {
          points: isHomeTeam ? (match.home_score || 0) : (match.away_score || 0),
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          turnovers: 0,
          fieldGoalsMade: 0,
          fieldGoalsAttempted: 0,
          threePointsMade: 0,
          threePointsAttempted: 0,
          freeThrowsMade: 0,
          freeThrowsAttempted: 0,
          offensiveRebounds: 0,
          defensiveRebounds: 0,
          fouls: 0,
          minutesPlayed: 0
        }
      }
      
      return {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        threePointsMade: 0,
        threePointsAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        offensiveRebounds: 0,
        defensiveRebounds: 0,
        fouls: 0,
        minutesPlayed: 0
      }
    }
    
    return teamStats.reduce((totals, stat) => ({
      points: totals.points + (stat.points || 0),
      rebounds: totals.rebounds + (stat.rebounds || 0),
      assists: totals.assists + (stat.assists || 0),
      steals: totals.steals + (stat.steals || 0),
      blocks: totals.blocks + (stat.blocks || 0),
      turnovers: totals.turnovers + (stat.turnovers || 0),
      fieldGoalsMade: totals.fieldGoalsMade + (stat.field_goals_made || 0),
      fieldGoalsAttempted: totals.fieldGoalsAttempted + (stat.field_goals_attempted || 0),
      threePointsMade: totals.threePointsMade + (stat.three_points_made || 0),
      threePointsAttempted: totals.threePointsAttempted + (stat.three_points_attempted || 0),
      freeThrowsMade: totals.freeThrowsMade + (stat.free_throws_made || 0),
      freeThrowsAttempted: totals.freeThrowsAttempted + (stat.free_throws_attempted || 0),
      offensiveRebounds: totals.offensiveRebounds + (stat.offensive_rebounds || 0),
      defensiveRebounds: totals.defensiveRebounds + (stat.defensive_rebounds || 0),
      fouls: totals.fouls + (stat.fouls || 0),
      minutesPlayed: totals.minutesPlayed + (stat.minutes_played || 0)
    }), {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fieldGoalsMade: 0,
      fieldGoalsAttempted: 0,
      threePointsMade: 0,
      threePointsAttempted: 0,
      freeThrowsMade: 0,
      freeThrowsAttempted: 0,
      offensiveRebounds: 0,
      defensiveRebounds: 0,
      fouls: 0,
      minutesPlayed: 0
    })
  }

  // Calcular porcentajes
  const calculatePercentage = (made, attempted) => {
    if (attempted === 0) return '0%'
    return `${Math.round((made / attempted) * 100)}%`
  }

  // Formatear minutos jugados
  const formatMinutes = (minutes) => {
    if (!minutes || minutes === 0) return '--'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `${mins}:00`
  }

  // Renderizar fila de jugador
  const renderPlayerRow = (stat) => {
    const player = stat.player
    const isMvp = match?.mvp_player?.id === player.id
    const hasStats = stat.hasStats
    
    return (
      <tr key={stat.id} className={isMvp ? 'bg-yellow-50' : ''}>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900">
              <div className="flex items-center gap-2">
                {player.first_name} {player.last_name}
                {player.jersey_number && (
                  <span className="ml-2 text-gray-500">#{player.jersey_number}</span>
                )}
                {isMvp && (
                  <Award size={16} className="text-yellow-500" />
                )}
              </div>
              <div className="text-xs text-gray-500">{player.position || '-'}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {hasStats ? formatMinutes(stat.minutes_played || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          <span className={`font-bold ${hasStats ? 'text-blue-700' : 'text-gray-500'}`}>
            {hasStats ? (stat.points || 0) : '--'}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {hasStats ? (stat.rebounds || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {hasStats ? (stat.assists || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {hasStats ? (stat.steals || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {hasStats ? (stat.blocks || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {hasStats ? (stat.turnovers || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {hasStats ? (stat.fouls || 0) : '--'}
        </td>
      </tr>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-6xl mx-auto px-4 text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Partido no encontrado</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            Volver atrás
          </button>
        </div>
      </div>
    )
  }

  const homeStats = getTeamStats(match.home_team_id)
  const awayStats = getTeamStats(match.away_team_id)
  const homeTeam = match.home_team
  const awayTeam = match.away_team
  const matchDate = new Date(match.match_date)
  
  // Obtener TODOS los jugadores de cada equipo
  const homePlayers = getAllPlayersByTeam(match.home_team_id)
  const awayPlayers = getAllPlayersByTeam(match.away_team_id)

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} />
          Volver atrás
        </button>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {homeTeam?.name || 'Equipo Local'} vs {awayTeam?.name || 'Equipo Visitante'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{matchDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}</span>
                </div>
                {match.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{match.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                match.status === 'finished' 
                  ? 'bg-gray-100 text-gray-800'
                  : match.status === 'scheduled'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {match.status === 'finished' ? 'FINALIZADO' : 'PROGRAMADO'}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between gap-3 sm:gap-4 md:gap-6">
              
              <div className="flex flex-col items-center flex-1 text-center">
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate w-full">
                  {homeTeam?.short_name || homeTeam?.name || 'Local'}
                </div>
                {homeTeam?.logo_url ? (
                  <img 
                    src={homeTeam.logo_url} 
                    alt={homeTeam.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain my-3"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center bg-gray-100 rounded-full my-3">
                    <span className="text-2xl sm:text-3xl">🏀</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center mx-2 sm:mx-4">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  {match.home_score || 0} - {match.away_score || 0}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-500 mt-1">
                  {match.status === 'finished' ? 'FINAL' : 'POR JUGAR'}
                </div>
              </div>

              <div className="flex flex-col items-center flex-1 text-center">
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold truncate w-full">
                  {awayTeam?.short_name || awayTeam?.name || 'Visitante'}
                </div>
                {awayTeam?.logo_url ? (
                  <img 
                    src={awayTeam.logo_url} 
                    alt={awayTeam.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain my-3"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center bg-gray-100 rounded-full my-3">
                    <span className="text-2xl sm:text-3xl">🏀</span>
                  </div>
                )}
              </div>
            </div>

            {match.mvp_player && (
              <div className="mt-4 sm:mt-6 text-center">
                <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 rounded-full w-full max-w-md mx-auto">
                  <div className="flex items-center gap-1">
                    <Trophy className="text-gray-600" size={14} sm:size={16} />
                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">MVP:</span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                    {match.mvp_player.first_name} {match.mvp_player.last_name}
                    {match.mvp_player.jersey_number && ` #${match.mvp_player.jersey_number}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {match.status === 'finished' && !hasStatsData && (
            <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    Estadísticas detalladas no disponibles
                  </h3>
                  <div className="mt-1 text-sm text-gray-700">
                    <p>
                      Solo se muestran los resultados del marcador. Para ver estadísticas completas 
                      de jugadores, se deben registrar las estadísticas individuales.
                    </p>
                    <p className="mt-1 font-medium">
                      Nota: Se muestran todos los jugadores del equipo (activos). Si un jugador no aparece en la tabla, significa que no tiene estadísticas registradas para este partido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-gray-800 text-gray-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('stats')}
              >
                <div className="flex items-center gap-2">
                  <BarChart size={18} />
                  Estadísticas
                </div>
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'players'
                    ? 'border-gray-800 text-gray-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('players')}
              >
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  Jugadores ({homePlayers.length + awayPlayers.length})
                </div>
              </button>
            </nav>
          </div>

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="text-gray-600" size={20} />
                    <h3 className="font-semibold">Puntos</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {match.home_score || 0} - {match.away_score || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 font-medium">
                      {match.home_score > match.away_score 
                        ? homeTeam?.name || 'Local' 
                        : awayTeam?.name || 'Visitante'} gana
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="text-gray-600" size={20} />
                    <h3 className="font-semibold">Rebotes</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {homeStats.rebounds} - {awayStats.rebounds}
                    </div>
                    {hasStatsData && (
                      <div className="text-xs text-gray-600 mt-1 space-y-1">
                        <div>Ofensivos: {homeStats.offensiveRebounds}-{awayStats.offensiveRebounds}</div>
                        <div>Defensivos: {homeStats.defensiveRebounds}-{awayStats.defensiveRebounds}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="text-gray-600" size={20} />
                    <h3 className="font-semibold">Asistencias</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {homeStats.assists} - {awayStats.assists}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="text-gray-600" size={20} />
                    <h3 className="font-semibold">Defensa</h3>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Robos:</span>
                      <span className="font-bold">{homeStats.steals} - {awayStats.steals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tapones:</span>
                      <span className="font-bold">{homeStats.blocks} - {awayStats.blocks}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Turnovers:</span>
                      <span className="font-bold">{homeStats.turnovers} - {awayStats.turnovers}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estadística
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {homeTeam?.name || 'Local'}
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {awayTeam?.name || 'Visitante'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          <div className="flex items-center gap-2">
                            <Trophy size={16} />
                            Puntos
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-800">
                          {match.home_score || 0}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-800">
                          {match.away_score || 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rebotes Totales
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.rebounds : '--'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.rebounds : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Asistencias
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.assists : '--'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.assists : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Robos
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.steals : '--'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.steals : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Tapones
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.blocks : '--'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.blocks : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Turnovers
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.turnovers : '--'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.turnovers : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Faltas
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.fouls : '--'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.fouls : '--'}
                        </td>
                      </tr>
                      {hasStatsData && (
                        <>
                          <tr>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Minutos Jugados
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                              {formatMinutes(homeStats.minutesPlayed)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                              {formatMinutes(awayStats.minutesPlayed)}
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              % Tiros de Campo
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(homeStats.fieldGoalsMade, homeStats.fieldGoalsAttempted)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(awayStats.fieldGoalsMade, awayStats.fieldGoalsAttempted)}
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              % Triples
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(homeStats.threePointsMade, homeStats.threePointsAttempted)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(awayStats.threePointsMade, awayStats.threePointsAttempted)}
                            </td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              % Tiros Libres
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(homeStats.freeThrowsMade, homeStats.freeThrowsAttempted)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(awayStats.freeThrowsMade, awayStats.freeThrowsAttempted)}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users size={20} />
                  {homeTeam?.name || 'Equipo Local'} ({homePlayers.length} jugadores)
                  {!hasStatsData && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Todos los jugadores del equipo)
                    </span>
                  )}
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jugador
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            MIN
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PTS
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            REB
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            AST
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ROB
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TAP
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PER
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            FAL
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {homePlayers.map((stat) => renderPlayerRow(stat))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users size={20} />
                  {awayTeam?.name || 'Equipo Visitante'} ({awayPlayers.length} jugadores)
                  {!hasStatsData && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Todos los jugadores del equipo)
                    </span>
                  )}
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jugador
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            MIN
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PTS
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            REB
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            AST
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ROB
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TAP
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PER
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            FAL
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {awayPlayers.map((stat) => renderPlayerRow(stat))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {match.notes && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Notas del Partido</h3>
            <p className="text-gray-700 whitespace-pre-line">{match.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchDetails