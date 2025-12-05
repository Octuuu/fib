import React from 'react'
import HeroSection from '../components/home/HeroSection'
import NextMatches from '../components/home/NextMatches'
import RecentMatches from '../components/home/RecentMatches'
import TopPlayers from '../components/home/TopPlayers'
import StandingsTable from '../components/home/StandingsTable'
import { useMatches } from '../hooks/useMatches'

const Home = () => {
  const { matches, loading, error, getNextMatches, getRecentMatches } = useMatches()
  const nextMatches = getNextMatches()
  const recentMatches = getRecentMatches()

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <section className="py-16 bg-white">
        <RecentMatches matches={recentMatches} loading={loading} />
      </section>
      
      <section className="py-16 bg-gray-50">
        <NextMatches matches={nextMatches} loading={loading} />
      </section>
      
      <section className="py-16 bg-white">
        <TopPlayers />
      </section>
      
      <section className="py-16 bg-gray-50">
        <StandingsTable />
      </section>
      
    
    </div>
  )
}

export default Home