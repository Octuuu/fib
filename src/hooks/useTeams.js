import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

export const useTeams = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTeams = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const cacheKey = 'teams_cache'
      const CACHE_TTL = 15 * 60 * 1000
      
      // Verificar caché
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            if (Date.now() - timestamp < CACHE_TTL) {
              console.log('Using cached teams:', data.length)
              setTeams(data || [])
              setLoading(false)
              return
            }
          } catch (cacheErr) {
            console.warn('Error reading cache:', cacheErr)
          }
        }
      }
      
      console.log('Fetching teams from database...')
      
      // ✅ CONSULTA SIMPLIFICADA - SIN COMENTARIOS EN EL SELECT
      const { data: teamsData, error: fetchError } = await supabase
        .from('teams')
        .select('id, name, short_name, city, logo_url, founded_year')
        .order('name')
        .limit(50)

      if (fetchError) {
        console.error('Error fetching teams:', fetchError)
        throw new Error(`Error al cargar equipos: ${fetchError.message}`)
      }
      
      console.log('Teams data loaded:', teamsData?.length || 0)
      
      // Si no hay datos, terminar aquí
      if (!teamsData || teamsData.length === 0) {
        setTeams([])
        setLoading(false)
        return
      }
      
      // Procesar equipos con datos básicos
      const processedTeams = teamsData.map(team => {
        return {
          id: team.id,
          name: team.name || 'Sin nombre',
          short_name: team.short_name || team.name?.substring(0, 3).toUpperCase() || 'EQP',
          city: team.city || 'Sin ciudad',
          logo_url: team.logo_url,
          founded_year: team.founded_year,
          // Valores por defecto para estadísticas
          stats: {
            games_played: 0,
            wins: 0,
            losses: 0,
            points_for: 0,
            points_against: 0
          },
          players_count: 0,
          win_percentage: 0,
          points_difference: 0
        }
      })
      
      // ✅ Obtener estadísticas por separado (solo si hay equipos)
      const teamIds = processedTeams.map(team => team.id)
      
      if (teamIds.length > 0) {
        try {
          // Obtener el torneo activo más reciente
          const { data: tournaments } = await supabase
            .from('tournaments')
            .select('id')
            .eq('is_active', true)
            .order('start_date', { ascending: false })
            .limit(1)
          
          let tournamentId = null
          if (tournaments && tournaments.length > 0) {
            tournamentId = tournaments[0].id
          }
          
          let standingsData = []
          
          // Si hay torneo activo, obtener estadísticas
          if (tournamentId) {
            const { data: standings, error: standingsError } = await supabase
              .from('standings')
              .select('team_id, games_played, wins, losses, points_for, points_against')
              .eq('tournament_id', tournamentId)
              .in('team_id', teamIds)
            
            if (!standingsError && standings) {
              standingsData = standings
            }
          }
          
          // Crear mapa de estadísticas
          const teamStatsMap = {}
          standingsData.forEach(stat => {
            teamStatsMap[stat.team_id] = {
              games_played: Number(stat.games_played) || 0,
              wins: Number(stat.wins) || 0,
              losses: Number(stat.losses) || 0,
              points_for: Number(stat.points_for) || 0,
              points_against: Number(stat.points_against) || 0
            }
          })
          
          // Obtener conteo de jugadores activos
          const { data: playersData } = await supabase
            .from('players')
            .select('team_id')
            .eq('is_active', true)
            .in('team_id', teamIds)
          
          // Contar jugadores por equipo
          const playersCountMap = {}
          if (playersData) {
            playersData.forEach(player => {
              if (player.team_id) {
                playersCountMap[player.team_id] = (playersCountMap[player.team_id] || 0) + 1
              }
            })
          }
          
          // Actualizar equipos con estadísticas
          processedTeams.forEach(team => {
            const stats = teamStatsMap[team.id] || team.stats
            const players_count = playersCountMap[team.id] || 0
            const gamesPlayed = stats.games_played || 0
            const wins = stats.wins || 0
            
            // Calcular porcentaje de victorias
            const winPercentage = gamesPlayed > 0 
              ? Math.round((wins / gamesPlayed) * 100)
              : 0
            
            // Calcular diferencia de puntos
            const pointsDifference = (stats.points_for || 0) - (stats.points_against || 0)
            
            team.stats = stats
            team.players_count = players_count
            team.win_percentage = winPercentage
            team.points_difference = pointsDifference
          })
          
        } catch (statsErr) {
          console.warn('Error fetching team stats:', statsErr)
          // Continuar sin estadísticas
        }
      }
      
      // Ordenar equipos por nombre
      const sortedTeams = [...processedTeams].sort((a, b) => 
        a.name.localeCompare(b.name)
      )
      
      // Guardar en cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          data: sortedTeams,
          timestamp: Date.now()
        }))
      } catch (storageErr) {
        console.warn('Error saving to localStorage:', storageErr)
      }
      
      console.log('Teams processed and sorted:', sortedTeams.length)
      setTeams(sortedTeams)
      
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido al cargar equipos'
      setError(errorMessage)
      console.error('Error fetching teams:', err)
      
      // Intentar usar cache en caso de error
      try {
        const cached = localStorage.getItem('teams_cache')
        if (cached) {
          const { data } = JSON.parse(cached)
          if (data && data.length > 0) {
            setTeams(data)
          }
        }
      } catch (cacheErr) {
        console.log('No cache available or cache is corrupted')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Función para obtener detalles de un equipo específico
  const getTeamDetails = useCallback(async (teamId) => {
    if (!teamId) return null
    
    try {
      // Obtener datos del equipo
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('id, name, short_name, city, logo_url, founded_year')
        .eq('id', teamId)
        .single()

      if (teamError) throw teamError
      
      // Obtener estadísticas del torneo activo
      let statsData = null
      const { data: tournaments } = await supabase
        .from('tournaments')
        .select('id')
        .eq('is_active', true)
        .order('start_date', { ascending: false })
        .limit(1)
      
      if (tournaments && tournaments.length > 0) {
        const { data: standings } = await supabase
          .from('standings')
          .select('games_played, wins, losses, points_for, points_against')
          .eq('team_id', teamId)
          .eq('tournament_id', tournaments[0].id)
          .limit(1)
        
        statsData = standings?.[0] || null
      }
      
      // Obtener conteo de jugadores activos
      const { count: playersCount } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', teamId)
        .eq('is_active', true)
      
      return {
        ...teamData,
        stats: statsData || {
          games_played: 0,
          wins: 0,
          losses: 0,
          points_for: 0,
          points_against: 0
        },
        players_count: playersCount || 0
      }
      
    } catch (err) {
      console.error('Error fetching team details:', err)
      return null
    }
  }, [])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  // Funciones auxiliares
  const getTeamById = useCallback((teamId) => {
    if (!teamId) return null
    return teams.find(team => team.id === teamId)
  }, [teams])

  const searchTeams = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) return teams
    
    const term = searchTerm.toLowerCase().trim()
    return teams.filter(team => {
      const teamName = (team.name || '').toLowerCase()
      const shortName = (team.short_name || '').toLowerCase()
      const city = (team.city || '').toLowerCase()
      
      return teamName.includes(term) ||
             shortName.includes(term) ||
             city.includes(term)
    })
  }, [teams])

  return { 
    teams, 
    loading, 
    error, 
    refetch: () => fetchTeams(true),
    getTeamDetails, 
    getTeamById,
    searchTeams
  }
}