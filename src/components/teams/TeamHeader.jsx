import React from 'react'
import { FaMapMarkerAlt, FaCalendarAlt, FaTrophy, FaBasketballBall } from 'react-icons/fa'

const TeamHeader = ({ team }) => {
  return (
    <div className="bg-gradient-to-r rounded-2xl p-6 md:p-8 mb-8 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
  
          <div className="relative">
            {team.logo_url ? (
              <img 
                src={team.logo_url} 
                alt={team.name}
                className="w-24 h-24 md:w-32 md:h-32 object-contain bg-white rounded-full p-2"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-gradient-to-br ">
                <FaBasketballBall className="text-white text-4xl md:text-5xl" />
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{team.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 ">
              {team.city && (
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  <span>{team.city}</span>
                </div>
              )}
              
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default TeamHeader