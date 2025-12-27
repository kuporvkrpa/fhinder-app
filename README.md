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

### Contract Address / コントラクトアドレス

**Address**: `0x2eeD268cC6C7065F32eEB719466BCBFFE800aCFb` / デプロイ待ち  
**Network**: Sepolia testnet / Sepoliaテストネット

### Contract Functions / コントラクト機能

The `DatingApp` contract manages user profiles and encrypted messages between users.

**Functions / 機能:**

- **`createProfile(avatar, socialLinks, description)`** / **`createProfile(avatar, socialLinks, description)`**
  - Create or update user profile / ユーザープロフィールを作成または更新
  - Stores avatar (IPFS hash or URL), social links (JSON), and description / アバター（IPFSハッシュまたはURL）、ソーシャルリンク（JSON）、説明を保存

- **`sendMessage(to, encryptedMessage, attestation)`** / **`sendMessage(to, encryptedMessage, attestation)`**
  - Send encrypted message to another user / 別のユーザーに暗号化されたメッセージを送信
  - Message is encrypted client-side using Zama FHE Relayer SDK / メッセージはZama FHE Relayer SDKを使用してクライアント側で暗号化されます
  - Stores encrypted message as bytes32 handle on-chain / 暗号化されたメッセージをbytes32ハンドルとしてオンチェーンに保存

- **`getProfile(user)`** / **`getProfile(user)`**
  - Get user profile information / ユーザープロフィール情報を取得
  - Returns: owner, avatar, socialLinks, description, exists, createdAt / 返り値：所有者、アバター、ソーシャルリンク、説明、存在フラグ、作成時刻

- **`getAllUsers()`** / **`getAllUsers()`**
  - Get all user addresses with profiles / プロフィールを持つすべてのユーザーアドレスを取得
  - Returns array of addresses / アドレスの配列を返す

- **`getSentMessages(user)`** / **`getSentMessages(user)`**
  - Get all messages sent by user / ユーザーが送信したすべてのメッセージを取得
  - Returns: recipient addresses, encrypted messages, timestamps / 返り値：受信者アドレス、暗号化されたメッセージ、タイムスタンプ

- **`getReceivedMessages(user)`** / **`getReceivedMessages(user)`**
  - Get all messages received by user / ユーザーが受信したすべてのメッセージを取得
  - Returns: sender addresses, encrypted messages, timestamps / 返り値：送信者アドレス、暗号化されたメッセージ、タイムスタンプ

## License

MIT

