import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export const useMatches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      
      console.log('Matches loaded successfully:', data?.length || 0)
      setMatches(data || [])
      
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
      if (!match.match_date) return false
      const matchDate = new Date(match.match_date)
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