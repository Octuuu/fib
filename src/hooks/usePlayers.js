import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

export const usePlayers = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPlayersWithStats = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const cacheKey = 'players_fast'
      const CACHE_TTL = 15 * 60 * 1000
      
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_TTL) {
            setPlayers(data || [])
            setLoading(false)
            return
          }
        }
      }

      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id, team_id, first_name, last_name, player_position, jersey_number, height_cm, weight_kg, birth_date, photo_url, biography, is_active')
        .eq('is_active', true)
        .order('first_name')
        .limit(80)

      if (playersError) throw playersError
      
      if (!playersData?.length) {
        setPlayers([])
        setLoading(false)
        return
      }

      const teamIds = [...new Set(playersData.map(p => p.team_id).filter(Boolean))]
      const { data: teamsData } = await supabase
        .from('teams')
        .select('id, name, short_name, city, logo_url')
        .in('id', teamIds)

      const teamsMap = new Map()
      teamsData?.forEach(team => teamsMap.set(team.id, team))

      const playerIds = playersData.map(p => p.id)
      const { data: statsData } = await supabase
        .from('player_stats')
        .select('player_id, points, rebounds, assists, three_points_made, three_points_attempted, match_id')
        .in('player_id', playerIds)
        .limit(1000)

      const statsMap = new Map()
      const gamesMap = new Map()
      
      if (statsData?.length) {
        statsData.forEach(stat => {
          const playerId = stat.player_id
          
          if (!statsMap.has(playerId)) {
            statsMap.set(playerId, {
              points: 0,
              rebounds: 0,
              assists: 0,
              three_made: 0,
              three_attempted: 0,
              matchIds: new Set()
            })
          }
          
          const stats = statsMap.get(playerId)
          stats.points += Number(stat.points) || 0
          stats.rebounds += Number(stat.rebounds) || 0
          stats.assists += Number(stat.assists) || 0
          stats.three_made += Number(stat.three_points_made) || 0
          stats.three_attempted += Number(stat.three_points_attempted) || 0
          
          if (stat.match_id) stats.matchIds.add(stat.match_id)
        })
        
        statsMap.forEach((stats, playerId) => {
          gamesMap.set(playerId, stats.matchIds.size)
        })
      }

      const processedPlayers = playersData.map(player => {
        const playerStats = statsMap.get(player.id) || {
          points: 0, rebounds: 0, assists: 0, three_made: 0, three_attempted: 0
        }
        
        const gamesPlayed = gamesMap.get(player.id) || 0
        const team = teamsMap.get(player.team_id)
        
        return {
          id: player.id,
          team_id: player.team_id,
          first_name: player.first_name || '',
          last_name: player.last_name || '',
          position: player.player_position || 'N/A',
          jersey_number: player.jersey_number,
          height: player.height_cm,
          weight: player.weight_kg,
          birth_date: player.birth_date,
          avatar_url: player.photo_url,
          biography: player.biography,
          is_active: player.is_active,
          team: team ? {
            id: team.id,
            name: team.name || 'Sin equipo',
            short_name: team.short_name || 'N/A',
            city: team.city || '',
            logo_url: team.logo_url
          } : {
            id: player.team_id,
            name: 'Sin equipo',
            short_name: 'N/A',
            city: '',
            logo_url: null
          },
          points: playerStats.points,
          rebounds: playerStats.rebounds,
          assists: playerStats.assists,
          three_points_made: playerStats.three_made,
          three_points_attempted: playerStats.three_attempted,
          games_played: gamesPlayed,
          points_per_game: gamesPlayed > 0 ? (playerStats.points / gamesPlayed).toFixed(1) : '0.0',
          rebounds_per_game: gamesPlayed > 0 ? (playerStats.rebounds / gamesPlayed).toFixed(1) : '0.0',
          assists_per_game: gamesPlayed > 0 ? (playerStats.assists / gamesPlayed).toFixed(1) : '0.0',
          three_point_percentage: playerStats.three_attempted > 0 
            ? ((playerStats.three_made / playerStats.three_attempted) * 100).toFixed(1)
            : '0.0'
        }
      })

      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: processedPlayers,
          timestamp: Date.now()
        }))
      } catch {}
      
      setPlayers(processedPlayers)
      
    } catch (err) {
      setError(err.message || 'Error al cargar jugadores')
      
      try {
        const cached = localStorage.getItem('players_fast')
        if (cached) {
          const { data } = JSON.parse(cached)
          if (data?.length) setPlayers(data)
        }
      } catch {}
    } finally {
      setLoading(false)
    }
  }, [])

  const getTopPlayers = useCallback(() => {
    if (!players.length) return []
    
    const eligible = players.filter(p => p.games_played >= 1)
    if (eligible.length <= 4) return eligible.slice(0, 4)
    
    const selected = []
    const usedIds = new Set()
    
    const findBest = (statKey, isString = false) => {
      return eligible
        .filter(p => !usedIds.has(p.id))
        .reduce((best, current) => {
          const bestVal = isString ? parseFloat(best[statKey]) || 0 : best[statKey] || 0
          const currVal = isString ? parseFloat(current[statKey]) || 0 : current[statKey] || 0
          return currVal > bestVal ? current : best
        }, { [statKey]: -Infinity })
    }
    
    const bestScorer = findBest('points_per_game', true)
    if (bestScorer.id && parseFloat(bestScorer.points_per_game) > 0) {
      selected.push(bestScorer)
      usedIds.add(bestScorer.id)
    }
    
    const bestAssister = findBest('assists_per_game', true)
    if (bestAssister.id && parseFloat(bestAssister.assists_per_game) > 0) {
      selected.push(bestAssister)
      usedIds.add(bestAssister.id)
    }
    
    const bestRebounder = findBest('rebounds_per_game', true)
    if (bestRebounder.id && parseFloat(bestRebounder.rebounds_per_game) > 0) {
      selected.push(bestRebounder)
      usedIds.add(bestRebounder.id)
    }
    
    const bestThreePointer = findBest('three_points_made', false)
    if (bestThreePointer.id && bestThreePointer.three_points_made > 0) {
      selected.push(bestThreePointer)
      usedIds.add(bestThreePointer.id)
    }
    
    if (selected.length < 4) {
      const remaining = eligible
        .filter(p => !usedIds.has(p.id))
        .sort((a, b) => parseFloat(b.points_per_game) - parseFloat(a.points_per_game))
        .slice(0, 4 - selected.length)
      
      selected.push(...remaining)
    }
    
    return selected.slice(0, 4)
  }, [players])

  const getPlayersByTeam = useCallback((teamId) => {
    if (!teamId) return []
    return players.filter(player => player.team_id === teamId)
  }, [players])

  const searchPlayers = useCallback((searchTerm) => {
    if (!searchTerm?.trim() || searchTerm.trim().length < 2) return players
    
    const term = searchTerm.toLowerCase().trim()
    const results = []
    
    for (const player of players) {
      if (results.length >= 50) break
      
      if (
        player.first_name.toLowerCase().includes(term) ||
        player.last_name.toLowerCase().includes(term) ||
        `${player.first_name} ${player.last_name}`.toLowerCase().includes(term) ||
        player.jersey_number?.toString().includes(term) ||
        player.team?.name?.toLowerCase().includes(term)
      ) {
        results.push(player)
      }
    }
    
    return results
  }, [players])

  const loadPlayerStats = useCallback(async (playerId) => {
    if (!playerId) return []
    
    try {
      const { data, error } = await supabase
        .from('player_stats')
        .select(`
          match_id,
          points,
          rebounds,
          assists,
          steals,
          blocks,
          three_points_made,
          three_points_attempted,
          minutes_played,
          matches!inner(match_date, home_score, away_score, home_team:home_team_id(name), away_team:away_team_id(name))
        `)
        .eq('player_id', playerId)
        .order('match_date', { ascending: false })
        .limit(15)
      
      if (error) throw error
      return data || []
    } catch (err) {
      return []
    }
  }, [])

  useEffect(() => {
    fetchPlayersWithStats()
  }, [fetchPlayersWithStats])

  return { 
    players, 
    loading, 
    error,
    getPlayersByTeam,
    getTopPlayers,
    searchPlayers,
    loadPlayerStats,
    refetch: () => fetchPlayersWithStats(true)
  }
}