# ⛏️ Gloxx-Chain App

The **Gloxx Chain Application** is the official frontend interface for interacting with mining operations on the **G-Chain blockchain** — a next-generation, high-performance, quantum-resistant blockchain built for scalability, privacy, and interoperability.

This app allows users to:
- Start/stop mining operations
- Monitor node status, uptime, and hash rates
- Manage validator and staking settings
- Interact securely with the G-Chain API

---

## ⚙️ Tech Stack

| Technology       | Purpose                                     |
|------------------|---------------------------------------------|
| **Ionic Vue**    | Mobile-first UI framework for hybrid apps   |
| **TypeScript**   | Safer and scalable JavaScript alternative   |
| **G-Chain API**  | REST/GraphQL endpoints to interact with G-Chain protocol |
| **Capacitor**    | For mobile deployment and native plugins    |

---

## 📸 UI Preview

### 🧾 Dashboard (Mining Status)

> ![Dashboard Screenshot](samples/dashboard.png)

### 🛠 Validator Setup

> ![Validator Screenshot](samples/validator-setup.png)

### 📈 Node Performance Chart

> ![Node Stats Screenshot](samples/node-stats.png)

### 🔐 Wallet Integration & Signing

> ![Wallet Screenshot](samples/wallet.png)

---

## 🔌 Connecting to G-Chain

The app interacts with G-Chain through a custom API wrapper. Here's how the integration works:

### 🔗 API Architecture

- **REST Endpoints** for mining stats, user Actions and wallet actions
- **WebSockets** for real-time updates on block status and peer activity
- **Cryptographic Signing** using post-quantum secure algorithms (CRYSTALS-Dilithium or Falcon) **On Progress**
- **Local Storage** for key management (until a hardware wallet integration is added)

### 🧠 Example API Calls

```ts
// GET miner status
await fetch(`${API_URL}/miner/status?wallet=${userAddress}`);

// POST start mining
await fetch(`${API_URL}/miner/start`, {
  method: 'POST',
  body: JSON.stringify({ wallet: userAddress, power: 'high' }),
});

