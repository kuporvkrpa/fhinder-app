# 💕 Fhinder App - Find Your Love or STFU

A decentralized dating platform with encrypted messages using Zama FHE technology.

## What's this?

Fhinder App is a dating app where you can find your love... or STFU. All messages are encrypted using Fully Homomorphic Encryption (FHE) so nobody can read them until you want them to.

## Features

- 🔐 **Encrypted Messages**: All messages are encrypted using Zama FHE technology
- 💕 **Profile Creation**: Create your profile with avatar, description, and social links
- 👀 **Browse Profiles**: See all profiles on the home page
- 💌 **Send Secret Messages**: Send encrypted messages to people you like
- 🔒 **Privacy First**: Your messages stay secret until the recipient reads them

## How it works

1. **Create Profile**: Set up your profile with an avatar (file upload or URL), social links, and a description
2. **Browse Profiles**: See other profiles on the home page
3. **Send Encrypted Messages**: If you like someone, send them an encrypted message
4. **Privacy**: Your messages are encrypted on blockchain - super private!

## Setup

### Install dependencies

```bash
npm install
```

### Compile contract

```bash
npm run compile
```

### Deploy contract

```bash
npm run deploy:dating
```

### Run locally

```bash
npm run dev
```

## Environment Variables

Create `.env.local`:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.drpc.org
NEXT_PUBLIC_DATING_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain**: Hardhat, Ethers.js
- **FHE**: Zama FHEVM Relayer
- **Network**: Sepolia testnet
- **Wallet**: Wagmi, RainbowKit

## Project Structure

```
├── app/
│   ├── about/        # About page
│   ├── home/         # All profiles page
│   ├── me/           # User profile page
│   └── page.tsx      # Landing page
├── components/       # React components
├── contracts/        # Solidity smart contracts
├── lib/              # Utilities
└── scripts/          # Deployment scripts
```

## Smart Contract

The `DatingApp` contract manages:
- User profiles (avatar, social links, description)
- Encrypted messages between users
- Profile creation and updates

## License

MIT

