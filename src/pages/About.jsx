import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Conócenos</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Más de 10 años promoviendo el baloncesto local y formando grandes deportistas
          </p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Nuestra Historia</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                  <span className="text-6xl">🏀</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Desde 2014 creciendo juntos</h3>
                <p className="text-gray-600 mb-4">
                  La Liga de Baloncesto Pro nació en 2014 con el objetivo de crear una competición 
                  seria y organizada para equipos amateur y semi-profesionales de la región.
                </p>
                <p className="text-gray-600 mb-4">
                  Lo que comenzó con 4 equipos y un sueño, hoy es una liga consolidada con 6 equipos, 
                  más de 30 jugadores y una comunidad de aficionados que crece cada temporada.
                </p>
                <div className="flex space-x-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">10+</div>
                    <div className="text-sm text-gray-600">Años</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">200+</div>
                    <div className="text-sm text-gray-600">Partidos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <div className="text-sm text-gray-600">Jugadores</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Nuestra Misión</h3>
              <p className="text-gray-600">
                Promover el baloncesto como herramienta de desarrollo personal y comunitario, 
                ofreciendo una plataforma competitiva donde los jugadores puedan crecer deportiva 
                y personalmente.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Nuestra Visión</h3>
              <p className="text-gray-600">
                Ser la liga de baloncesto amateur de referencia en la región, reconocida por su 
                organización, fair play y capacidad para formar jugadores que puedan dar el salto 
                a competiciones profesionales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Nuestros Valores</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Compañerismo</h3>
              <p className="text-gray-600">
                Fomentamos el trabajo en equipo y el apoyo mutuo dentro y fuera de la cancha.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Fair Play</h3>
              <p className="text-gray-600">
                El respeto al rival, a los árbitros y al juego es fundamental en nuestra competición.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Superación</h3>
              <p className="text-gray-600">
                Creemos en la mejora continua de jugadores, equipos y de la propia organización.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Te gustaría unirte?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Ya seas jugador, entrenador o simplemente un apasionado del baloncesto, 
            hay un lugar para ti en nuestra comunidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200">
              Contactar
            </button>
            <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200">
              Ver Equipos
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About