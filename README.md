# Mouse IoT

A compact IoT monitoring dashboard for **live video surveillance** and **real-time temperature & humidity monitoring**. Built with Next.js, Firebase Realtime Database, and ESP32 microcontrollers.

## ✨ Features

### 🔐 Authentication

- Email & password login via **Firebase Authentication**
- Server-side session management with secure HTTP-only cookies
- Protected routes — unauthenticated users are redirected to login

### 📊 Dashboard

- **Device Status Monitoring** — Real-time connection status for:
  - ESP32-Wroom (sensor microcontroller)
  - ESP32-Cam (camera module)
  - Firebase Realtime Database
- **Environment Data** — Live temperature (°C) and humidity (%) readings from DHT sensors
- **Latest Snapshot** — Quick preview of the camera stream

### 📷 Camera

- **Live Video Streaming** from ESP32-Cam via MJPEG
- **Hardware Controls:**
  - Toggle LED flash on/off
  - Change camera resolution (QVGA to UXGA)
  - Restart camera module
  - Take snapshot

### 🌡️ Temperature & Humidity

- **Realtime Values** — Current temperature and humidity with status indicators (Cold/Warm/Critical, Dry/Normal/Humid)
- **Line Chart** — Historical data visualization with time range filters (1h, 6h, 12h, 24h)
- **Statistics Summary** — Highest, lowest, and average values for both temperature and humidity

## 🛠️ Tech Stack

| Category      | Technology                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org) (App Router)                                               |
| Language      | TypeScript                                                                                  |
| Styling       | Tailwind CSS v4                                                                             |
| Database      | Firebase Realtime Database                                                                  |
| Auth          | Firebase Authentication + Firebase Admin SDK                                                |
| Charts        | Recharts                                                                                    |
| UI Components | Custom NeoBrutalism component library from https://retroui.dev/ & https://neobrutalism.dev/ |
| Form Handling | React Hook Form + Zod validation                                                            |
| Hardware      | ESP32-Wroom (sensors), DHT22 (temp & humidity sensors), ESP32-Cam (camera)                  |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/)
- A [Firebase](https://firebase.google.com/) project with:
  - Realtime Database enabled
  - Authentication (Email/Password) enabled
  - A service account key
- ESP32-Wroom with DHT sensor (for temperature & humidity data)
- ESP32-Cam (for camera streaming) — optional

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Vocxss/mouse-iot.git
   cd mouse-iot
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables**

   Copy the example environment file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   See [`.env.example`](.env.example) for all required variables.

4. **Run the development server**

   ```bash
   npm run dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command          | Description                 |
| ---------------- | --------------------------- |
| `npm run dev`    | Start development server    |
| `npm run build`  | Build for production        |
| `npm run start`  | Start production server     |
| `npm run lint`   | Run Biome linter            |
| `npm run format` | Auto-format code with Biome |

## 🔧 Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database** and set your region
3. Enable **Authentication** → Email/Password sign-in method
4. Go to **Project Settings** → **Service Accounts** → **Generate new private key**
5. Copy the values from the downloaded JSON into your `.env` file

### Database Structure

The Firebase Realtime Database expects data in this structure:

```
/
├── temp         # Current temperature (number, e.g. 27.5)
├── humid        # Current humidity (number, e.g. 65)
└── log_ruangan/ # Historical log entries (auto-generated push keys)
    └── <push_key>
        ├── suhu        # Temperature reading (number)
        ├── kelembapan  # Humidity reading (number)
        └── timestamp   # Unix timestamp (number)
```

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Muh Tsaqif Hafidz
