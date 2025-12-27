// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Dating application with encrypted messages / 暗号化されたメッセージでデートアプリケーション
contract DatingApp {
    struct Profile {
        address owner;
        string avatar; // IPFS hash or URL / IPFSハッシュまたはURL
        string socialLinks; // JSON string with links / リンクを含むJSON文字列
        string description; // Profile description / プロフィール説明
        bool exists;
        uint256 createdAt;
    }

    struct Message {
        address from;
        address to;
        bytes32 encryptedMessage; // Encrypted message / 暗号化されたメッセージ
        uint256 timestamp;
    }

    mapping(address => Profile) public profiles;
    mapping(address => Message[]) public sentMessages; // Messages sent by user / ユーザーが送信したメッセージ
    mapping(address => Message[]) public receivedMessages; // Messages received by user / ユーザーが受信したメッセージ
    address[] public allUsers; // All users with profiles / プロフィールを持つすべてのユーザー

    event ProfileCreated(address indexed user);
    event ProfileUpdated(address indexed user);
    event MessageSent(address indexed from, address indexed to, bytes32 encryptedMessage);

    // Create or update profile / プロフィールを作成または更新
    function createProfile(
        string memory avatar,
        string memory socialLinks,
        string memory description
    ) external {
        if (!profiles[msg.sender].exists) {
            allUsers.push(msg.sender);
        }

        profiles[msg.sender] = Profile({
            owner: msg.sender,
            avatar: avatar,
            socialLinks: socialLinks,
            description: description,
            exists: true,
            createdAt: profiles[msg.sender].exists ? profiles[msg.sender].createdAt : block.timestamp
        });

        if (!profiles[msg.sender].exists) {
            emit ProfileCreated(msg.sender);
        } else {
            emit ProfileUpdated(msg.sender);
        }
    }

    // Send encrypted message / 暗号化されたメッセージを送信
    function sendMessage(
        address to,
        bytes32 encryptedMessage,
        bytes calldata /* attestation */
    ) external {
        require(profiles[msg.sender].exists, "Create profile first");
        require(profiles[to].exists, "Recipient has no profile");
        require(encryptedMessage != bytes32(0), "Invalid message");
        require(to != msg.sender, "Cannot message yourself");

        Message memory newMessage = Message({
            from: msg.sender,
            to: to,
            encryptedMessage: encryptedMessage,
            timestamp: block.timestamp
        });

        sentMessages[msg.sender].push(newMessage);
        receivedMessages[to].push(newMessage);

        emit MessageSent(msg.sender, to, encryptedMessage);
    }

    // Get profile / プロフィールを取得
    function getProfile(address user) external view returns (
        address owner,
        string memory avatar,
        string memory socialLinks,
        string memory description,
        bool exists,
        uint256 createdAt
    ) {
        Profile memory profile = profiles[user];
        return (
            profile.owner,
            profile.avatar,
            profile.socialLinks,
            profile.description,
            profile.exists,
            profile.createdAt
        );
    }

    // Get all profiles / すべてのプロフィールを取得
    function getAllUsers() external view returns (address[] memory) {
        return allUsers;
    }

    // Get user messages / ユーザーのメッセージを取得
    function getSentMessages(address user) external view returns (
        address[] memory to,
        bytes32[] memory messages,
        uint256[] memory timestamps
    ) {
        Message[] memory msgs = sentMessages[user];
        to = new address[](msgs.length);
        messages = new bytes32[](msgs.length);
        timestamps = new uint256[](msgs.length);

        for (uint256 i = 0; i < msgs.length; i++) {
            to[i] = msgs[i].to;
            messages[i] = msgs[i].encryptedMessage;
            timestamps[i] = msgs[i].timestamp;
        }
    }

    // Get received messages / 受信したメッセージを取得
    function getReceivedMessages(address user) external view returns (
        address[] memory from,
        bytes32[] memory messages,
        uint256[] memory timestamps
    ) {
        Message[] memory msgs = receivedMessages[user];
        from = new address[](msgs.length);
        messages = new bytes32[](msgs.length);
        timestamps = new uint256[](msgs.length);

        for (uint256 i = 0; i < msgs.length; i++) {
            from[i] = msgs[i].from;
            messages[i] = msgs[i].encryptedMessage;
            timestamps[i] = msgs[i].timestamp;
        }
    }
}
