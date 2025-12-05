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
  Clock,
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

  // Obtener jugadores por equipo (con datos de player_stats si existen, o todos los jugadores del equipo)
  const getPlayersByTeam = (teamId) => {
    // Primero, ver si hay estadísticas para este equipo
    const playersWithStats = playerStats.filter(stat => stat.team_id === teamId)
    
    if (playersWithStats.length > 0) {
      return playersWithStats
    }
    
    // Si no hay estadísticas, mostrar todos los jugadores del equipo
    return allPlayers
      .filter(player => player.team_id === teamId)
      .map(player => ({
        player: player,
        team_id: teamId,
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
      }))
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
  const renderPlayerRow = (stat, isMvp) => {
    const player = stat.player || stat
    const isStatsRow = stat.points !== undefined
    
    return (
      <tr key={stat.id || player.id} className={isMvp ? 'bg-yellow-50' : ''}>
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
              <div className="text-xs text-gray-500">{player.player_position || '-'}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {isStatsRow ? formatMinutes(stat.minutes_played || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          <span className={`font-bold ${isStatsRow ? 'text-blue-700' : 'text-gray-500'}`}>
            {isStatsRow ? (stat.points || 0) : '--'}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {isStatsRow ? (stat.rebounds || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {isStatsRow ? (stat.assists || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {isStatsRow ? (stat.steals || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {isStatsRow ? (stat.blocks || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {isStatsRow ? (stat.turnovers || 0) : '--'}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {isStatsRow ? (stat.fouls || 0) : '--'}
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
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 text-center py-16">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Partido no encontrado</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
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
  
  const homePlayers = getPlayersByTeam(match.home_team_id)
  const awayPlayers = getPlayersByTeam(match.away_team_id)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} />
          Volver atrás
        </button>

        {/* Información del partido */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
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
                    hour: '2-digit',
                    minute: '2-digit'
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
                  ? 'bg-green-100 text-green-800'
                  : match.status === 'scheduled'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {match.status === 'finished' ? 'FINALIZADO' : 'PROGRAMADO'}
              </div>
            </div>
          </div>

          {/* Marcador */}
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg p-8 mb-6">
            <div className="flex items-center justify-center">
              {/* Equipo local */}
              <div className="flex-1 text-right">
                <div className="text-2xl font-bold">{homeTeam?.name || 'Local'}</div>
                {homeTeam?.logo_url ? (
                  <img 
                    src={homeTeam.logo_url} 
                    alt={homeTeam.name}
                    className="w-20 h-20 object-contain mx-auto my-4"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full mx-auto my-4">
                    <span className="text-3xl">🏀</span>
                  </div>
                )}
              </div>

              {/* Marcador */}
              <div className="mx-8">
                <div className="text-6xl font-bold">
                  {match.home_score || 0} - {match.away_score || 0}
                </div>
                <div className="text-center mt-2 text-gray-500">
                  {match.status === 'finished' ? 'FINAL' : 'POR JUGAR'}
                </div>
              </div>

              {/* Equipo visitante */}
              <div className="flex-1">
                <div className="text-2xl font-bold">{awayTeam?.name || 'Visitante'}</div>
                {awayTeam?.logo_url ? (
                  <img 
                    src={awayTeam.logo_url} 
                    alt={awayTeam.name}
                    className="w-20 h-20 object-contain mx-auto my-4"
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full mx-auto my-4">
                    <span className="text-3xl">🏀</span>
                  </div>
                )}
              </div>
            </div>

            {/* MVP */}
            {match.mvp_player && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-yellow-100 px-6 py-3 rounded-full">
                  <Trophy className="text-orange-500" size={20} />
                  <span className="font-semibold text-gray-800">
                    MVP: {match.mvp_player.first_name} {match.mvp_player.last_name}
                    {match.mvp_player.jersey_number && ` #${match.mvp_player.jersey_number}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Alerta si no hay estadísticas */}
          {match.status === 'finished' && !hasStatsData && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Estadísticas detalladas no disponibles
                  </h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>
                      Solo se muestran los resultados del marcador. Para ver estadísticas completas 
                      de jugadores, se deben registrar las estadísticas individuales.
                    </p>
                    <p className="mt-1 font-medium">
                      Nota: Los jugadores mostrados son todos los jugadores del equipo, no necesariamente los que jugaron este partido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-primary text-primary'
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
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('players')}
              >
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  Jugadores
                </div>
              </button>
            </nav>
          </div>

          {/* Contenido de tabs */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Resumen de estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="text-blue-600" size={24} />
                    <h3 className="text-lg font-semibold">Puntos</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                      {match.home_score || 0} - {match.away_score || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-2 font-medium">
                      {match.home_score > match.away_score 
                        ? homeTeam?.name || 'Local' 
                        : awayTeam?.name || 'Visitante'} gana
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="text-green-600" size={24} />
                    <h3 className="text-lg font-semibold">Rebotes</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                      {homeStats.rebounds} - {awayStats.rebounds}
                    </div>
                    {hasStatsData && (
                      <>
                        <div className="text-sm text-gray-600 mt-2">
                          Ofensivos: {homeStats.offensiveRebounds}-{awayStats.offensiveRebounds}
                        </div>
                        <div className="text-sm text-gray-600">
                          Defensivos: {homeStats.defensiveRebounds}-{awayStats.defensiveRebounds}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="text-purple-600" size={24} />
                    <h3 className="text-lg font-semibold">Asistencias</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">
                      {homeStats.assists} - {awayStats.assists}
                    </div>
                    {hasStatsData && playerStats.length > 0 && (
                      <div className="text-sm text-gray-600 mt-2">
                        Por jugador: {Math.round(homeStats.assists / homePlayers.length)} - {Math.round(awayStats.assists / awayPlayers.length)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="text-red-600" size={24} />
                    <h3 className="text-lg font-semibold">Defensa</h3>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="flex justify-between">
                      <span>Robos:</span>
                      <span className="font-bold">{homeStats.steals} - {awayStats.steals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tapones:</span>
                      <span className="font-bold">{homeStats.blocks} - {awayStats.blocks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Turnovers:</span>
                      <span className="font-bold">{homeStats.turnovers} - {awayStats.turnovers}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla comparativa completa */}
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estadística
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {homeTeam?.name || 'Local'}
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {awayTeam?.name || 'Visitante'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr className="bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          <div className="flex items-center gap-2">
                            <Trophy size={16} />
                            Puntos
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-700">
                          {match.home_score || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-700">
                          {match.away_score || 0}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rebotes Totales
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.rebounds : '--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.rebounds : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Asistencias
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.assists : '--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.assists : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Robos
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.steals : '--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.steals : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Tapones
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.blocks : '--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.blocks : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Turnovers
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.turnovers : '--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.turnovers : '--'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Faltas
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? homeStats.fouls : '--'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                          {hasStatsData ? awayStats.fouls : '--'}
                        </td>
                      </tr>
                      {hasStatsData && (
                        <>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Minutos Jugados
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              {formatMinutes(homeStats.minutesPlayed)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              {formatMinutes(awayStats.minutesPlayed)}
                            </td>
                          </tr>
                          <tr className="bg-green-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              % Tiros de Campo
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(homeStats.fieldGoalsMade, homeStats.fieldGoalsAttempted)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(awayStats.fieldGoalsMade, awayStats.fieldGoalsAttempted)}
                            </td>
                          </tr>
                          <tr className="bg-green-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              % Triples
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(homeStats.threePointsMade, homeStats.threePointsAttempted)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(awayStats.threePointsMade, awayStats.threePointsAttempted)}
                            </td>
                          </tr>
                          <tr className="bg-green-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              % Tiros Libres
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">
                              {calculatePercentage(homeStats.freeThrowsMade, homeStats.freeThrowsAttempted)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">
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
              {/* Jugadores equipo local */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users size={20} />
                  {homeTeam?.name || 'Equipo Local'}
                  {!hasStatsData && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Todos los jugadores del equipo)
                    </span>
                  )}
                </h3>
                <div className="bg-white border rounded-lg overflow-hidden">
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
                        {homePlayers.map((stat) => {
                          const isMvp = match.mvp_player && 
                            (stat.player_id === match.mvp_player_id || 
                             stat.player?.id === match.mvp_player_id)
                          return renderPlayerRow(stat, isMvp)
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Jugadores equipo visitante */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users size={20} />
                  {awayTeam?.name || 'Equipo Visitante'}
                  {!hasStatsData && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Todos los jugadores del equipo)
                    </span>
                  )}
                </h3>
                <div className="bg-white border rounded-lg overflow-hidden">
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
                        {awayPlayers.map((stat) => {
                          const isMvp = match.mvp_player && 
                            (stat.player_id === match.mvp_player_id || 
                             stat.player?.id === match.mvp_player_id)
                          return renderPlayerRow(stat, isMvp)
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notas del partido */}
        {match.notes && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Notas del Partido</h3>
            <p className="text-gray-700 whitespace-pre-line">{match.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchDetails