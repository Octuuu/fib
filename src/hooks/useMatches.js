import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export const useMatches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Función para ajustar UTC a hora Paraguay (UTC-4)
  const adjustToParaguayTime = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    // Sumar 4 horas para convertir UTC a hora Paraguay
    return new Date(date.getTime() + (4 * 60 * 60 * 1000))
  }

  const fetchMatches = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:home_team_id(name, short_name, logo_url, colors),
          away_team:away_team_id(name, short_name, logo_url, colors),
          mvp:mvp_player_id(first_name, last_name, jersey_number),
          tournament:tournaments(name)
        `)
        .order('match_date', { ascending: true })

      if (error) throw error
      
      // Agregar fecha ajustada a Paraguay
      const matchesWithAdjustedDates = (data || []).map(match => ({
        ...match,
        paraguay_date: adjustToParaguayTime(match.match_date)
      }))
      
      console.log('Matches loaded successfully:', matchesWithAdjustedDates.length)
      
      if (matchesWithAdjustedDates.length > 0) {
        console.log('First match date debug:', {
          raw: matchesWithAdjustedDates[0].match_date,
          adjusted: matchesWithAdjustedDates[0].paraguay_date,
          rawString: new Date(matchesWithAdjustedDates[0].match_date).toLocaleString('es-PY'),
          adjustedString: matchesWithAdjustedDates[0].paraguay_date.toLocaleString('es-PY')
        })
      }
      
      setMatches(matchesWithAdjustedDates)
      
    } catch (err) {
      setError(err.message)
      console.error('Error fetching matches:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const getNextMatches = () => {
    const upcomingStatuses = ['scheduled', 'pending', 'confirmed', 'not_started']
    
    return matches
      .filter(match => {
        const status = match.status?.toLowerCase()
        const isUpcoming = upcomingStatuses.includes(status)
        const hasNoScore = match.home_score === null && match.away_score === null
        
        return isUpcoming || hasNoScore
      })
      .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
      .slice(0, 3)
  }

  const getRecentMatches = () => {
    const finishedStatuses = ['finished', 'completed', 'played']
    
    return matches
      .filter(match => {
        const status = match.status?.toLowerCase()
        const isFinished = finishedStatuses.includes(status)
        const hasScore = match.home_score !== null && match.away_score !== null
        
        return isFinished || hasScore
      })
      .sort((a, b) => new Date(b.match_date) - new Date(a.match_date))
      .slice(0, 5)
  }

  const getTodayMatches = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return matches.filter(match => {
      if (!match.paraguay_date) return false
      const matchDate = new Date(match.paraguay_date)
      return matchDate >= today && matchDate < tomorrow
    })
  }

  return { 
    matches, 
    loading, 
    error, 
    getNextMatches, 
    getRecentMatches,
    getTodayMatches,
    refetch: fetchMatches
  }
}