import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export const useStandings = () => {
  const [standings, setStandings] = useState([])
  const [activeTournament, setActiveTournament] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStandings = async () => {
    try {
      setLoading(true)
      
      // 1. Buscar el torneo activo (is_active = true)
      const { data: activeTournaments, error: tourError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: false })
        .limit(1)

      if (tourError) throw tourError

      let tournamentId
      
      if (activeTournaments && activeTournaments.length > 0) {
        // Usar torneo activo si existe
        tournamentId = activeTournaments[0].id
        setActiveTournament(activeTournaments[0])
        console.log('Using active tournament:', activeTournaments[0].name)
      } else {
        // Si no hay torneo activo, usar el más reciente
        const { data: latestTournaments } = await supabase
          .from('tournaments')
          .select('*')
          .order('start_date', { ascending: false })
          .limit(1)
        
        if (latestTournaments && latestTournaments.length > 0) {
          tournamentId = latestTournaments[0].id
          setActiveTournament(latestTournaments[0])
          console.log('Using latest tournament:', latestTournaments[0].name)
        } else {
          console.log('No tournaments found')
          setStandings([])
          setLoading(false)
          return
        }
      }
      
      // 2. Obtener standings para este torneo
      const { data, error: standingsError } = await supabase
        .from('standings')
        .select(`
          *,
          team:teams (
            id,
            name,
            short_name,
            city,
            logo_url,
            colors
          )
        `)
        .eq('tournament_id', tournamentId)
        .order('wins', { ascending: false })
        .order('points_difference', { ascending: false })
        .order('points_for', { ascending: false })

      if (standingsError) throw standingsError
      
      console.log('Standings loaded:', data?.length || 0, 'teams')
      setStandings(data || [])
      
    } catch (err) {
      setError(err.message)
      console.error('Error fetching standings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStandings()
  }, [])

  return { 
    standings, 
    activeTournament,
    loading, 
    error,
    refetch: fetchStandings
  }
}