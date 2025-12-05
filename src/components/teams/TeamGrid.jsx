import React from 'react'
import TeamCard from './TeamCard'
import { FaTrophy, FaUsers, FaCalendarAlt, FaChartLine } from 'react-icons/fa'

const TeamGrid = ({ teams }) => {
  
  const totalPlayers = teams.reduce((sum, team) => sum + (team.players_count || 0), 0)
  const totalWins = teams.reduce((sum, team) => sum + (team.stats.wins || 0), 0)
  const totalGames = teams.reduce((sum, team) => sum + (team.stats.games_played || 0), 0)
  const avgWinPercentage = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <FaBasketballBall className="text-gray-400 text-6xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay equipos registrados</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Los equipos aparecerán aquí cuando se registren en la liga
          </p>
        </div>
      )}
    </div>
  )
}

export default TeamGrid