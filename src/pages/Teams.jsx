import React from 'react'
import TeamGrid from '../components/teams/TeamGrid'
import { useTeams } from '../hooks/useTeams'
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa'

const Teams = () => {
  const { teams, loading, error } = useTeams()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Equipos</h1>
            <p className="text-gray-600">Lista completa de equipos participantes</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FaSpinner className="animate-spin text-primary text-4xl mx-auto mb-4" />
              <p className="text-gray-600">Cargando equipos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 text-center">
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar equipos</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Equipos</h1>
          <p className="text-gray-600">
            {teams.length} equipo{teams.length !== 1 ? 's' : ''} participantes en la temporada
          </p>
        </div>
        
        {teams.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 text-gray-300"></div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-3">No hay equipos registrados</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No se encontraron equipos en la base de datos. Contacta con el administrador.
            </p>
          </div>
        ) : (
          <TeamGrid teams={teams} />
        )}
      </div>
    </div>
  )
}

export default Teams