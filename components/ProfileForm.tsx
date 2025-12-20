'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { getSigner } from '@/lib/provider'

const DATING_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_DATING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000').trim()

const DATING_ABI = [
  'function createProfile(string memory avatar, string memory socialLinks, string memory description) external',
  'function getProfile(address user) external view returns (address owner, string memory avatar, string memory socialLinks, string memory description, bool exists, uint256 createdAt)',
]

interface ProfileFormProps {
  onSuccess: () => void
}

export default function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { address, isConnected } = useAccount()
  const [avatar, setAvatar] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [socialLinks, setSocialLinks] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // проверяем размер (макс 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('File too large. Max 2MB')
        return
      }
      
      // проверяем тип
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      setAvatarFile(file)
      setError(null)

      // создаем preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarPreview(result)
        setAvatar(result) // сохраняем как data URL
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !address) {
      setError('Connect wallet first')
      return
    }

    // Проверяем размер данных
    if (avatar && avatar.length > 10000) {
      setError('Avatar data too large. Please use a URL instead or a smaller image.')
      return
    }

    if (description && description.length > 1000) {
      setError('Description too long. Max 1000 characters.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Проверяем адрес контракта
      if (!DATING_CONTRACT_ADDRESS || DATING_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error('Contract address not configured. Please set NEXT_PUBLIC_DATING_CONTRACT_ADDRESS')
      }

      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          if (chainId !== '0xaa36a7') {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }],
            })
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Chain not added, try to add it
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.drpc.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            })
            await new Promise(resolve => setTimeout(resolve, 2000))
          } else {
            throw new Error(`Failed to switch network: ${switchError.message}`)
          }
        }
      }

      const signer = await getSigner()
      const contract = new ethers.Contract(DATING_CONTRACT_ADDRESS, DATING_ABI, signer)
      
      // Ограничиваем размер данных для безопасности
      const avatarData = avatar && avatar.length > 5000 ? '' : (avatar || '')
      const socialLinksData = socialLinks || '{}'
      const descriptionData = description || ''
      
      // Проверяем, что контракт существует
      const code = await signer.provider.getCode(DATING_CONTRACT_ADDRESS)
      if (code === '0x') {
        throw new Error('Contract not found at this address. Please check NEXT_PUBLIC_DATING_CONTRACT_ADDRESS')
      }

      // Используем estimateGas для проверки перед отправкой
      try {
        await contract.createProfile.estimateGas(avatarData, socialLinksData, descriptionData)
      } catch (estimateError: any) {
        throw new Error(`Transaction will fail: ${estimateError.reason || estimateError.message || 'Unknown error'}`)
      }
      
      const tx = await contract.createProfile(avatarData, socialLinksData, descriptionData)
      await tx.wait()
      
      await onSuccess()
      
      setAvatar('')
      setAvatarFile(null)
      setAvatarPreview('')
      setSocialLinks('')
      setDescription('')
    } catch (err: any) {
      console.error('Profile creation error:', err)
      let errorMessage = 'Failed to create profile'
      
      if (err.reason) {
        errorMessage = err.reason
      } else if (err.message) {
        errorMessage = err.message
      } else if (err.data?.message) {
        errorMessage = err.data.message
      }
      
      // Более понятные сообщения об ошибках
      if (errorMessage.includes('missing revert data') || errorMessage.includes('CALL_EXCEPTION')) {
        errorMessage = 'Transaction failed. Please check: 1) Contract address is correct, 2) You are on Sepolia network, 3) You have enough ETH for gas'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Your Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar (optional)
          </label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border-2 border-pink-400 rounded-lg focus:border-pink-600 outline-none"
            />
            {avatarPreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img 
                  src={avatarPreview} 
                  alt="Avatar preview" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-pink-400"
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">Or enter URL (recommended for large images):</p>
            <input
              type="text"
              value={avatarFile ? '' : avatar}
              onChange={(e) => {
                if (!avatarFile) {
                  setAvatar(e.target.value)
                  setAvatarPreview('')
                }
              }}
              placeholder="https://example.com/avatar.jpg"
              disabled={!!avatarFile}
              className="w-full px-4 py-2 border-2 border-pink-400 rounded-lg focus:border-pink-600 outline-none disabled:opacity-50"
            />
            {avatar && avatar.startsWith('data:') && avatar.length > 5000 && (
              <p className="text-xs text-yellow-600 mt-1">
                ⚠️ Large image detected. Consider using a URL instead to avoid transaction issues.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Social Links (JSON, optional)
          </label>
          <textarea
            value={socialLinks}
            onChange={(e) => setSocialLinks(e.target.value)}
            placeholder='{"twitter": "https://twitter.com/username", "instagram": "https://instagram.com/username"}'
            className="w-full px-4 py-2 border-2 border-pink-400 rounded-lg focus:border-pink-600 outline-none"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">Format: JSON object with platform names and URLs</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-2 border-2 border-pink-400 rounded-lg focus:border-pink-600 outline-none"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !isConnected}
          className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-bold hover:from-pink-600 hover:to-pink-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Creating...' : 'Create Profile'}
        </button>
      </div>
    </form>
  )
}

