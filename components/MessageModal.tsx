'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { getSigner } from '@/lib/provider'

const DATING_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_DATING_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000').trim()

const DATING_ABI = [
  'function sendMessage(address to, bytes32 encryptedMessage, bytes calldata attestation) external',
]

interface MessageModalProps {
  to: string
  onClose: () => void
  relayerInstance: any
}

export default function MessageModal({ to, onClose, relayerInstance }: MessageModalProps) {
  const { address, isConnected } = useAccount()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!message.trim() || !isConnected || !address || !relayerInstance) {
      setError('Enter message and ensure relayer is ready')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // шифруем сообщение через FHE
      // для текста нужно закодировать в число или использовать несколько uint8
      // упрощенный вариант - берем первые 32 байта сообщения
      const messageBytes = new TextEncoder().encode(message.slice(0, 32))
      let encodedValue = 0
      for (let i = 0; i < Math.min(messageBytes.length, 4); i++) {
        encodedValue |= (messageBytes[i] << (i * 8))
      }

      const inputBuilder = relayerInstance.createEncryptedInput(DATING_CONTRACT_ADDRESS, address)
      inputBuilder.add32(encodedValue)
      const encryptedInput = await Promise.race([
        inputBuilder.encrypt(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Encryption timeout')), 30000)
        )
      ]) as any

      if (!encryptedInput?.handles || encryptedInput.handles.length === 0) {
        throw new Error('Encryption failed')
      }

      const encryptedHandle = encryptedInput.handles[0]
      const attestation = encryptedInput.inputProof

      // переключаемся на Sepolia
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' })
          if (chainId !== '0xaa36a7') {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }],
            })
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        } catch {}
      }

      const signer = await getSigner()
      const contract = new ethers.Contract(DATING_CONTRACT_ADDRESS, DATING_ABI, signer)
      
      await contract.sendMessage(to, encryptedHandle, attestation)
      
      setMessage('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Send Encrypted Message</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            To: {to.slice(0, 6)}...{to.slice(-4)}
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message (max 32 chars)..."
            className="w-full px-4 py-2 border-2 border-pink-400 rounded-lg focus:border-pink-600 outline-none"
            rows={4}
            maxLength={32}
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/32 characters</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || !message.trim() || !relayerInstance}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg font-bold hover:from-pink-600 hover:to-pink-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

