'use client'

export default function AboutPage() {
  return (
    <div className="min-h-screen p-4" style={{ 
      background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)'
    }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-center mb-8" style={{ 
          color: '#ec4899',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          💕 About Fhinder App
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">What is this?</h2>
            <p className="text-gray-700 text-lg">
              Fhinder App is a dating app where you can find your love... or STFU. 
              All messages are encrypted using fancy math (FHE - Fully Homomorphic Encryption) 
              so nobody can read them until you want them to.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">How it works?</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 text-lg">
              <li>Create your profile with avatar, description, and social links</li>
              <li>Browse other profiles on the home page</li>
              <li>Send encrypted messages to people you like</li>
              <li>Your messages are encrypted on blockchain - super private!</li>
              <li>Only the recipient can decrypt and read your message</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Why encrypted?</h2>
            <p className="text-gray-700 text-lg">
              Because privacy matters! Your messages stay secret until the recipient reads them. 
              Even we can't see what you're sending. It's all encrypted using Zama's FHE technology 
              and stored on blockchain.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Tech stuff</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-lg">
              <li>Frontend: Next.js, React, TypeScript</li>
              <li>Blockchain: Hardhat, Ethers.js</li>
              <li>Encryption: Zama FHEVM Relayer</li>
              <li>Network: Sepolia testnet</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Made with 💕 and encrypted messages
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



