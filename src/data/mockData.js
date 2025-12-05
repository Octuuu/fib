// Datos mock para equipos
export const teams = [
  {
    id: 1,
    name: "Tiburones Rojos",
    city: "Ciudad Deportiva",
    logo: "🏀",
    founded: 1995,
    colors: ["#DC2626", "#FFFFFF"]
  },
  {
    id: 2,
    name: "Águilas Doradas",
    city: "Valle Alto",
    logo: "🦅",
    founded: 1988,
    colors: ["#F59E0B", "#000000"]
  },
  {
    id: 3,
    name: "Leones del Norte",
    city: "Sierra Nevada",
    logo: "🦁",
    founded: 2001,
    colors: ["#059669", "#FBBF24"]
  },
  {
    id: 4,
    name: "Toros Salvajes",
    city: "Llanura Central",
    logo: "🐂",
    founded: 1992,
    colors: ["#7C3AED", "#FFFFFF"]
  },
  {
    id: 5,
    name: "Halcones Azules",
    city: "Costa Este",
    logo: "🦅",
    founded: 1998,
    colors: ["#2563EB", "#FFFFFF"]
  },
  {
    id: 6,
    name: "Panteras Negras",
    city: "Selva Urbana",
    logo: "🐆",
    founded: 2005,
    colors: ["#000000", "#F43F5E"]
  }
]

// Datos mock para jugadores
export const players = [
  // Tiburones Rojos
  { id: 1, name: "Carlos Rodríguez", teamId: 1, position: "Base", jersey: 7, points: 185, assists: 45, rebounds: 32, steals: 18, blocks: 2, threePoints: 28 },
  { id: 2, name: "Miguel Torres", teamId: 1, position: "Alero", jersey: 23, points: 210, assists: 28, rebounds: 65, steals: 12, blocks: 8, threePoints: 35 },
  { id: 3, name: "Javier López", teamId: 1, position: "Pívot", jersey: 34, points: 156, assists: 15, rebounds: 98, steals: 8, blocks: 25, threePoints: 5 },
  { id: 4, name: "David García", teamId: 1, position: "Escolta", jersey: 11, points: 178, assists: 38, rebounds: 42, steals: 22, blocks: 3, threePoints: 31 },
  { id: 5, name: "Alejandro Martín", teamId: 1, position: "Ala-Pívot", jersey: 21, points: 192, assists: 25, rebounds: 78, steals: 14, blocks: 15, threePoints: 18 },
  
  // Águilas Doradas
  { id: 6, name: "Roberto Silva", teamId: 2, position: "Base", jersey: 5, points: 198, assists: 52, rebounds: 28, steals: 25, blocks: 1, threePoints: 42 },
  { id: 7, name: "Fernando Castro", teamId: 2, position: "Alero", jersey: 24, points: 225, assists: 32, rebounds: 58, steals: 16, blocks: 6, threePoints: 38 },
  { id: 8, name: "Ricardo Méndez", teamId: 2, position: "Pívot", jersey: 33, points: 167, assists: 18, rebounds: 105, steals: 9, blocks: 28, threePoints: 2 },
  { id: 9, name: "Sergio Ramos", teamId: 2, position: "Escolta", jersey: 8, points: 184, assists: 41, rebounds: 35, steals: 20, blocks: 4, threePoints: 33 },
  { id: 10, name: "Pablo Navarro", teamId: 2, position: "Ala-Pívot", jersey: 17, points: 205, assists: 29, rebounds: 82, steals: 13, blocks: 12, threePoints: 22 },
  
  // Leones del Norte
  { id: 11, name: "Juan Pérez", teamId: 3, position: "Base", jersey: 10, points: 172, assists: 48, rebounds: 25, steals: 21, blocks: 2, threePoints: 29 },
  { id: 12, name: "Luis Gómez", teamId: 3, position: "Alero", jersey: 22, points: 195, assists: 26, rebounds: 61, steals: 14, blocks: 7, threePoints: 32 },
  { id: 13, name: "Diego Ruiz", teamId: 3, position: "Pívot", jersey: 44, points: 148, assists: 12, rebounds: 92, steals: 7, blocks: 21, threePoints: 4 },
  { id: 14, name: "José Hernández", teamId: 3, position: "Escolta", jersey: 13, points: 165, assists: 35, rebounds: 38, steals: 19, blocks: 3, threePoints: 27 },
  { id: 15, name: "Antonio Díaz", teamId: 3, position: "Ala-Pívot", jersey: 25, points: 188, assists: 22, rebounds: 74, steals: 11, blocks: 14, threePoints: 16 }
]

// Datos mock para partidos
export const matches = [
  {
    id: 1,
    date: "2024-02-15T20:00:00",
    homeTeamId: 1,
    awayTeamId: 2,
    location: "Polideportivo Central",
    homeScore: 85,
    awayScore: 78,
    status: "finished",
    mvpPlayerId: 2
  },
  {
    id: 2,
    date: "2024-02-16T19:30:00",
    homeTeamId: 3,
    awayTeamId: 4,
    location: "Gimnasio Norte",
    homeScore: 92,
    awayScore: 88,
    status: "finished",
    mvpPlayerId: 7
  },
  {
    id: 3,
    date: "2024-02-17T21:00:00",
    homeTeamId: 5,
    awayTeamId: 6,
    location: "Pabellón Costa",
    homeScore: null,
    awayScore: null,
    status: "scheduled"
  },
  {
    id: 4,
    date: "2024-02-18T18:00:00",
    homeTeamId: 2,
    awayTeamId: 3,
    location: "Polideportivo Central",
    homeScore: null,
    awayScore: null,
    status: "scheduled"
  },
  {
    id: 5,
    date: "2024-02-19T20:30:00",
    homeTeamId: 4,
    awayTeamId: 1,
    location: "Gimnasio Norte",
    homeScore: null,
    awayScore: null,
    status: "scheduled"
  },
  {
    id: 6,
    date: "2024-02-10T19:00:00",
    homeTeamId: 6,
    awayTeamId: 2,
    location: "Pabellón Costa",
    homeScore: 76,
    awayScore: 82,
    status: "finished",
    mvpPlayerId: 6
  }
]

// Datos mock para clasificación
export const standings = [
  { teamId: 2, wins: 8, losses: 2, pointsFor: 845, pointsAgainst: 765 },
  { teamId: 1, wins: 7, losses: 3, pointsFor: 832, pointsAgainst: 798 },
  { teamId: 3, wins: 6, losses: 4, pointsFor: 815, pointsAgainst: 802 },
  { teamId: 4, wins: 5, losses: 5, pointsFor: 788, pointsAgainst: 791 },
  { teamId: 5, wins: 3, losses: 7, pointsFor: 765, pointsAgainst: 832 },
  { teamId: 6, wins: 1, losses: 9, pointsFor: 712, pointsAgainst: 858 }
]

// Helper functions
export const getTeamById = (id) => teams.find(team => team.id === id)
export const getPlayerById = (id) => players.find(player => player.id === id)
export const getPlayersByTeam = (teamId) => players.filter(player => player.teamId === teamId)
export const getNextMatches = () => matches.filter(match => match.status === 'scheduled').slice(0, 3)
export const getRecentMatches = () => matches.filter(match => match.status === 'finished').slice(0, 5)