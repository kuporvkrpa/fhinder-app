'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <header className="w-full sticky top-0 z-50" style={{ 
      background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
      borderBottom: '3px solid #db2777',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center text-xl font-black rounded" style={{
            background: '#fff',
            border: '2px solid #db2777',
            boxShadow: '2px 2px 0px #db2777'
          }}>
            💕
          </div>
          <span className="text-xl font-black text-white">
            FHINDER APP
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="/home"
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              pathname === '/home'
                ? 'bg-white text-pink-600'
                : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            Home
          </Link>
          <Link
            href="/me"
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              pathname === '/me'
                ? 'bg-white text-pink-600'
                : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            Me {'<3'}
          </Link>
          <Link
            href="/about"
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              pathname === '/about'
                ? 'bg-white text-pink-600'
                : 'text-white hover:bg-white hover:bg-opacity-20'
            }`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}

