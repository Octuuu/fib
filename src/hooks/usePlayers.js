import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

export const usePlayers = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función optimizada para obtener jugadores con estadísticas
  const fetchPlayersWithStats = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const cacheKey = 'players_cache'
      const CACHE_TTL = 5 * 60 * 1000 // 5 minutos
      
      // Verificar caché
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            if (Date.now() - timestamp < CACHE_TTL) {
              console.log('Using cached players:', data.length)
              setPlayers(data || [])
              setLoading(false)
              return
            }
          } catch (cacheErr) {
            console.warn('Error reading cache:', cacheErr)
          }
        }
      }
      
      console.log('Fetching players with stats...')
      
      // PRIMERO: Obtener todos los jugadores activos básicos
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select(`
          id,
          team_id,
          first_name,
          last_name,
          player_position,
          jersey_number,
          height_cm,
          weight_kg,
          birth_date,
          photo_url,
          is_active,
          biography,
          team:teams(id, name, short_name, city, logo_url)
        `)
        .eq('is_active', true)
        .order('first_name')
        .limit(100)

      if (playersError) {
        console.error('Error fetching players:', playersError)
        throw new Error(`Error al cargar jugadores: ${playersError.message}`)
      }
      
      console.log('Basic players loaded:', playersData?.length || 0)
      
      if (!playersData || playersData.length === 0) {
        setPlayers([])
        setLoading(false)
        return
      }
      
      // SEGUNDO: Obtener estadísticas de todos los jugadores
      const playerIds = playersData.map(p => p.id)
      let statsByPlayer = {}
      let gamesByPlayer = {}
      
      if (playerIds.length > 0) {
        console.log('Fetching stats for', playerIds.length, 'players...')
        
        // Obtener estadísticas de la tabla player_stats
        const { data: statsData, error: statsError } = await supabase
          .from('player_stats')
          .select('player_id, points, rebounds, assists, three_points_made, three_points_attempted, match_id')
          .in('player_id', playerIds)
          .limit(1000)
        
        if (statsError) {
          console.warn('Error fetching player stats:', statsError)
          // Continuar sin estadísticas
        } else if (statsData && statsData.length > 0) {
          console.log('Stats data found:', statsData.length, 'records')
          
          // Procesar estadísticas
          statsData.forEach(stat => {
            const playerId = stat.player_id
            const matchId = stat.match_id
            
            if (!statsByPlayer[playerId]) {
              statsByPlayer[playerId] = {
                total_points: 0,
                total_rebounds: 0,
                total_assists: 0,
                total_three_points_made: 0,
                total_three_points_attempted: 0,
                match_ids: new Set()
              }
            }
            
            // Sumar estadísticas
            statsByPlayer[playerId].total_points += Number(stat.points) || 0
            statsByPlayer[playerId].total_rebounds += Number(stat.rebounds) || 0
            statsByPlayer[playerId].total_assists += Number(stat.assists) || 0
            statsByPlayer[playerId].total_three_points_made += Number(stat.three_points_made) || 0
            statsByPlayer[playerId].total_three_points_attempted += Number(stat.three_points_attempted) || 0
            
            // Añadir partido único
            if (matchId) {
              statsByPlayer[playerId].match_ids.add(matchId)
            }
          })
          
          // Contar partidos por jugador
          Object.keys(statsByPlayer).forEach(playerId => {
            gamesByPlayer[playerId] = statsByPlayer[playerId].match_ids.size
          })
          
          console.log('Stats processed for', Object.keys(statsByPlayer).length, 'players')
        } else {
          console.log('No stats data found in player_stats table')
        }
      }
      
      // TERCERO: Procesar y combinar datos
      const processedPlayers = playersData.map(player => {
        const playerId = player.id
        const playerStats = statsByPlayer[playerId] || {
          total_points: 0,
          total_rebounds: 0,
          total_assists: 0,
          total_three_points_made: 0,
          total_three_points_attempted: 0
        }
        
        const gamesPlayed = gamesByPlayer[playerId] || 0
        const totalPoints = playerStats.total_points || 0
        const totalRebounds = playerStats.total_rebounds || 0
        const totalAssists = playerStats.total_assists || 0
        const totalThreePointsMade = playerStats.total_three_points_made || 0
        const totalThreePointsAttempted = playerStats.total_three_points_attempted || 0
        
        // Calcular porcentaje de triples
        const threePointPercentage = totalThreePointsAttempted > 0 
          ? ((totalThreePointsMade / totalThreePointsAttempted) * 100).toFixed(1)
          : '0.0'
        
        // Calcular promedios (con mínimo 1 partido)
        const pointsPerGame = gamesPlayed > 0 ? (totalPoints / gamesPlayed).toFixed(1) : '0.0'
        const reboundsPerGame = gamesPlayed > 0 ? (totalRebounds / gamesPlayed).toFixed(1) : '0.0'
        const assistsPerGame = gamesPlayed > 0 ? (totalAssists / gamesPlayed).toFixed(1) : '0.0'
        
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
          team: player.team || {
            id: player.team_id,
            name: 'Sin equipo',
            short_name: 'N/A',
            city: '',
            logo_url: null
          },
          // Estadísticas totales
          points: totalPoints,
          rebounds: totalRebounds,
          assists: totalAssists,
          three_points_made: totalThreePointsMade,
          three_points_attempted: totalThreePointsAttempted,
          games_played: gamesPlayed,
          // Promedios
          points_per_game: pointsPerGame,
          rebounds_per_game: reboundsPerGame,
          assists_per_game: assistsPerGame,
          three_point_percentage: threePointPercentage
        }
      })
      
      console.log('Processed players:', processedPlayers.length)
      console.log('Players with games:', processedPlayers.filter(p => p.games_played > 0).length)
      
      // Guardar en caché
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: processedPlayers,
          timestamp: Date.now()
        }))
      } catch (storageErr) {
        console.warn('Error saving to localStorage:', storageErr)
      }
      
      setPlayers(processedPlayers)
      
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido al cargar jugadores'
      setError(errorMessage)
      console.error('Error in fetchPlayersWithStats:', err)
      
      // Intentar usar caché en caso de error
      try {
        const cached = localStorage.getItem('players_cache')
        if (cached) {
          const { data } = JSON.parse(cached)
          if (data && data.length > 0) {
            setPlayers(data)
          }
        }
      } catch (cacheErr) {
        console.log('No cache available or cache is corrupted')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Función para obtener los mejores jugadores (REQUISITO CAMBIADO: mínimo 1 partido)
  const getTopPlayers = useCallback(() => {
    try {
      console.log('=== INICIANDO BÚSQUEDA DE MEJORES JUGADORES ===')
      
      // Filtrar jugadores con al menos 1 partido
      const eligiblePlayers = players.filter(p => {
        const gamesPlayed = parseInt(p.games_played) || 0
        return gamesPlayed >= 1 // Cambiado de 3 a 1
      })
      
      console.log('Jugadores elegibles (con 1+ partidos):', eligiblePlayers.length)
      console.log('Todos los jugadores elegibles:', eligiblePlayers.map(p => ({
        nombre: `${p.first_name} ${p.last_name}`,
        partidos: p.games_played,
        ppp: p.points_per_game,
        app: p.assists_per_game,
        rpp: p.rebounds_per_game,
        triples: p.three_points_made
      })))
      
      if (eligiblePlayers.length === 0) {
        console.log('No hay jugadores con al menos 1 partido')
        return []
      }
      
      // Si hay menos de 4 jugadores, usar todos los que tengan estadísticas
      const playersToUse = eligiblePlayers.length >= 4 ? eligiblePlayers : eligiblePlayers
      
      // Función para ordenar jugadores por estadística
      const sortPlayers = (statKey, isString = false) => {
        return [...playersToUse].sort((a, b) => {
          let aValue, bValue
          
          if (isString) {
            aValue = parseFloat(a[statKey]) || 0
            bValue = parseFloat(b[statKey]) || 0
          } else {
            aValue = a[statKey] || 0
            bValue = b[statKey] || 0
          }
          
          return bValue - aValue
        })
      }
      
      // Ordenar por cada categoría
      const topScorers = sortPlayers('points_per_game', true)
      const topAssisters = sortPlayers('assists_per_game', true)
      const topRebounders = sortPlayers('rebounds_per_game', true)
      const topThreePointers = sortPlayers('three_points_made', false)
      
      console.log('Máximo anotador:', topScorers[0]?.first_name, topScorers[0]?.points_per_game)
      console.log('Máximo asistente:', topAssisters[0]?.first_name, topAssisters[0]?.assists_per_game)
      console.log('Máximo reboteador:', topRebounders[0]?.first_name, topRebounders[0]?.rebounds_per_game)
      console.log('Máximo triplista:', topThreePointers[0]?.first_name, topThreePointers[0]?.three_points_made)
      
      // Seleccionar los mejores jugadores evitando duplicados
      const bestPlayers = []
      const usedIds = new Set()
      
      // 1. Máximo anotador
      if (topScorers.length > 0 && parseFloat(topScorers[0].points_per_game) > 0) {
        const player = topScorers[0]
        bestPlayers.push(player)
        usedIds.add(player.id)
        console.log('✅ Seleccionado como máximo anotador:', player.first_name)
      }
      
      // 2. Máximo asistente (diferente al anotador)
      if (topAssisters.length > 0) {
        const player = topAssisters.find(p => !usedIds.has(p.id)) || topAssisters[0]
        if (player && parseFloat(player.assists_per_game) > 0) {
          bestPlayers.push(player)
          usedIds.add(player.id)
          console.log('✅ Seleccionado como máximo asistente:', player.first_name)
        }
      }
      
      // 3. Máximo reboteador (diferente a los anteriores)
      if (topRebounders.length > 0) {
        const player = topRebounders.find(p => !usedIds.has(p.id)) || topRebounders[0]
        if (player && parseFloat(player.rebounds_per_game) > 0) {
          bestPlayers.push(player)
          usedIds.add(player.id)
          console.log('✅ Seleccionado como máximo reboteador:', player.first_name)
        }
      }
      
      // 4. Máximo triplista (diferente a los anteriores)
      if (topThreePointers.length > 0) {
        const player = topThreePointers.find(p => !usedIds.has(p.id)) || topThreePointers[0]
        if (player && (player.three_points_made > 0)) {
          bestPlayers.push(player)
          console.log('✅ Seleccionado como máximo triplista:', player.first_name)
        }
      }
      
      // Si no encontramos 4 jugadores, llenar con los mejores disponibles
      if (bestPlayers.length < 4) {
        const remainingPlayers = playersToUse
          .filter(p => !usedIds.has(p.id))
          .sort((a, b) => parseFloat(b.points_per_game) - parseFloat(a.points_per_game))
          .slice(0, 4 - bestPlayers.length)
        
        bestPlayers.push(...remainingPlayers)
        console.log('➕ Añadidos jugadores adicionales:', remainingPlayers.map(p => p.first_name))
      }
      
      console.log('=== RESULTADO FINAL ===')
      console.log('Total de figuras encontradas:', bestPlayers.length)
      bestPlayers.forEach((player, index) => {
        console.log(`${index + 1}. ${player.first_name} ${player.last_name} - ${player.team?.name}`)
      })
      
      return bestPlayers.slice(0, 4)
      
    } catch (error) {
      console.error('Error en getTopPlayers:', error)
      return []
    }
  }, [players])

  // Obtener jugadores por equipo
  const getPlayersByTeam = useCallback((teamId) => {
    if (!teamId) return []
    return players.filter(player => player.team_id === teamId)
  }, [players])

  // Buscar jugadores
  const searchPlayers = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) return players
    
    const term = searchTerm.toLowerCase().trim()
    
    return players.filter(player => {
      const fullName = `${player.first_name} ${player.last_name}`.toLowerCase()
      return fullName.includes(term) ||
             player.first_name.toLowerCase().includes(term) ||
             player.last_name.toLowerCase().includes(term) ||
             (player.team?.name && player.team.name.toLowerCase().includes(term)) ||
             (player.jersey_number && player.jersey_number.toString().includes(term))
    })
  }, [players])

  // Cargar estadísticas detalladas de un jugador
  const loadPlayerStats = useCallback(async (playerId) => {
    if (!playerId) return []
    
    try {
      const { data: statsData, error } = await supabase
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
          matches!inner(
            match_date,
            home_team_id,
            away_team_id,
            home_score,
            away_score,
            home_team:home_team_id(name),
            away_team:away_team_id(name)
          )
        `)
        .eq('player_id', playerId)
        .order('match_date', { ascending: false })
        .limit(20)
      
      if (error) throw error
      
      return statsData || []
    } catch (err) {
      console.error('Error loading player stats:', err)
      return []
    }
  }, [])

  // Efecto inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlayersWithStats()
    }, 500)
    
    return () => clearTimeout(timer)
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