let currentEffect = null;
const fxCanvas = document.getElementById('fx-canvas');
const fxCtx = fxCanvas.getContext('2d');
const fxFront = document.getElementById('fx-canvas-front');
const fxFrontCtx = fxFront.getContext('2d');
let fxParticles = [];
let fxFrontParticles = [];
let fxSplashes = [];
let fxAnimId = null;

function resizeFx() {
    fxCanvas.width = fxFront.width = window.innerWidth;
    fxCanvas.height = fxFront.height = window.innerHeight;
}
window.addEventListener('resize', resizeFx);
resizeFx();

function clearEffects() {
    if (fxAnimId) cancelAnimationFrame(fxAnimId);
    fxAnimId = null;
    fxParticles = [];
    fxFrontParticles = [];
    fxSplashes = [];
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    fxFrontCtx.clearRect(0, 0, fxFront.width, fxFront.height);
    document.getElementById('lightning-flash').classList.remove('on');
    currentEffect = null;
}

function startRain(intensity = 1) {
    clearEffects();
    fxSplashes = [];
    currentEffect = 'rain';
    const splashSelectors = '.hero-card, .detail-grid, .sun-card, .daily-list';
    let splashZones = [];
    let zoneFrame = 0;
    function refreshZones() {
        splashZones = [];
        document.querySelectorAll(splashSelectors).forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) splashZones.push({ left: r.left, right: r.right, top: r.top });
        });
    }
    const backCount = Math.floor(110 * intensity);
    for (let i = 0; i < backCount; i++) {
        fxParticles.push({ x: Math.random() * fxCanvas.width, y: Math.random() * fxCanvas.height * -0.5,
            len: 14 + Math.random() * 20, speed: 7 + Math.random() * 9,
            opacity: 0.12 + Math.random() * 0.2, drift: -1.5 - Math.random() * 2 });
    }
    const frontCount = Math.floor(30 * intensity);
    for (let i = 0; i < frontCount; i++) {
        fxFrontParticles.push({ x: Math.random() * fxCanvas.width, y: Math.random() * fxCanvas.height * -0.3,
            len: 20 + Math.random() * 26, speed: 10 + Math.random() * 10,
            opacity: 0.08 + Math.random() * 0.15, drift: -2 - Math.random() * 2.5, width: 1.6 + Math.random() * 0.8 });
    }
    function spawnSplash(x, y) {
        const n = 3 + Math.floor(Math.random() * 4);
        for (let i = 0; i < n; i++) {
            const angle = -Math.PI * (0.1 + Math.random() * 0.8);
            const speed = 1.5 + Math.random() * 3;
            fxSplashes.push({ x, y, vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
                vy: Math.sin(angle) * speed, r: 1 + Math.random() * 1.5,
                life: 1, decay: 0.03 + Math.random() * 0.03, gravity: 0.12 });
        }
    }
    function frame() {
        fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        fxFrontCtx.clearRect(0, 0, fxFront.width, fxFront.height);
        zoneFrame++;
        if (zoneFrame <= 60 && zoneFrame % 10 === 0) refreshZones();
        else if (zoneFrame % 120 === 0) refreshZones();
        for (const p of fxParticles) {
            fxCtx.beginPath(); fxCtx.moveTo(p.x, p.y);
            fxCtx.lineTo(p.x + p.drift * 0.6, p.y + p.len);
            fxCtx.strokeStyle = `rgba(174,194,224,${p.opacity})`; fxCtx.lineWidth = 1.3; fxCtx.stroke();
            p.y += p.speed; p.x += p.drift * 0.3;
            const bottomY = p.y + p.len; let splashed = false;
            for (const z of splashZones) {
                if (p.x >= z.left && p.x <= z.right && bottomY >= z.top && p.y < z.top + 10) { spawnSplash(p.x, z.top); splashed = true; break; }
            }
            if (!splashed && p.y > fxCanvas.height && Math.random() < 0.25) spawnSplash(p.x, fxCanvas.height);
            if (splashed || p.y > fxCanvas.height) { p.y = Math.random() * -150 - 20; p.x = Math.random() * fxCanvas.width; }
        }
        for (const p of fxFrontParticles) {
            fxFrontCtx.beginPath(); fxFrontCtx.moveTo(p.x, p.y);
            fxFrontCtx.lineTo(p.x + p.drift * 0.6, p.y + p.len);
            fxFrontCtx.strokeStyle = `rgba(174,194,224,${p.opacity})`; fxFrontCtx.lineWidth = p.width; fxFrontCtx.stroke();
            p.y += p.speed; p.x += p.drift * 0.3;
            if (p.y > fxCanvas.height) { p.y = Math.random() * -100 - 20; p.x = Math.random() * fxCanvas.width; }
        }
        for (let i = fxSplashes.length - 1; i >= 0; i--) {
            const s = fxSplashes[i]; s.x += s.vx; s.y += s.vy; s.vy += s.gravity; s.life -= s.decay;
            if (s.life <= 0) { fxSplashes.splice(i, 1); continue; }
            fxCtx.beginPath(); fxCtx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
            fxCtx.fillStyle = `rgba(174,210,240,${s.life * 0.6})`; fxCtx.fill();
        }
        fxAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function startSnow(intensity = 1) {
    clearEffects();
    currentEffect = 'snow';
    const count = Math.floor(100 * intensity);
    for (let i = 0; i < count; i++) {
        const depth = Math.random();
        fxParticles.push({ x: Math.random() * fxCanvas.width, y: Math.random() * fxCanvas.height,
            r: 1.5 + depth * 4, speed: 0.3 + depth * 1.4,
            wobble: Math.random() * Math.PI * 2, wobbleSpeed: 0.008 + Math.random() * 0.015,
            wobbleAmp: 20 + depth * 40, opacity: 0.2 + depth * 0.5,
            rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.02,
            arms: Math.random() > 0.4 ? 6 : 4, depth });
    }
    function drawSnowflake(x, y, r, rotation, arms, opacity) {
        fxCtx.save(); fxCtx.translate(x, y); fxCtx.rotate(rotation); fxCtx.globalAlpha = opacity;
        if (r < 2.5) {
            const grad = fxCtx.createRadialGradient(0, 0, 0, 0, 0, r);
            grad.addColorStop(0, 'rgba(255,255,255,0.9)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
            fxCtx.beginPath(); fxCtx.arc(0, 0, r * 1.5, 0, Math.PI * 2); fxCtx.fillStyle = grad; fxCtx.fill();
        } else {
            fxCtx.strokeStyle = 'rgba(255,255,255,0.9)'; fxCtx.lineWidth = r * 0.2; fxCtx.lineCap = 'round';
            for (let i = 0; i < arms; i++) {
                const a = (Math.PI * 2 / arms) * i, len = r * 1.2;
                const cos = Math.cos(a), sin = Math.sin(a);
                fxCtx.beginPath(); fxCtx.moveTo(0, 0); fxCtx.lineTo(cos * len, sin * len); fxCtx.stroke();
                const bLen = len * 0.4, bPos = len * 0.55;
                fxCtx.beginPath(); fxCtx.moveTo(cos * bPos, sin * bPos);
                fxCtx.lineTo(cos * bPos + Math.cos(a + 0.5) * bLen, sin * bPos + Math.sin(a + 0.5) * bLen); fxCtx.stroke();
                fxCtx.beginPath(); fxCtx.moveTo(cos * bPos, sin * bPos);
                fxCtx.lineTo(cos * bPos + Math.cos(a - 0.5) * bLen, sin * bPos + Math.sin(a - 0.5) * bLen); fxCtx.stroke();
            }
            const cg = fxCtx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
            cg.addColorStop(0, 'rgba(255,255,255,0.4)'); cg.addColorStop(1, 'rgba(255,255,255,0)');
            fxCtx.beginPath(); fxCtx.arc(0, 0, r * 0.5, 0, Math.PI * 2); fxCtx.fillStyle = cg; fxCtx.fill();
        }
        fxCtx.globalAlpha = 1; fxCtx.restore();
    }
    function frame() {
        fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        for (const p of fxParticles) {
            p.wobble += p.wobbleSpeed; p.rotation += p.rotSpeed;
            drawSnowflake(p.x + Math.sin(p.wobble) * p.wobbleAmp, p.y, p.r, p.rotation, p.arms, p.opacity);
            p.y += p.speed; p.x += Math.sin(p.wobble) * 0.3;
            if (p.y > fxCanvas.height + p.r * 2) { p.y = -p.r * 2; p.x = Math.random() * fxCanvas.width; }
        }
        fxAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function startSunRays() {
    clearEffects(); currentEffect = 'sun';
    let angle = 0, pulse = 0;
    function frame() {
        fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        const cx = fxCanvas.width * 0.97, cy = fxCanvas.height * -0.03;
        pulse += 0.015; angle += 0.0015;
        const breathe = 1 + Math.sin(pulse) * 0.08;

        const ambientR = Math.max(fxCanvas.width, fxCanvas.height) * 1.2;
        const ambientGrad = fxCtx.createRadialGradient(cx, cy, 0, cx, cy, ambientR);
        ambientGrad.addColorStop(0, 'rgba(255,200,60,0.16)');
        ambientGrad.addColorStop(0.12, 'rgba(255,180,50,0.09)');
        ambientGrad.addColorStop(0.3, 'rgba(180,160,80,0.04)');
        ambientGrad.addColorStop(0.5, 'rgba(80,130,200,0.03)');
        ambientGrad.addColorStop(0.75, 'rgba(50,100,180,0.02)');
        ambientGrad.addColorStop(1, 'transparent');
        fxCtx.fillStyle = ambientGrad; fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);

        const outerR = 600 * breathe;
        const outerGrad = fxCtx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
        outerGrad.addColorStop(0, 'rgba(255,210,80,0.20)');
        outerGrad.addColorStop(0.2, 'rgba(255,180,50,0.10)');
        outerGrad.addColorStop(0.5, 'rgba(255,150,40,0.03)');
        outerGrad.addColorStop(1, 'transparent');
        fxCtx.fillStyle = outerGrad; fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);

        const midR = 300 * breathe;
        const midGrad = fxCtx.createRadialGradient(cx, cy, 0, cx, cy, midR);
        midGrad.addColorStop(0, 'rgba(255,230,120,0.28)');
        midGrad.addColorStop(0.3, 'rgba(255,200,70,0.12)');
        midGrad.addColorStop(1, 'transparent');
        fxCtx.fillStyle = midGrad; fxCtx.beginPath(); fxCtx.arc(cx, cy, midR, 0, Math.PI * 2); fxCtx.fill();

        const coreR = 100 * breathe;
        const coreGrad = fxCtx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        coreGrad.addColorStop(0, 'rgba(255,255,230,0.45)');
        coreGrad.addColorStop(0.4, 'rgba(255,240,160,0.18)');
        coreGrad.addColorStop(1, 'transparent');
        fxCtx.fillStyle = coreGrad; fxCtx.beginPath(); fxCtx.arc(cx, cy, coreR, 0, Math.PI * 2); fxCtx.fill();

        const rays = 18;
        const arcStart = Math.PI * 0.25;
        const arcSpan = Math.PI;
        for (let i = 0; i < rays; i++) {
            const a = arcStart + (arcSpan / rays) * i + angle;
            const len = (400 + Math.sin(pulse * 1.2 + i * 0.8) * 140) * breathe;
            const w = 0.10 + Math.sin(pulse + i) * 0.025;
            const grad = fxCtx.createLinearGradient(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len);
            grad.addColorStop(0, 'rgba(255,220,90,0.14)'); grad.addColorStop(0.3, 'rgba(255,200,60,0.06)'); grad.addColorStop(1, 'transparent');
            fxCtx.beginPath(); fxCtx.moveTo(cx, cy);
            fxCtx.lineTo(cx + Math.cos(a - w) * len, cy + Math.sin(a - w) * len);
            fxCtx.lineTo(cx + Math.cos(a + w) * len, cy + Math.sin(a + w) * len);
            fxCtx.closePath(); fxCtx.fillStyle = grad; fxCtx.fill();
        }
        for (let i = 0; i < rays; i++) {
            const a = arcStart + (arcSpan / rays) * i + angle + arcSpan / (rays * 2);
            const len = (200 + Math.sin(pulse * 0.8 + i * 1.3) * 70) * breathe;
            const grad = fxCtx.createLinearGradient(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len);
            grad.addColorStop(0, 'rgba(255,210,80,0.08)'); grad.addColorStop(1, 'transparent');
            fxCtx.beginPath(); fxCtx.moveTo(cx, cy);
            fxCtx.lineTo(cx + Math.cos(a - 0.04) * len, cy + Math.sin(a - 0.04) * len);
            fxCtx.lineTo(cx + Math.cos(a + 0.04) * len, cy + Math.sin(a + 0.04) * len);
            fxCtx.closePath(); fxCtx.fillStyle = grad; fxCtx.fill();
        }
        fxAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function startFog() {
    clearEffects(); currentEffect = 'fog';
    let t = 0;
    const patches = [];
    for (let i = 0; i < 12; i++) {
        patches.push({ x: Math.random() * fxCanvas.width, y: Math.random() * fxCanvas.height,
            r: 200 + Math.random() * 400, dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.15,
            phase: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.012 });
    }
    function frame() {
        fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        t += 0.01;
        const globalAlpha = 0.04 + Math.sin(t * 0.8) * 0.025;
        fxCtx.fillStyle = `rgba(190,200,215,${globalAlpha})`;
        fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
        for (const p of patches) {
            p.x += p.dx; p.y += p.dy; p.phase += p.speed;
            if (p.x < -p.r) p.x = fxCanvas.width + p.r;
            if (p.x > fxCanvas.width + p.r) p.x = -p.r;
            if (p.y < -p.r) p.y = fxCanvas.height + p.r;
            if (p.y > fxCanvas.height + p.r) p.y = -p.r;
            const op = (0.03 + Math.sin(p.phase) * 0.02);
            const grad = fxCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            grad.addColorStop(0, `rgba(200,210,225,${op})`);
            grad.addColorStop(0.6, `rgba(190,200,215,${op * 0.4})`);
            grad.addColorStop(1, 'transparent');
            fxCtx.fillStyle = grad; fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
        }
        fxAnimId = requestAnimationFrame(frame);
    }
    frame();
}

function startThunderstorm() {
    startRain(1.5); currentEffect = 'thunderstorm';
    const flash = document.getElementById('lightning-flash');
    function scheduleFlash() {
        if (currentEffect !== 'thunderstorm') return;
        const delay = 2000 + Math.random() * 4000;
        setTimeout(() => {
            if (currentEffect !== 'thunderstorm') return;
            flash.classList.add('on'); setTimeout(() => flash.classList.remove('on'), 80);
            setTimeout(() => { if (currentEffect !== 'thunderstorm') return; flash.classList.add('on'); setTimeout(() => flash.classList.remove('on'), 60); }, 150);
            scheduleFlash();
        }, delay);
    }
    scheduleFlash();
}

function startStars() {
    clearEffects(); currentEffect = 'stars';
    const stars = [];
    for (let i = 0; i < 60; i++) {
        stars.push({ x: Math.random() * fxCanvas.width, y: Math.random() * fxCanvas.height * 0.7,
            r: 0.5 + Math.random() * 1.5, twinkle: Math.random() * Math.PI * 2, speed: 0.02 + Math.random() * 0.03 });
    }
    function frame() {
        fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
        for (const s of stars) {
            s.twinkle += s.speed; const op = 0.3 + Math.sin(s.twinkle) * 0.3;
            fxCtx.beginPath(); fxCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            fxCtx.fillStyle = `rgba(255,255,255,${op})`; fxCtx.fill();
        }
        fxAnimId = requestAnimationFrame(frame);
    }
    frame();
}

const weatherCodes = {
    0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Fog", 48: "Rime Fog", 51: "Light Drizzle", 53: "Drizzle", 55: "Heavy Drizzle",
    56: "Freezing Drizzle", 57: "Heavy Freezing Drizzle",
    61: "Light Rain", 63: "Rain", 65: "Heavy Rain", 66: "Freezing Rain", 67: "Heavy Freezing Rain",
    71: "Light Snow", 73: "Snow", 75: "Heavy Snow", 77: "Snow Grains",
    80: "Light Showers", 81: "Showers", 82: "Heavy Showers",
    85: "Light Snow Showers", 86: "Heavy Snow Showers",
    95: "Thunderstorm", 96: "Thunderstorm w/ Hail", 99: "Severe Thunderstorm"
};
const METEO_CDN = 'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg';
function getWeatherIcon(code, isDay) {
    const map = { 0: isDay ? 'clear-day' : 'clear-night', 1: isDay ? 'partly-cloudy-day' : 'partly-cloudy-night', 2: isDay ? 'overcast-day' : 'overcast-night', 3: 'overcast',
        45: isDay ? 'fog-day' : 'fog-night', 48: isDay ? 'fog-day' : 'fog-night',
        51: 'drizzle', 53: 'overcast-rain', 55: 'extreme-rain', 56: 'sleet', 57: 'sleet',
        61: 'drizzle', 63: 'rain', 65: 'extreme-rain', 66: 'sleet', 67: 'extreme-sleet',
        71: 'snow', 73: 'snow', 75: 'extreme-snow', 77: 'snowflake',
        80: isDay ? 'partly-cloudy-day-rain' : 'partly-cloudy-night-rain',
        81: 'overcast-rain', 82: 'extreme-rain',
        85: isDay ? 'partly-cloudy-day-snow' : 'partly-cloudy-night-snow', 86: 'overcast-snow',
        95: 'thunderstorms-rain', 96: 'thunderstorms-overcast-rain', 99: 'thunderstorms-extreme-rain' };
    const name = map[code] || 'not-available';
    return `<img src="${METEO_CDN}/${name}.svg" alt="">`;
}
function getTimeInTZ(tz) {
    const str = new Date().toLocaleString('en-US', { timeZone: tz,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const [datePart, timePart] = str.split(', ');
    const [m, d, y] = datePart.split('/').map(Number);
    const [hh, mm, ss] = timePart.split(':').map(Number);
    return { year: y, month: m, day: d, hours: hh === 24 ? 0 : hh, minutes: mm, seconds: ss,
             totalMinutes: (hh === 24 ? 0 : hh) * 60 + mm };
}
function hoursFromISO(isoStr) { return parseInt(isoStr.split('T')[1].split(':')[0], 10); }
function toUnit(c) { return Math.round(c); }
function windDirection(deg) {
    const d = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return d[Math.round(deg / 22.5) % 16];
}
function uvDescription(uv) { if (uv <= 2) return 'Low'; if (uv <= 5) return 'Moderate'; if (uv <= 7) return 'High'; if (uv <= 10) return 'Very High'; return 'Extreme'; }

let cachedData = null;

function renderWeather(data) {
    const current = data.current_weather;
    const tz = data.timezone;
    const now = getTimeInTZ(tz);
    const isDay = now.hours >= 6 && now.hours < 20;

    document.body.style.background = isDay
        ? 'linear-gradient(160deg, #162637 0%, #0f1923 100%)'
        : 'linear-gradient(160deg, #080e18 0%, #0f1923 100%)';

    const dateOpts = { weekday: 'long', month: 'long', day: 'numeric', timeZone: tz };
    const timeOpts = { hour: '2-digit', minute: '2-digit', timeZone: tz };
    document.getElementById('w-datetime').textContent =
        `${new Date().toLocaleDateString('en-US', dateOpts)} • ${new Date().toLocaleTimeString('en-US', timeOpts)}`;

    document.getElementById('w-icon').innerHTML = getWeatherIcon(current.weathercode, isDay);
    document.getElementById('w-temp').innerHTML = `${toUnit(current.temperature)}<span class="unit">°C</span>`;
    document.getElementById('w-status').textContent = weatherCodes[current.weathercode] || 'Unknown';

    const nowHourStr = `${String(now.year)}-${String(now.month).padStart(2,'0')}-${String(now.day).padStart(2,'0')}T${String(now.hours).padStart(2,'0')}:00`;
    let ci = data.hourly.time.findIndex(t => t === nowHourStr);
    if (ci < 0) ci = 0;

    const feelsLike = data.hourly.apparent_temperature[ci];
    document.getElementById('w-feels').textContent = `Feels like ${toUnit(feelsLike)}°C`;
    document.getElementById('w-minmax').innerHTML = `
        <span class="hi">↑ ${toUnit(data.daily.temperature_2m_max[0])}°</span>
        <span class="lo">↓ ${toUnit(data.daily.temperature_2m_min[0])}°</span>`;

    const wind = { val: Math.round(current.windspeed), unit: 'km/h' };
    const humidity = data.hourly.relative_humidity_2m[ci];
    const uv = data.hourly.uv_index[ci];
    const vis = data.hourly.visibility[ci];
    const precip = data.hourly.precipitation_probability[ci];
    const windDir = windDirection(current.winddirection);

    const details = [
        { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`, label: 'Wind', value: `${wind.val} ${wind.unit}`, sub: windDir },
        { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`, label: 'Humidity', value: `${humidity}%`, sub: humidity > 70 ? 'High' : humidity > 40 ? 'Comfortable' : 'Dry' },
        { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`, label: 'UV Index', value: `${Math.round(uv*10)/10}`, sub: uvDescription(uv) },
        { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>`, label: 'Visibility', value: `${(vis/1000).toFixed(1)} km`, sub: vis >= 10000 ? 'Excellent' : vis >= 5000 ? 'Good' : 'Poor' },
        { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/><line x1="8" y1="15" x2="8" y2="21"/><line x1="12" y1="13" x2="12" y2="21"/><line x1="16" y1="15" x2="16" y2="21"/></svg>`, label: 'Precip', value: `${precip}%`, sub: 'Chance of rain' },
        { icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`, label: 'Feels Like', value: `${toUnit(feelsLike)}°`, sub: feelsLike < current.temperature ? 'Colder' : feelsLike > current.temperature ? 'Warmer' : 'Same' }
    ];
    document.getElementById('w-details').innerHTML = details.map(d => `
        <div class="detail-card"><div class="label">${d.icon} ${d.label}</div><div class="value">${d.value}</div><div class="sub">${d.sub}</div></div>`).join('');

    const sunriseISO = data.daily.sunrise[0], sunsetISO = data.daily.sunset[0];
    const sunriseH = parseInt(sunriseISO.split('T')[1].split(':')[0], 10);
    const sunriseM = parseInt(sunriseISO.split('T')[1].split(':')[1], 10);
    const sunsetH = parseInt(sunsetISO.split('T')[1].split(':')[0], 10);
    const sunsetM = parseInt(sunsetISO.split('T')[1].split(':')[1], 10);
    function fmt12(h, m) { const ampm = h >= 12 ? 'PM' : 'AM'; return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`; }
    document.getElementById('w-sunrise').textContent = fmt12(sunriseH, sunriseM);
    document.getElementById('w-sunset').textContent = fmt12(sunsetH, sunsetM);
    const sunriseMin = sunriseH * 60 + sunriseM, sunsetMin = sunsetH * 60 + sunsetM, nowMin = now.totalMinutes;
    let sunProgress = Math.max(0, Math.min(100, ((nowMin - sunriseMin) / (sunsetMin - sunriseMin)) * 100));
    if (nowMin < sunriseMin) sunProgress = 0; if (nowMin > sunsetMin) sunProgress = 100;
    document.getElementById('w-sun-divider').style.setProperty('--sun-progress', `${sunProgress}%`);
    const dlMin = sunsetMin - sunriseMin;
    document.getElementById('w-daylight').textContent = `${Math.floor(dlMin / 60)}h ${dlMin % 60}m of daylight`;

    const hourlyHTML = [];
    for (let i = ci; i < Math.min(ci + 24, data.hourly.time.length); i++) {
        const h = hoursFromISO(data.hourly.time[i]);
        const hIsDay = h >= 6 && h < 20, isNow = i === ci;
        const hTime = isNow ? 'Now' : fmt12(h, 0).replace(':00 ', ' ');
        hourlyHTML.push(`<div class="hour-card ${isNow ? 'now' : ''}">
            <div class="h-time">${hTime}</div><div class="h-icon">${getWeatherIcon(data.hourly.weathercode[i], hIsDay)}</div>
            <div class="h-temp">${toUnit(data.hourly.temperature_2m[i])}°</div>
            ${data.hourly.precipitation_probability[i] > 0 ? `<div class="h-precip"><img src="${METEO_CDN}/raindrop.svg" alt="">${data.hourly.precipitation_probability[i]}%</div>` : ''}</div>`);
    }
    document.getElementById('w-hourly').innerHTML = hourlyHTML.join('');

    const allMax = Math.max(...data.daily.temperature_2m_max), allMin = Math.min(...data.daily.temperature_2m_min);
    const tempRange = allMax - allMin || 1;
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const dailyHTML = [];
    for (let i = 0; i < data.daily.time.length; i++) {
        const d = new Date(data.daily.time[i] + 'T12:00:00');
        const name = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()];
        const hi = toUnit(data.daily.temperature_2m_max[i]), lo = toUnit(data.daily.temperature_2m_min[i]);
        const rain = data.daily.precipitation_sum[i];
        const left = ((data.daily.temperature_2m_min[i] - allMin) / tempRange) * 100;
        const width = ((data.daily.temperature_2m_max[i] - data.daily.temperature_2m_min[i]) / tempRange) * 100;
        dailyHTML.push(`<div class="daily-row">
            <div class="day-name">${name}</div><div class="day-icon">${getWeatherIcon(data.daily.weathercode[i], true)}</div>
            <div class="day-precip">${rain > 0 ? `<img src="${METEO_CDN}/raindrop.svg" alt="">${rain.toFixed(1)}mm` : ''}</div>
            <div class="temp-bar"><div class="fill" style="left:${left}%;width:${Math.max(width,8)}%"></div></div>
            <div class="day-temps"><span class="day-lo">${lo}°</span><span class="day-hi">${hi}°</span></div></div>`);
    }
    document.getElementById('w-daily').innerHTML = dailyHTML.join('');
}

const EFFECT_DURATION = 4000;
const FADE_DURATION = 500;

const demoSequence = [
    { fn: () => startSunRays(),           name: 'Clear Sky',       sub: 'Warm sun glow with rotating rays',    bg: 'linear-gradient(160deg, #1a2235 0%, #1e1a0e 50%, #0f1923 100%)', status: 'Clear Sky',    heroIcon: 'clear-day'  },
    { fn: () => startRain(1),             name: 'Rain',            sub: '3D layered rain with splash effects', bg: 'linear-gradient(160deg, #111c28 0%, #0c1520 100%)', status: 'Rain',         heroIcon: 'rain' },
    { fn: () => startRain(1.5),           name: 'Heavy Rain',      sub: 'Intense downpour with more splatter', bg: 'linear-gradient(160deg, #0e1820 0%, #0a1218 100%)', status: 'Heavy Rain',   heroIcon: 'extreme-rain' },
    { fn: () => startThunderstorm(),      name: 'Thunderstorm',    sub: 'Heavy rain with lightning flashes',   bg: 'linear-gradient(160deg, #0a1018 0%, #080d14 100%)', status: 'Thunderstorm', heroIcon: 'thunderstorms-rain' },
    { fn: () => startSnow(1),             name: 'Snow',            sub: 'Crystalline flakes with depth layers',bg: 'linear-gradient(160deg, #141e2a 0%, #0f1923 100%)', status: 'Snow',         heroIcon: 'snow'  },
    { fn: () => startSnow(1.5),           name: 'Heavy Snow',      sub: 'Dense blizzard conditions',           bg: 'linear-gradient(160deg, #161f2a 0%, #101820 100%)', status: 'Heavy Snow',   heroIcon: 'extreme-snow'  },
    { fn: () => startFog(),               name: 'Fog',             sub: 'Drifting atmospheric haze layers',    bg: 'linear-gradient(160deg, #151d28 0%, #0f1923 100%)', status: 'Fog',          heroIcon: 'fog' },
    { fn: () => startStars(),             name: 'Clear Night',     sub: 'Twinkling stars on a clear night',    bg: 'linear-gradient(160deg, #080e18 0%, #0f1923 100%)', status: 'Clear Night',  heroIcon: 'clear-night'  },
];

let demoIndex = 0;
let demoTimer = null;
let progressTimer = null;

function updateHeroForEffect(entry) {
    document.getElementById('w-icon').innerHTML = `<img src="${METEO_CDN}/${entry.heroIcon}.svg" alt="">`;
    document.getElementById('w-status').textContent = entry.status;
    const nowCard = document.querySelector('.hour-card.now .h-icon');
    if (nowCard) nowCard.innerHTML = `<img src="${METEO_CDN}/${entry.heroIcon}.svg" alt="">`;
}

function runEffect(index) {
    const entry = demoSequence[index];

    fxCanvas.style.opacity = '0';
    fxFront.style.opacity = '0';

    setTimeout(() => {
        entry.fn();

        document.body.style.background = entry.bg;

        updateHeroForEffect(entry);

        fxCanvas.style.opacity = '1';
        fxFront.style.opacity = '1';
    }, FADE_DURATION);
}

function nextEffect() {
    runEffect(demoIndex);
    demoIndex = (demoIndex + 1) % demoSequence.length;
    demoTimer = setTimeout(nextEffect, EFFECT_DURATION + FADE_DURATION);
}

async function boot() {
    const params = [
        'latitude=43.6532', 'longitude=-79.3832',
        'hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m,uv_index,visibility',
        'daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,uv_index_max',
        'current_weather=true', 'timezone=auto', 'forecast_days=7'
    ].join('&');

    try {
        const resp = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        const data = await resp.json();
        cachedData = data;

        const wc = document.getElementById('weather-content');
        wc.style.display = '';
        wc.classList.add('visible');
        renderWeather(data);

        setTimeout(() => nextEffect(), 800);

    } catch(e) {
        console.error('Failed to fetch weather:', e);
        document.getElementById('w-status').textContent = 'Failed to load data';
    }
}

boot();
