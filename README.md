<div align="center">

# Weatherly

A sleek, modern weather app with real-time forecasts and beautiful visual effects.

**Live Demo: https://theWeatherly.vercel.app**

<br>

<video src="https://github.com/user-attachments/assets/c4d2ff0d-6256-42fb-99fd-892d78f73829" width="100%" autoplay loop muted></video>

</div>

---

## Features

### Current Weather
- Real-time temperature with high/low range for the day
- Feels-like temperature and current weather status
- Weather-appropriate emoji icons for every condition

### Detail Cards
- **Wind** - Speed (km/h or mph) and compass direction
- **Humidity** - Percentage with comfort level indicator (Dry / Comfortable / High)
- **UV Index** - Numeric value with severity label (Low → Extreme)
- **Visibility** - Distance in km rated as Excellent, Good, or Poor
- **Precipitation** - Chance of rain percentage
- **Feels Like** - Apparent temperature compared to actual

### Sun Tracker
- Sunrise and sunset times for the current location
- Animated progress bar showing the sun's position throughout the day
- Total daylight hours and minutes

### Hourly Forecast
- Scrollable 24-hour forecast from the current hour
- Temperature, weather icon, and precipitation chance per hour
- Current hour highlighted

### 7-Day Forecast
- Daily rows with high/low temperatures and weather icons
- Visual temperature bar showing the range relative to the week
- Precipitation totals for each day

### Live Weather Effects
Canvas-rendered visual effects that react to the current conditions:
- **Rain** - Layered raindrops with splash particles that hit UI cards
- **Snow** - Drifting snowflakes with varying sizes and speeds
- **Thunderstorm** - Rain combined with randomized lightning flashes
- **Fog** - Animated translucent fog layers
- **Sun Rays** - Soft animated light rays on clear days
- **Stars** - Twinkling night sky on clear nights

### Other
- **Unit Toggle** - Switch between °C/km/h and °F/mph
- **City Search** - Look up any location by name
- **Geolocation** - One-click weather for your current position
- **Responsive** - Adapts from desktop to mobile (breakpoint at 700px)
- **Dynamic Backgrounds** - Gradient shifts between day and night themes

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML, CSS, JavaScript - no frameworks, no build step |
| **Weather Data** | [Open-Meteo API](https://open-meteo.com/) |
| **Geocoding** | [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) |
| **Typography** | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| **Visual Effects** | HTML5 Canvas (dual-layer for depth) |
| **Icons** | [Basmilius Weather Icons](https://github.com/basmilius/weather-icons) v3.0 (fill) via bmcdn.nl CDN |

The app is split into clean separate files (`index.html` + `style.css` + `script.js`). No dependencies, no bundler, no package.json, and **no API keys required**. Just open it in a browser and it works.

---

## Getting Started
To use the website, visit https://theWeatherly.vercel.app. Or, to store it locally:

1. Clone the repo:
   ```sh
   git clone https://github.com/JadXV/Weatherly.git
   ```
2. Open `index.html` in your browser
3. Search for a city or click the location button
