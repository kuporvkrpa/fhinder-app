'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen p-4 flex items-center justify-center" style={{ 
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)'
    }}>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-7xl font-black mb-6" style={{ 
          color: '#ec4899',
          textShadow: '3px 3px 6px rgba(0,0,0,0.2)'
        }}>
          💕 FHINDER APP
        </h1>
        <p className="text-3xl mb-12 text-pink-600 font-bold">
          Find your love or STFU
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/home">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer">
              <div className="text-5xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Home</h2>
              <p className="text-gray-600">Browse all profiles</p>
            </div>
          </Link>

          <Link href="/me">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer">
              <div className="text-5xl mb-4">💕</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Me {'<3'}</h2>
              <p className="text-gray-600">Your profile</p>
            </div>
          </Link>

          <Link href="/about">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer">
              <div className="text-5xl mb-4">ℹ️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">About</h2>
              <p className="text-gray-600">Learn more</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

