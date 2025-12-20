'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import ProfileForm from '@/components/ProfileForm'

const DATING_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_DATING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000').trim()

const DATING_ABI = [
  'function getProfile(address user) external view returns (address owner, string memory avatar, string memory socialLinks, string memory description, bool exists, uint256 createdAt)',
  'function getSentMessages(address user) external view returns (address[] memory to, bytes32[] memory messages, uint256[] memory timestamps)',
  'function getReceivedMessages(address user) external view returns (address[] memory from, bytes32[] memory messages, uint256[] memory timestamps)',
]

interface Profile {
  owner: string
  avatar: string
  socialLinks: string
  description: string
  exists: boolean
  createdAt: number
}

export default function MePage() {
  const { address, isConnected } = useAccount()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProfileForm, setShowProfileForm] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      loadMyProfile()
    }
  }, [isConnected, address])

  const loadMyProfile = async () => {
    if (!address) return

    try {
      const provider = new ethers.JsonRpcProvider('https://sepolia.drpc.org')
      const contract = new ethers.Contract(DATING_CONTRACT_ADDRESS, DATING_ABI, provider)
      
      const [owner, avatar, socialLinks, description, exists, createdAt] = await contract.getProfile(address)
      
      if (exists) {
        setProfile({
          owner,
          avatar,
          socialLinks,
          description,
          exists,
          createdAt: Number(createdAt),
        })
        setShowProfileForm(false)
      } else {
        setShowProfileForm(true)
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setLoading(false)
    }
  }

  let socialLinksObj: any = {}
  try {
    if (profile?.socialLinks) {
      socialLinksObj = JSON.parse(profile.socialLinks)
    }
  } catch {}

  if (!isConnected) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)'
      }}>
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <p className="text-xl mb-4">Connect your wallet to see your profile</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center" style={{ 
        background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)'
      }}>
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4" style={{ 
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)'
    }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-center mb-8" style={{ 
          color: '#ec4899',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          💕 Me {'<3'}
        </h1>

        {showProfileForm ? (
          <ProfileForm onSuccess={() => {
            loadMyProfile()
          }} />
        ) : profile && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start gap-6 mb-6">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-400"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128?text=No+Photo'
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-5xl">
                  💕
                </div>
              )}
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile.owner.slice(0, 6)}...{profile.owner.slice(-4)}
                </h2>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-bold hover:from-pink-600 hover:to-pink-700"
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </div>

            {profile.description && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">About Me</h3>
                <p className="text-gray-600">{profile.description}</p>
              </div>
            )}

            {Object.keys(socialLinksObj).length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Social Links</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(socialLinksObj).map(([key, value]: [string, any]) => (
                    <a
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200 font-bold"
                    >
                      {key}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Member since: {new Date(profile.createdAt * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

