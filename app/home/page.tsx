'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import ProfileCard from '@/components/ProfileCard'
import MessageModal from '@/components/MessageModal'

const DATING_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_DATING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000').trim()

const DATING_ABI = [
  'function getAllUsers() external view returns (address[] memory)',
  'function getProfile(address user) external view returns (address owner, string memory avatar, string memory socialLinks, string memory description, bool exists, uint256 createdAt)',
]

interface Profile {
  owner: string
  avatar: string
  socialLinks: string
  description: string
  exists: boolean
  createdAt: number
}

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [messageTo, setMessageTo] = useState<string | null>(null)
  const [relayerInstance, setRelayerInstance] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (typeof global === 'undefined') {
        (window as any).global = globalThis
      }
      initRelayer()
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
      loadProfiles()
    }
  }, [isConnected])

  const initRelayer = async () => {
    try {
      const relayerModule = await import('@zama-fhe/relayer-sdk/web')
      const sdkInitialized = await relayerModule.initSDK()
      if (!sdkInitialized) {
        throw new Error('SDK init failed')
      }
      const instance = await relayerModule.createInstance(relayerModule.SepoliaConfig)
      setRelayerInstance(instance)
    } catch (err) {
      console.log('Relayer init failed')
    }
  }

  const loadProfiles = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('https://sepolia.drpc.org')
      const contract = new ethers.Contract(DATING_CONTRACT_ADDRESS, DATING_ABI, provider)
      
      const users = await contract.getAllUsers()
      const profilesList: Profile[] = []

      for (const user of users) {
        try {
          const [owner, avatar, socialLinks, description, exists, createdAt] = await contract.getProfile(user)
          if (exists) {
            profilesList.push({
              owner,
              avatar,
              socialLinks,
              description,
              exists,
              createdAt: Number(createdAt),
            })
          }
        } catch (err) {
          console.error('Failed to load profile:', err)
        }
      }

      setProfiles(profilesList)
    } catch (err) {
      console.error('Failed to load profiles:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMessage = (to: string) => {
    if (!relayerInstance) {
      alert('Relayer not ready. Please wait...')
      return
    }
    setMessageTo(to)
  }

  return (
    <div className="min-h-screen p-4" style={{ 
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)'
    }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-center mb-6" style={{ 
          color: '#ec4899',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          💕 All Profiles
        </h1>

        {!isConnected ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <p className="text-xl mb-4">Connect your wallet to see profiles</p>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="text-center p-8">
                <p className="text-xl">Loading profiles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <ProfileCard
                    key={profile.owner}
                    profile={profile}
                    onMessage={handleMessage}
                  />
                ))}
              </div>
            )}

            {profiles.length === 0 && !loading && (
              <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <p className="text-xl text-gray-600">No profiles yet. Be the first!</p>
              </div>
            )}
          </>
        )}

        {messageTo && relayerInstance && (
          <MessageModal
            to={messageTo}
            onClose={() => setMessageTo(null)}
            relayerInstance={relayerInstance}
          />
        )}
      </div>
    </div>
  )
}



