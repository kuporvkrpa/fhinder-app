'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'

interface Profile {
  owner: string
  avatar: string
  socialLinks: string
  description: string
  exists: boolean
  createdAt: number
}

interface ProfileCardProps {
  profile: Profile
  onMessage: (address: string) => void
}

export default function ProfileCard({ profile, onMessage }: ProfileCardProps) {
  const { address } = useAccount()
  const [showFull, setShowFull] = useState(false)

  if (!profile.exists) return null

  let socialLinksObj: any = {}
  try {
    if (profile.socialLinks) {
      socialLinksObj = JSON.parse(profile.socialLinks)
    }
  } catch {}

  const isOwnProfile = address?.toLowerCase() === profile.owner.toLowerCase()

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
      onClick={() => setShowFull(!showFull)}
    >
      <div className="flex items-start gap-4">
        {profile.avatar ? (
          <img 
            src={profile.avatar} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full object-cover border-2 border-pink-400"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=No+Photo'
            }}
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-3xl">
            💕
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800">
              {profile.owner.slice(0, 6)}...{profile.owner.slice(-4)}
            </h3>
            {!isOwnProfile && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMessage(profile.owner)
                }}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-bold hover:from-pink-600 hover:to-pink-700 transition-all"
              >
                💌 Message
              </button>
            )}
          </div>

          {profile.description && (
            <p className="text-gray-600 mb-2">
              {showFull ? profile.description : profile.description.slice(0, 100)}
              {profile.description.length > 100 && !showFull && '...'}
            </p>
          )}

          {showFull && Object.keys(socialLinksObj).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(socialLinksObj).map(([key, value]: [string, any]) => (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200"
                >
                  {key}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

