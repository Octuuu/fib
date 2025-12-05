import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export const useTeams = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTeams = async () => {
    try {
      setLoading(true)
      
      // Usar una consulta más eficiente con joins
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          standings!left(
            games_played,
            wins,
            losses,
            points_for,
            points_against,
            home_wins,
            away_wins
          ),
          players!left(
            id
          )
        `)
        .order('name')

      if (error) throw error
      
      // Procesar los datos
      const processedTeams = data.map(team => {
        const stats = team.standings?.[0] || {
          games_played: 0,
          wins: 0,
          losses: 0,
          points_for: 0,
          points_against: 0
        }
        
        const players_count = team.players?.length || 0
        const winPercentage = stats.games_played > 0 
          ? Math.round((stats.wins / stats.games_played) * 100)
          : 0
        const pointsDifference = stats.points_for - stats.points_against
        
        return {
          id: team.id,
          name: team.name,
          short_name: team.short_name,
          city: team.city,
          logo_url: team.logo_url,
          colors: team.colors,
          founded_year: team.founded_year,
          stats,
          players_count,
          win_percentage: winPercentage,
          points_difference: pointsDifference
        }
      })
      
      console.log('Teams processed:', processedTeams)
      setTeams(processedTeams)
      
    } catch (err) {
      setError(err.message)
      console.error('Error fetching teams:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  return { 
    teams, 
    loading, 
    error, 
    refetch: fetchTeams 
  }
}