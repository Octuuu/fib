import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export const usePlayers = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPlayersWithStats = async () => {
    try {
      setLoading(true)
      
      // 1. Obtener todos los jugadores activos con información de equipo
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select(`
          *,
          team:teams(name, logo_url, short_name)
        `)
        .eq('is_active', true)
        .order('first_name')

      if (playersError) throw playersError

      if (!playersData || playersData.length === 0) {
        setPlayers([])
        setLoading(false)
        return
      }

      const playerIds = playersData.map(p => p.id)
      
      // 2. Obtener estadísticas de todos los jugadores
      const { data: statsData, error: statsError } = await supabase
        .from('player_stats')
        .select(`
          player_id,
          match_id,
          points,
          rebounds,
          assists,
          steals,
          blocks,
          three_points_made,
          three_points_attempted,
          minutes_played
        `)
        .in('player_id', playerIds)

      if (statsError) throw statsError
      
      // 3. Procesar estadísticas por jugador
      const statsMap = {}
      
      if (statsData && statsData.length > 0) {
        statsData.forEach(stat => {
          const playerId = stat.player_id
          
          if (!statsMap[playerId]) {
            statsMap[playerId] = {
              points: 0,
              rebounds: 0,
              assists: 0,
              steals: 0,
              blocks: 0,
              three_points_made: 0,
              three_points_attempted: 0,
              minutes_played: 0,
              games_played: new Set()
            }
          }
          
          // Sumar estadísticas
          statsMap[playerId].points += stat.points || 0
          statsMap[playerId].rebounds += stat.rebounds || 0
          statsMap[playerId].assists += stat.assists || 0
          statsMap[playerId].steals += stat.steals || 0
          statsMap[playerId].blocks += stat.blocks || 0
          statsMap[playerId].three_points_made += stat.three_points_made || 0
          statsMap[playerId].three_points_attempted += stat.three_points_attempted || 0
          statsMap[playerId].minutes_played += stat.minutes_played || 0
          
          // Contar partidos únicos
          if (stat.match_id) {
            statsMap[playerId].games_played.add(stat.match_id)
          }
        })
      }

      // 4. Combinar jugadores con estadísticas
      const playersWithStats = playersData.map(player => {
        const playerStats = statsMap[player.id] || {
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          three_points_made: 0,
          three_points_attempted: 0,
          minutes_played: 0,
          games_played: new Set()
        }
        
        const gamesPlayed = playerStats.games_played.size
        const points = playerStats.points
        const rebounds = playerStats.rebounds
        const assists = playerStats.assists
        const steals = playerStats.steals
        const blocks = playerStats.blocks
        
        return {
          ...player,
          points,
          rebounds,
          assists,
          steals,
          blocks,
          three_points_made: playerStats.three_points_made,
          three_points_attempted: playerStats.three_points_attempted,
          minutes_played: playerStats.minutes_played,
          games_played: gamesPlayed,
          points_per_game: gamesPlayed > 0 ? (points / gamesPlayed).toFixed(1) : '0.0',
          rebounds_per_game: gamesPlayed > 0 ? (rebounds / gamesPlayed).toFixed(1) : '0.0',
          assists_per_game: gamesPlayed > 0 ? (assists / gamesPlayed).toFixed(1) : '0.0',
          steals_per_game: gamesPlayed > 0 ? (steals / gamesPlayed).toFixed(1) : '0.0',
          blocks_per_game: gamesPlayed > 0 ? (blocks / gamesPlayed).toFixed(1) : '0.0',
          three_point_percentage: playerStats.three_points_attempted > 0 
            ? ((playerStats.three_points_made / playerStats.three_points_attempted) * 100).toFixed(1)
            : '0.0',
          minutes_per_game: gamesPlayed > 0 ? (playerStats.minutes_played / gamesPlayed).toFixed(1) : '0.0'
        }
      })

      console.log('Players with real stats loaded:', playersWithStats)
      setPlayers(playersWithStats)

    } catch (err) {
      setError(err.message)
      console.error('Error fetching players with stats:', err)
    } finally {
      setLoading(false)
    }
  }

  // Obtener jugadores por equipo
  const getPlayersByTeam = (teamId) => {
    return players.filter(player => player.team_id === teamId)
  }

  // Obtener mejores jugadores por categoría
  const getTopPlayers = () => {
    const playersWithGames = players.filter(p => p.games_played > 0)
    
    if (playersWithGames.length === 0) return []
    
    const topScorer = [...playersWithGames]
      .sort((a, b) => parseFloat(b.points_per_game) - parseFloat(a.points_per_game))
      .slice(0, 1)[0]
    
    const topAssister = [...playersWithGames]
      .sort((a, b) => parseFloat(b.assists_per_game) - parseFloat(a.assists_per_game))
      .slice(0, 1)[0]
    
    const topRebounder = [...playersWithGames]
      .sort((a, b) => parseFloat(b.rebounds_per_game) - parseFloat(a.rebounds_per_game))
      .slice(0, 1)[0]
    
    const topShooter = [...playersWithGames]
      .sort((a, b) => parseInt(b.three_points_made) - parseInt(a.three_points_made))
      .slice(0, 1)[0]
    
    return [topScorer, topAssister, topRebounder, topShooter].filter(p => p !== undefined)
  }

  // Buscar jugador por nombre
  const searchPlayers = (searchTerm) => {
    if (!searchTerm) return players
    
    const term = searchTerm.toLowerCase()
    return players.filter(player => 
      player.first_name.toLowerCase().includes(term) ||
      player.last_name.toLowerCase().includes(term) ||
      player.team?.name.toLowerCase().includes(term)
    )
  }

  useEffect(() => {
    fetchPlayersWithStats()
  }, [])

  return { 
    players, 
    loading, 
    error, 
    getPlayersByTeam,
    getTopPlayers,
    searchPlayers,
    refetch: fetchPlayersWithStats 
  }
}