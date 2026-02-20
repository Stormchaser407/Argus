_This file has been updated for Project Argus. The original README from `telegram-tt` is preserved as `README.original.md`._

# Project Argus

**Project Argus** is a specialized, custom-built Telegram client designed for investigators, threat researchers, and public safety professionals. It focuses on critical operational gaps in digital investigations, specifically concerning missing children, human trafficking, and scam detection.

## 🏗 Architecture

Argus is built on a modern, high-performance stack:
- **Base:** Forked from [Telegram Web A (telegram-tt)](https://github.com/Ajaxy/telegram-tt), utilizing TypeScript and Teact.
- **Desktop Wrapper:** [Tauri](https://tauri.app/) for a lightweight, secure, and performant Windows desktop experience.
- **Core Logic:** [GramJS](https://github.com/gram-js/GramJS) for direct MTProto API interaction.
- **Plugin System:** A modular architecture allowing investigative features to be developed and maintained independently of the core Telegram client.

## 🛠 Features (Phase 0 Foundation)

This repository contains the foundation for Project Argus, including:
- **Modular Plugin Architecture:** Located in `src/plugins/`, allowing for clean separation of investigative tools.
- **Tauri Integration:** Ready for native desktop builds.
- **Secure Configuration:** Environment-based credential management.

### Planned Modules
- **Investigator Toolkit:** User profiling, account age analysis, and group membership viewing.
- **Scam Sniffer:** Real-time scanning of crypto wallets (Chainabuse) and URLs (VirusTotal/Google Safe Browsing).
- **Evidence Preservation:** Forensic-grade archiving, media extraction, and chain-of-custody logging.

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- Rust (for Tauri desktop builds)
- Telegram API Credentials (API_ID and API_HASH)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your Telegram API credentials
   ```

### Development
Run the web version in development mode:
```bash
npm run dev
```

Run the Tauri desktop app:
```bash
npm run tauri dev
```

## ⚖️ License
This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

---
*Built for investigators. Focused on protection.*
