https://github.com/Justintoptier/Zenshin/blob/main/zenshin.mp4

<h1 align="center">⚡ Zenshin</h1>

<p align="center">
  <em>Your premium dark-themed workout tracker — built with React Native & Expo</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-Local_DB-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
</p>

---

## 🎯 What is Zenshin?

**Zenshin** (前進 — *"progress"* in Japanese) is a sleek, dark-themed fitness tracking app designed for serious lifters. It features a **5-day workout split**, per-set tracking, real-time progress history, and a dashboard that keeps you motivated.

> *"Discipline today. Strength tomorrow."*

---

## ✨ Features

### 🏠 Dashboard Home
- **Cinematic hero card** with motivational greeting and workout split badge
- **Workout Streak** tracker with flame animation
- **Last Workout** quick-view card
- **Today's Focus** with split-specific training tips
- **Weekly Snapshot** — workouts completed, total volume lifted, best lift
- **Quick Start** button to jump into logging

### 💪 Smart Workout Logging
- Today's exercises auto-loaded from your **5-day split** (Push / Pull / Legs / Upper / Lower)
- **Expandable exercise rows** — tap to add sets
- Per-set **reps + weight** input
- **Save** button logs directly to local SQLite database
- Visual feedback with completion badges

### 📊 Day-by-Day Progress
- Workouts grouped by date with **TODAY / YESTERDAY** smart labels
- Tap any exercise to **toggle set history** (reps × weight table)
- Auto-refreshes when switching tabs

### 👤 Creative Profile
- **Gradient avatar ring** (green → cyan → lime)
- Live **stats cards** — total logged, training days, unique exercises
- Personal info form with goal tracking

### 🎨 Premium Design System
- **Outfit** font family (Google Fonts) — geometric, modern, clean
- **Dancing Script** cursive accents on titles and highlights
- Deep dark palette (`#0a0e17`) with neon green (`#22c55e`) accents
- Glassmorphic cards with green glow accent lines
- Smooth **Reanimated** fade-in and spring animations
- Green gradient buttons with shadow glow

---

## 🏋️ Workout Split

| Day       | Split   | Focus                    |
|-----------|---------|--------------------------|
| Monday    | 🛌 Rest | Recovery                 |
| Tuesday   | Push    | Chest · Shoulders · Triceps |
| Wednesday | Pull    | Back · Biceps · Rear Delts |
| Thursday  | Legs    | Quads · Hamstrings · Calves |
| Friday    | 🛌 Rest | Recovery                 |
| Saturday  | Upper   | Chest · Back · Arms      |
| Sunday    | Lower   | Quads · Hamstrings · Glutes |

> Every workout includes **Abs Cruncher** and **Cardio** at the end.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native 0.81 | Cross-platform mobile UI |
| Expo SDK 54 | Dev tooling & native modules |
| React Navigation 7 | Tab navigation |
| expo-sqlite | Local database for workouts & profile |
| react-native-reanimated | Smooth animations |
| expo-linear-gradient | Gradient overlays & buttons |
| @expo-google-fonts | Outfit + Dancing Script fonts |
| @expo/vector-icons | Ionicons icon set |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone

### Installation

```bash
# Clone the repo
git clone https://github.com/Justintoptier/Zenshin.git
cd Zenshin

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

---

## 📁 Project Structure

```
zenshin/
├── App.js                    # Root — font loading, navigation, theme
├── assets/images/            # Hero image, banner
├── components/
│   ├── HeaderCard.js         # Cinematic hero card with gradient overlay
│   └── ExerciseRow.js        # Expandable exercise with set tracking
├── constants/
│   ├── theme.js              # Colors, fonts, spacing, radius tokens
│   └── workoutSplit.js       # 5-day split exercise definitions
├── database/
│   └── db.js                 # SQLite — workouts, profile, stats queries
└── screens/
    ├── HomeScreen.js          # Dashboard with streak, stats, focus cards
    ├── LogScreen.js           # Exercise list with per-set logging
    ├── ProgressScreen.js      # Day-by-day workout history
    └── ProfileScreen.js       # Avatar, stats, personal info form
```

---

## 📄 License

This project is for personal use.

---

<p align="center">
  Built with 💚 by <strong>Justin</strong>
</p>
