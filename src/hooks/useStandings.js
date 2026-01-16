import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

export const useStandings = () => {
  const [standings, setStandings] = useState([])
  const [headToHeadResults, setHeadToHeadResults] = useState([])
  const [activeTournament, setActiveTournament] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para obtener resultados de partidos para enfrentamientos directos
  const fetchHeadToHeadResults = useCallback(async (tournamentId) => {
    try {
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          id,
          tournament_id,
          home_team_id,
          away_team_id,
          home_score,
          away_score,
          status,
          home_team:home_team_id (id, name),
          away_team:away_team_id (id, name)
        `)
        .eq('tournament_id', tournamentId)
        .eq('status', 'finished')

      if (matchesError) {
        console.error('Error fetching matches:', matchesError)
        return []
      }

      return matchesData || []
    } catch (err) {
      console.error('Error in fetchHeadToHeadResults:', err)
      return []
    }
  }, [])

  const fetchStandings = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const cacheKey = 'standings_cache'
      const CACHE_TTL = 10 * 60 * 1000
      
      if (!forceRefresh) {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            if (Date.now() - timestamp < CACHE_TTL) {
              setStandings(data.standings || [])
              setActiveTournament(data.tournament || null)
              setHeadToHeadResults(data.matches || [])
              setLoading(false)
              return
            }
          } catch (cacheErr) {
            console.warn('Error reading cache:', cacheErr)
          }
        }
      }
      
      // Obtener torneo activo
      const { data: activeTournaments, error: tourError } = await supabase
        .from('tournaments')
        .select('id, name, season, start_date, end_date, is_active')
        .eq('is_active', true)
        .order('start_date', { ascending: false })
        .limit(1)

      if (tourError) {
        console.error('Error fetching tournaments:', tourError)
        throw new Error(`Error al cargar torneos: ${tourError.message}`)
      }

      let tournamentId
      let currentTournament = null
      
      if (activeTournaments && activeTournaments.length > 0) {
        tournamentId = activeTournaments[0].id
        currentTournament = activeTournaments[0]
      } else {
        const { data: latestTournaments, error: latestError } = await supabase
          .from('tournaments')
          .select('id, name, start_date')
          .order('start_date', { ascending: false })
          .limit(1)
        
        if (latestError) {
          console.error('Error fetching latest tournament:', latestError)
          throw new Error(`Error al buscar torneos: ${latestError.message}`)
        }
        
        if (latestTournaments && latestTournaments.length > 0) {
          tournamentId = latestTournaments[0].id
          currentTournament = latestTournaments[0]
        } else {
          setStandings([])
          setLoading(false)
          return
        }
      }
      
      setActiveTournament(currentTournament)
      
      // Obtener resultados de partidos para enfrentamientos directos
      const matchesData = await fetchHeadToHeadResults(tournamentId)
      setHeadToHeadResults(matchesData)
      
      // Obtener clasificaciones
      const { data: standingsData, error: standingsError } = await supabase
        .from('standings')
        .select(`
          id,
          tournament_id,
          team_id,
          games_played,
          wins,
          losses,
          points_for,
          points_against,
          home_wins,
          away_wins,
          points_difference,
          group_id,
          group_position,
          team:teams (
            id,
            name,
            city,
            logo_url,
            short_name
          )
        `)
        .eq('tournament_id', tournamentId)

      if (standingsError) {
        console.error('Error fetching standings:', standingsError)
        throw new Error(`Error al cargar clasificación: ${standingsError.message}`)
      }
      
      // Procesar datos con el sistema de puntos correcto
      const processedStandings = (standingsData || []).map(item => {
        const gamesPlayed = Number(item.games_played) || 0
        const wins = Number(item.wins) || 0
        const losses = Number(item.losses) || 0
        const pointsFor = Number(item.points_for) || 0
        const pointsAgainst = Number(item.points_against) || 0
        
        // Calcular diferencia de puntos si no existe
        const pointsDifference = item.points_difference 
          ? Number(item.points_difference) 
          : pointsFor - pointsAgainst
        
        // Calcular puntos según el sistema: Victoria = 2 puntos, Derrota = 1 punto
        const totalPoints = (wins * 2) + (losses * 1)
        
        return {
          id: item.id,
          team_id: item.team_id,
          tournament_id: item.tournament_id,
          games_played: gamesPlayed,
          wins: wins,
          losses: losses,
          points_for: pointsFor,
          points_against: pointsAgainst,
          points_difference: pointsDifference,
          total_points: totalPoints, // Nuevo campo
          home_wins: Number(item.home_wins) || 0,
          away_wins: Number(item.away_wins) || 0,
          group_id: item.group_id || null,
          group_position: item.group_position || null,
          win_percentage: gamesPlayed > 0 
            ? Math.round((wins / gamesPlayed) * 1000) / 10
            : 0,
          team: item.team ? {
            id: item.team.id,
            name: item.team.name || 'Equipo sin nombre',
            city: item.team.city || '',
            logo_url: item.team.logo_url,
            short_name: item.team.short_name || item.team.name?.substring(0, 3).toUpperCase() || 'EQP'
          } : {
            id: item.team_id,
            name: 'Equipo desconocido',
            city: '',
            logo_url: null,
            short_name: '???'
          }
        }
      })
      
      // Guardar en caché
      const cacheData = {
        standings: processedStandings, // No ordenar aquí, se ordenará en la tabla
        matches: matchesData,
        tournament: currentTournament,
        timestamp: Date.now()
      }
      
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      } catch (storageErr) {
        console.warn('Error saving to localStorage:', storageErr)
      }
      
      setStandings(processedStandings)
      
    } catch (err) {
      const errorMessage = err.message || 'Error desconocido al cargar la clasificación'
      setError(errorMessage)
      console.error('Error fetching standings:', err)
      
      try {
        const cached = localStorage.getItem('standings_cache')
        if (cached) {
          const { data } = JSON.parse(cached)
          if (data.standings) {
            setStandings(data.standings)
            setActiveTournament(data.tournament)
            setHeadToHeadResults(data.matches || [])
          }
        }
      } catch (cacheErr) {
        console.log('No cache available or cache is corrupted')
      }
    } finally {
      setLoading(false)
    }
  }, [fetchHeadToHeadResults])

  // Resto del código igual con pequeña modificación en updateStanding...
  const updateStanding = useCallback((matchData) => {
    if (!matchData || !matchData.home_team_id || !matchData.away_team_id) return
    
    setStandings(prev => {
      return prev.map(standing => {
        const isHomeTeam = standing.team_id === matchData.home_team_id
        const isAwayTeam = standing.team_id === matchData.away_team_id
        
        if (!isHomeTeam && !isAwayTeam) return standing
        
        const newStanding = { ...standing }
        newStanding.games_played += 1
        
        if (isHomeTeam) {
          if (matchData.home_score > matchData.away_score) {
            newStanding.wins += 1
            newStanding.home_wins += 1
          } else {
            newStanding.losses += 1
          }
          newStanding.points_for += matchData.home_score
          newStanding.points_against += matchData.away_score
        }
        
        if (isAwayTeam) {
          if (matchData.away_score > matchData.home_score) {
            newStanding.wins += 1
            newStanding.away_wins += 1
          } else {
            newStanding.losses += 1
          }
          newStanding.points_for += matchData.away_score
          newStanding.points_against += matchData.home_score
        }
        
        newStanding.points_difference = newStanding.points_for - newStanding.points_against
        newStanding.win_percentage = newStanding.games_played > 0
          ? Math.round((newStanding.wins / newStanding.games_played) * 1000) / 10
          : 0
        
        // Actualizar puntos totales
        newStanding.total_points = (newStanding.wins * 2) + (newStanding.losses * 1)
        
        return newStanding
      })
    })
  }, [])

  useEffect(() => {
    fetchStandings()
    
    const channel = supabase
      .channel('standings-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'matches' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new.status === 'finished') {
            updateStanding(payload.new)
            // Actualizar también los resultados de enfrentamientos directos
            setHeadToHeadResults(prev => {
              const existingMatch = prev.find(m => m.id === payload.new.id)
              if (existingMatch) {
                return prev.map(m => 
                  m.id === payload.new.id 
                    ? { 
                        ...m, 
                        home_score: payload.new.home_score,
                        away_score: payload.new.away_score,
                        status: payload.new.status
                      }
                    : m
                )
              } else {
                return [...prev, payload.new]
              }
            })
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchStandings, updateStanding])

  return { 
    standings, 
    headToHeadResults,
    activeTournament,
    loading, 
    error,
    refetch: () => fetchStandings(true),
    updateStanding 
  }
}