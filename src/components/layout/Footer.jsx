import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Liga Basket Pro</h3>
            <p className="text-gray-300">
              La mejor competencia de baloncesto local. Pasión, deporte y comunidad.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><Link to="/equipos" className="text-gray-300 hover:text-white">Equipos</Link></li>
              <li><Link to="/calendario" className="text-gray-300 hover:text-white">Calendario</Link></li>
              <li><Link to="/conocenos" className="text-gray-300 hover:text-white">Conócenos</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📧 info@ligabasketpro.com</li>
              <li>📞 +34 912 345 678</li>
              <li>📍 Polideportivo Central</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center">
                📘
              </button>
              <button className="bg-blue-400 hover:bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
                🐦
              </button>
              <button className="bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full flex items-center justify-center">
                📷
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 Liga Basket Pro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer