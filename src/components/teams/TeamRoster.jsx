import React from 'react'
import PlayerCard from './PlayerCard'
import { FaUsers, FaFilter } from 'react-icons/fa'

const TeamRoster = ({ players }) => {

  const positions = {
    'Base': players.filter(p => p.player_position === 'Base' || p.player_position === 'PG'),
    'Escolta': players.filter(p => p.player_position === 'Escolta' || p.player_position === 'SG'),
    'Alero': players.filter(p => p.player_position === 'Alero' || p.player_position === 'SF'),
    'Ala-Pívot': players.filter(p => p.player_position === 'Ala-Pívot' || p.player_position === 'PF'),
    'Pívot': players.filter(p => p.player_position === 'Pívot' || p.player_position === 'C'),
    'Otros': players.filter(p => !p.player_position || !['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot', 'PG', 'SG', 'SF', 'PF', 'C'].includes(p.player_position))
  }

  return (
    <div className="rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaUsers className="text-black text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">Plantilla del Equipo</h2>
        </div>
        <div className="text-gray-600">
          <span className="font-semibold">{players.length}</span> jugadores
        </div>
      </div>
      
      {Object.entries(positions).map(([position, playersInPosition]) => (
        playersInPosition.length > 0 && (
          <div key={position} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700">
                {position} <span className="text-gray-500">({playersInPosition.length})</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playersInPosition.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        )
      ))}

      {players.length === 0 && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <FaUsers className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay jugadores en el equipo</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Este equipo no tiene jugadores registrados en la base de datos
          </p>
        </div>
      )}
    </div>
  )
}

export default TeamRoster