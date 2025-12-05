import React from 'react'

const BasketballSchool = () => {
  const programs = [
    {
      title: "Escuela Infantil",
      age: "6-12 años",
      description: "Iniciación al baloncesto con metodología lúdica y educativa",
      schedule: "Lunes y Miércoles 17:00-18:30",
      price: "€40/mes",
      features: ["Grupos reducidos", "Material incluido", "Seguro deportivo"]
    },
    {
      title: "Programa Juvenil",
      age: "13-18 años",
      description: "Formación técnica y táctica para jóvenes jugadores",
      schedule: "Martes y Jueves 18:30-20:00",
      price: "€50/mes",
      features: ["Preparación física", "Competiciones", "Scouting"]
    },
    {
      title: "Clinic Avanzado",
      age: "+18 años",
      description: "Perfeccionamiento para jugadores con experiencia",
      schedule: "Viernes 19:00-21:00",
      price: "€60/mes",
      features: ["Análisis de video", "Entrenamiento específico", "Asesoramiento"]
    }
  ]

  const coaches = [
    { name: "Carlos Martínez", role: "Director Técnico", experience: "15 años", specialty: "Formación de bases" },
    { name: "Ana Rodríguez", role: "Entrenadora Juvenil", experience: "8 años", specialty: "Desarrollo físico" },
    { name: "David López", role: "Coach Avanzado", experience: "12 años", specialty: "Táctica ofensiva" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Escuela de Baloncesto</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Formamos jugadores, creamos personas. Tu camino en el baloncesto comienza aquí.
          </p>
        </div>
      </section>

      {/* Programas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Nuestros Programas</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Programas adaptados a cada edad y nivel, con metodología moderna y entrenadores cualificados.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-200">
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-2xl p-6">
                  <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
                  <div className="text-blue-100">{program.age}</div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">🕐</span>
                      {program.schedule}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="mr-2">💶</span>
                      {program.price}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold mb-3 text-gray-800">Incluye:</h4>
                    <ul className="space-y-2">
                      {program.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg mt-6 transition duration-200">
                    Más Información
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuerpo Técnico */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Nuestro Cuerpo Técnico</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Entrenadores titulados con amplia experiencia en formación de jugadores.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {coaches.map((coach, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {coach.name.split(' ')[0][0]}{coach.name.split(' ')[1][0]}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-800">{coach.name}</h3>
                <div className="text-primary font-semibold mb-3">{coach.role}</div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📊 {coach.experience} de experiencia</div>
                  <div>🎯 Especialidad: {coach.specialty}</div>
                </div>
                
                <button className="mt-4 text-primary hover:text-primary-dark font-semibold text-sm">
                  Ver Perfil Completo →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instalaciones */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Instalaciones</h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Entrenamos en las mejores instalaciones de la ciudad, adaptadas a todos los niveles.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                  <span className="text-6xl">🏟️</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Polideportivo Central</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Pabellón cubierto con 2 pistas
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Vestuarios con taquillas
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Sala de fisioterapia
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Zona de análisis técnico
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Parking gratuito
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-gray-800">Dirección:</div>
                  <div className="text-gray-600">Av. del Deporte, 123 • Ciudad Deportiva</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Inscripción */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Reserva tu plaza para la próxima temporada. Clase de prueba gratuita.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-8 rounded-lg text-lg transition duration-200">
              📞 Llamar Ahora
            </button>
            <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200">
              ✉️ Solicitar Info
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BasketballSchool