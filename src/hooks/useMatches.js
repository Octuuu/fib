import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export const useMatches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

 
  const adjustToParaguayTime = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    
    return new Date(date.getTime() + (4 * 60 * 60 * 1000))
  }

  const fetchMatches = async () => {
    try {
      setLoading(true)
      
     
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id, match_date, match_time, home_score, away_score, status, location,
          home_team:home_team_id(name, short_name, logo_url),
          away_team:away_team_id(name, short_name, logo_url),
          mvp:mvp_player_id(first_name, last_name),
          tournament:tournaments(name)
        `)
        .order('match_date', { ascending: true })
        .limit(100) 

      if (error) throw error
      
      const matchesWithAdjustedDates = (data || []).map(match => ({
        ...match,
        paraguay_date: adjustToParaguayTime(match.match_date)
      }))
      
      console.log('Matches loaded successfully:', matchesWithAdjustedDates.length)
      
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
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return matches
      .filter(match => {
        if (!match.paraguay_date) return false
        const matchDate = new Date(match.paraguay_date)
        return matchDate >= today && match.status !== 'finished'
      })
      .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
      .slice(0, 3)
  }

  const getRecentMatches = () => {
    return matches
      .filter(match => match.status === 'finished')
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

  const loadMoreMatches = async (page = 1, limit = 20) => {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id, match_date, match_time, home_score, away_score, status, location,
          home_team:home_team_id(name, short_name),
          away_team:away_team_id(name, short_name)
        `)
        .order('match_date', { ascending: true })
        .range(from, to)

      if (error) throw error
      
      return data || []
      
    } catch (err) {
      console.error('Error loading more matches:', err)
      return []
    }
  }

  return { 
    matches, 
    loading, 
    error, 
    getNextMatches, 
    getRecentMatches,
    getTodayMatches,
    refetch: fetchMatches,
    loadMoreMatches
  }
}