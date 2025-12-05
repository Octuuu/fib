import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Teams from './pages/Teams'
import TeamDetail from './pages/TeamDetail'
import Calendar from './pages/Calendar'
import About from './pages/About'
import BasketballSchool from './pages/BasketballSchool'
import MatchDetails from './pages/MatchDetails'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipos" element={<Teams />} />
          <Route path="/equipo/:id" element={<TeamDetail />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/conocenos" element={<About />} />
          <Route path="/escuela" element={<BasketballSchool />} />
          <Route path="/partido/:matchId" element={<MatchDetails />} />
        </Routes>
      </main>

    </div>
  )
}

export default App