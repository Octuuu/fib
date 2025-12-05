import React from 'react'
import MatchCalendar from '../components/matches/MatchCalendar'
import { useMatches } from '../hooks/useMatches'

const Calendar = () => {
  const { matches, loading, error } = useMatches()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando calendario...</p>
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
          <div className="text-center text-red-600">
            <p>Error al cargar el calendario: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <MatchCalendar matches={matches} />
      </div>
    </div>
  )
}

export default Calendar