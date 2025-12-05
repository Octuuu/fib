import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import TeamHeader from '../components/teams/TeamHeader'
import TeamLeaders from '../components/teams/TeamLeaders'
import TeamRoster from '../components/teams/TeamRoster'
import { useTeams } from '../hooks/useTeams'
import { usePlayers } from '../hooks/usePlayers'

const TeamDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { teams, loading: teamsLoading } = useTeams()
  const { players, loading: playersLoading } = usePlayers()

  const team = teams.find(t => t.id === id)
  const teamPlayers = players.filter(player => player.team_id === id)

  if (teamsLoading || playersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando equipo...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Equipo no encontrado</h1>
          <p className="text-gray-600 mb-4">El equipo que buscas no existe en nuestra base de datos.</p>
          <button 
            onClick={() => navigate('/equipos')}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition duration-200"
          >
            Volver a Equipos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Botón volver */}
        <Link 
          to="/equipos" 
          className="inline-flex items-center space-x-2 text-primary hover:text-primary-dark mb-6"
        >
          <span>←</span>
          <span>Volver a Equipos</span>
        </Link>

        {/* Header del equipo */}
        <TeamHeader team={team} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            <TeamRoster players={teamPlayers} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <TeamLeaders players={teamPlayers} />
            
            {/* Información adicional del equipo */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Información del Club</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ciudad:</span>
                  <span className="font-semibold">{team.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fundación:</span>
                  <span className="font-semibold">{team.founded_year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jugadores:</span>
                  <span className="font-semibold">{teamPlayers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temporadas:</span>
                  <span className="font-semibold">8</span>
                </div>
              </div>
              
              {/* Colores del equipo */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-3">Colores del Equipo</h4>
                <div className="flex space-x-2">
                  {team.colors?.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={`Color ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamDetail