# 🌌 SkyApp – Celestial Star Map & Augmented Reality Planetarium

A high-performance, mobile-first celestial star map and augmented reality planetarium web application that lets you maneuver through the stars, identify constellations in real-time, view tonight's sky highlights, and overlay celestial bodies using your device's camera.

---

## ✨ Features

- **360° Celestial Sphere Maneuvering**: Drag, pan, and zoom through the celestial sphere with pitch and yaw controls.
- **Augmented Reality (AR) Camera Mode**: Stream live video from your device camera and overlay stars, constellations, and celestial markers directly onto the night sky.
- **Tonight's Sky Highlights**: Live calculations based on your geographic location and local sidereal time to show exactly which stars and constellations are currently visible above your horizon.
- **Constellation Overlay**: Interactive line connections and asterism drawings for major constellations (Orion, Crux / Southern Cross, Ursa Major, Cassiopeia, Scorpius, Gemini, and more).
- **Star Inspector Modal**: Detailed astronomical data for catalog stars including apparent magnitude, distance in light-years, spectral class, and constellation membership.
- **Night Vision Mode**: Astronomical red-light filter mode to preserve dark-adapted vision while stargazing outdoors.
- **Device Orientation & Compass**: Synchronize celestial view with device sensors (compass and gyroscope) on mobile devices.
- **Offline PWA Support**: Built with Service Worker caching (`sw.js`) and Web Manifest (`manifest.json`) for full offline use without an active internet connection.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5 & Canvas 2D / WebGL** | Real-time high frame rate celestial sphere rendering |
| **Vanilla JavaScript (ES6+)** | Astronomical math (Julian Dates, Greenwich Sidereal, Alt/Azimuth transforms) |
| **Tailwind CSS** | Sleek, dark-mode HUD interface with glassmorphism effects |
| **Lucide Icons** | Clean vector iconography |
| **MediaDevices API** | Real-time camera streaming for AR overlay |
| **Service Workers & PWA** | Offline functionality on mobile and desktop |

---

## 🚀 Quick Start

### 1. Run Locally

SkyApp is completely client-side and requires no build steps or heavy dependencies:

```bash
# Using Python's built-in HTTP server:
cd "StarMaps/sky-app"
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your web browser.

### 2. Mobile / PWA Installation

1. Open the URL in Safari (iOS) or Chrome (Android).
2. Tap **Share** or **Options** → **Add to Home Screen**.
3. Launch from your home screen for full-screen immersive stargazing even with no mobile data!

---

## 📱 Controls & Shortcuts

- **Mouse Drag / Touch Pan**: Rotate celestial viewpoint (Azimuth & Altitude).
- **Mouse Wheel / Pinch**: Zoom in/out (adjust Field of View).
- **Click / Tap on Star**: Open detailed star specifications card.
- **Camera Icon (AR)**: Activate live camera passthrough background.
- **Eye Icon**: Toggle red night-vision filter.
- **Compass Icon**: Sync with device gyroscope / compass sensors.
- **Search Bar**: Quickly jump and smoothly pan to any star by name.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
