import React from 'react'
import TeamGrid from '../components/teams/TeamGrid'
import { useTeams } from '../hooks/useTeams'
import { FaSpinner, FaExclamationTriangle, FaBasketballBall } from 'react-icons/fa'

const Teams = () => {
  const { teams, loading, error, refetch } = useTeams()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Equipos</h1>
            <p className="text-gray-600">Lista completa de equipos participantes</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Cargando equipos...</p>
              <p className="text-gray-500 text-sm mt-2">Por favor, espera un momento</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Error al cargar equipos</h3>
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm font-mono">{error}</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={refetch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
              >
                Reintentar
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Recargar página
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              Si el problema persiste, contacta al administrador
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Equipos</h1>
          <p className="text-gray-600 text-lg">
            {teams.length} equipo{teams.length !== 1 ? 's' : ''} participantes en la temporada
          </p>
          
        
        </div>
        
        {teams.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBasketballBall className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No hay equipos registrados</h3>
            <p className="text-gray-600 mb-6">
              No se encontraron equipos en la base de datos. Esto puede deberse a:
            </p>
            <ul className="text-left max-w-md mx-auto text-gray-500 space-y-2 mb-8">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>No hay equipos activos en la temporada actual</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Error de conexión con la base de datos</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>La temporada aún no ha comenzado</span>
              </li>
            </ul>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={refetch}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Intentar nuevamente
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        ) : (
          <>
            <TeamGrid teams={teams} />
            
            {/* Información adicional */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-500 text-sm">
                Mostrando {teams.length} equipo{teams.length !== 1 ? 's' : ''}. 
                Haz clic en cualquier equipo para ver más detalles.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Teams