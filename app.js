// SkyApp Core Celestial Rendering & Astronomy Engine

class SkyPlanetarium {
  constructor() {
    this.canvas = document.getElementById('sky-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.video = document.getElementById('camera-video');

    // Viewing Camera State (Horizontal Coordinate System)
    // Azimuth: 0 = North, 90 = East, 180 = South, 270 = West
    this.azimuth = 180; // Facing south by default (great for Southern Cross / Orion)
    this.altitude = 45; // 45 degrees up
    this.fov = 65; // Field of View in degrees

    // Observer Location (Default: Pretoria / Johannesburg, South Africa)
    this.observerLat = -25.7479;
    this.observerLon = 28.2293;

    // Interaction state
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.showConstellations = true;
    this.isNightVision = false;
    this.isCameraActive = false;
    this.isCompassActive = false;
    this.selectedStar = null;

    // Target animation for smooth panning
    this.targetAzimuth = null;
    this.targetAltitude = null;

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupControls();
    this.requestGeolocation();
    this.render();
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  // Calculate Greenwich Apparent Sidereal Time and Local Sidereal Time
  getLocalSiderealTime() {
    const now = new Date();
    // Julian Day Calculation
    const jd = (now.getTime() / 86400000) + 2440587.5;
    const d = jd - 2451545.0; // days since J2000.0
    // GMST in hours
    let gmst = 18.697374558 + 24.06570982441908 * d;
    gmst = ((gmst % 24) + 24) % 24;
    // Local Sidereal Time (LST)
    let lst = gmst + (this.observerLon / 15.0);
    lst = ((lst % 24) + 24) % 24;
    return lst;
  }

  // Convert Equatorial (RA, Dec) to Horizontal (Alt, Az)
  raDecToAltAz(raHours, decDeg, lstHours, latDeg) {
    const H = (lstHours - raHours) * 15 * (Math.PI / 180); // Hour Angle in radians
    const dec = decDeg * (Math.PI / 180);
    const lat = latDeg * (Math.PI / 180);

    // Altitude
    const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(H);
    const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));

    // Azimuth
    const cosAz = (Math.sin(dec) - Math.sin(alt) * Math.sin(lat)) / (Math.cos(alt) * Math.cos(lat) + 1e-7);
    let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
    if (Math.sin(H) > 0) {
      az = 2 * Math.PI - az;
    }

    return {
      altitude: alt * (180 / Math.PI),
      azimuth: az * (180 / Math.PI)
    };
  }

  // Project (Azimuth, Altitude) to 2D Screen Space
  projectToScreen(azDeg, altDeg) {
    // Relative angles to camera center
    let deltaAz = azDeg - this.azimuth;
    while (deltaAz > 180) deltaAz -= 360;
    while (deltaAz < -180) deltaAz += 360;

    const deltaAlt = altDeg - this.altitude;

    // Check if behind or outside field of view
    if (Math.abs(deltaAz) > this.fov || Math.abs(deltaAlt) > this.fov) {
      return null;
    }

    const scale = (this.width / 2) / Math.tan((this.fov * Math.PI / 360));
    const x = (this.width / 2) + Math.tan(deltaAz * Math.PI / 180) * scale;
    const y = (this.height / 2) - Math.tan(deltaAlt * Math.PI / 180) * scale;

    return { x, y };
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw dark space gradient if camera AR is off
    if (!this.isCameraActive) {
      const gradient = this.ctx.createRadialGradient(
        this.width / 2, this.height / 2, 50,
        this.width / 2, this.height / 2, this.width
      );
      if (this.isNightVision) {
        gradient.addColorStop(0, '#1a0000');
        gradient.addColorStop(1, '#050000');
      } else {
        gradient.addColorStop(0, '#0a0f1d');
        gradient.addColorStop(0.6, '#05070e');
        gradient.addColorStop(1, '#020307');
      }
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    const lst = this.getLocalSiderealTime();
    document.getElementById('time-display').textContent = `LST: ${lst.toFixed(2)}h | Lat: ${this.observerLat.toFixed(2)}°`;

    // Map stars to current alt/az
    const starScreenPositions = {};

    STAR_CATALOG.forEach(star => {
      const pos = this.raDecToAltAz(star.ra, star.dec, lst, this.observerLat);
      star.currentAlt = pos.altitude;
      star.currentAz = pos.azimuth;

      const screen = this.projectToScreen(pos.azimuth, pos.altitude);
      if (screen) {
        starScreenPositions[star.id] = screen;
      }
    });

    // 1. Draw Constellation Lines
    if (this.showConstellations) {
      this.ctx.lineWidth = 1.2;
      this.ctx.strokeStyle = this.isNightVision ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.35)';

      CONSTELLATIONS.forEach(con => {
        con.lines.forEach(([s1Id, s2Id]) => {
          const p1 = starScreenPositions[s1Id];
          const p2 = starScreenPositions[s2Id];
          if (p1 && p2) {
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        });
      });
    }

    // 2. Draw Stars
    STAR_CATALOG.forEach(star => {
      const screen = starScreenPositions[star.id];
      if (!screen) return;

      // Magnitude to pixel size (mag 0 ~ 4.5px, mag 3 ~ 2px)
      const radius = Math.max(1.8, 4.8 - star.mag * 0.9);

      // Star Color based on spectral class
      let starColor = '#ffffff';
      if (!this.isNightVision) {
        if (star.spectral.startsWith('O') || star.spectral.startsWith('B')) starColor = '#bae6fd'; // Blue-white
        else if (star.spectral.startsWith('A')) starColor = '#f8fafc'; // White
        else if (star.spectral.startsWith('F')) starColor = '#fef08a'; // Yellow-white
        else if (star.spectral.startsWith('G')) starColor = '#fde047'; // Yellow
        else if (star.spectral.startsWith('K')) starColor = '#fdba74'; // Orange
        else if (star.spectral.startsWith('M')) starColor = '#f87171'; // Red
      } else {
        starColor = '#ef4444';
      }

      // Outer glow for bright stars
      if (star.mag < 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, radius * 3.5, 0, Math.PI * 2);
        this.ctx.fillStyle = this.isNightVision ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.25)';
        this.ctx.fill();
      }

      // Star core
      this.ctx.beginPath();
      this.ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = starColor;
      this.ctx.fill();

      // Star label if bright enough
      if (star.mag < 2.0 && this.fov < 75) {
        this.ctx.font = '10px -apple-system, sans-serif';
        this.ctx.fillStyle = this.isNightVision ? 'rgba(239, 68, 68, 0.8)' : 'rgba(203, 213, 225, 0.85)';
        this.ctx.fillText(star.name.split(' ')[0], screen.x + radius + 4, screen.y + 3);
      }

      // Selection ring
      if (this.selectedStar && this.selectedStar.id === star.id) {
        this.ctx.beginPath();
        this.ctx.arc(screen.x, screen.y, radius + 8, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isNightVision ? '#ef4444' : '#38bdf8';
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([4, 4]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }
    });

    // 3. Smooth Camera Pan towards target
    if (this.targetAzimuth !== null && this.targetAltitude !== null) {
      let dAz = this.targetAzimuth - this.azimuth;
      while (dAz > 180) dAz -= 360;
      while (dAz < -180) dAz += 360;
      const dAlt = this.targetAltitude - this.altitude;

      this.azimuth += dAz * 0.08;
      this.altitude += dAlt * 0.08;

      if (Math.abs(dAz) < 0.2 && Math.abs(dAlt) < 0.2) {
        this.azimuth = this.targetAzimuth;
        this.altitude = this.targetAltitude;
        this.targetAzimuth = null;
        this.targetAltitude = null;
      }
      this.updateHud();
    }

    requestAnimationFrame(() => this.render());
  }

  setupControls() {
    // Mouse Drag / Touch Pan
    const onStart = (x, y) => {
      this.isDragging = true;
      this.lastMouseX = x;
      this.lastMouseY = y;
    };

    const onMove = (x, y) => {
      if (!this.isDragging) return;
      const dx = x - this.lastMouseX;
      const dy = y - this.lastMouseY;

      // Sensitivity scaled by FOV
      const speed = (this.fov / this.width) * 1.5;
      this.azimuth = (this.azimuth - dx * speed + 360) % 360;
      this.altitude = Math.max(-85, Math.min(85, this.altitude + dy * speed));

      this.lastMouseX = x;
      this.lastMouseY = y;
      this.updateHud();
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    // Mouse listeners
    this.canvas.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onEnd);

    // Touch listeners for mobile phone navigation
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    window.addEventListener('touchend', onEnd);

    // Zoom (Pinch / Mouse Wheel)
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.fov = Math.max(25, Math.min(100, this.fov + e.deltaY * 0.05));
      this.updateHud();
    }, { passive: false });

    // Star Selection via Click
    this.canvas.addEventListener('click', (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      let found = null;
      let minDistance = 25; // Click tolerance radius in px

      STAR_CATALOG.forEach(star => {
        if (star.currentAz === undefined) return;
        const screen = this.projectToScreen(star.currentAz, star.currentAlt);
        if (!screen) return;
        const d = Math.hypot(screen.x - clickX, screen.y - clickY);
        if (d < minDistance) {
          minDistance = d;
          found = star;
        }
      });

      if (found) {
        this.showStarModal(found);
      } else {
        this.hideStarModal();
      }
    });

    // UI Buttons
    document.getElementById('toggle-constellations').addEventListener('click', () => {
      this.showConstellations = !this.showConstellations;
      document.getElementById('toggle-constellations').classList.toggle('text-cyan-400');
      document.getElementById('toggle-constellations').classList.toggle('text-gray-400');
    });

    document.getElementById('toggle-night-vision').addEventListener('click', () => {
      this.isNightVision = !this.isNightVision;
      document.body.classList.toggle('red-mode');
    });

    document.getElementById('toggle-camera').addEventListener('click', () => {
      this.toggleCameraAR();
    });

    document.getElementById('toggle-compass').addEventListener('click', () => {
      this.toggleDeviceCompass();
    });

    document.getElementById('btn-reset-view').addEventListener('click', () => {
      this.targetAzimuth = 180;
      this.targetAltitude = 45;
      this.fov = 65;
      this.updateHud();
    });

    document.getElementById('close-modal').addEventListener('click', () => {
      this.hideStarModal();
    });

    // Search input handler
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query) {
        searchResults.classList.add('hidden');
        return;
      }

      const matches = STAR_CATALOG.filter(s => 
        s.name.toLowerCase().includes(query) || s.con.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="p-3 text-xs text-gray-400 text-center">No star found</div>';
      } else {
        searchResults.innerHTML = matches.map(s => `
          <div class="search-item p-2.5 hover:bg-cyan-500/20 cursor-pointer flex justify-between items-center text-xs" data-id="${s.id}">
            <div>
              <span class="font-bold text-white">${s.name}</span>
              <span class="text-[10px] text-gray-400 ml-1">(${s.con})</span>
            </div>
            <span class="text-[10px] text-cyan-300 font-mono">mag ${s.mag}</span>
          </div>
        `).join('');

        searchResults.querySelectorAll('.search-item').forEach(item => {
          item.addEventListener('click', () => {
            const star = STAR_CATALOG.find(s => s.id === item.dataset.id);
            if (star) {
              this.panToStar(star);
              this.showStarModal(star);
              searchResults.classList.add('hidden');
              searchInput.value = '';
            }
          });
        });
      }
      searchResults.classList.remove('hidden');
    });

    // Tonight's Sky Highlights Drawer
    document.getElementById('btn-tonights-sky').addEventListener('click', () => {
      const drawer = document.getElementById('tonights-drawer');
      const list = document.getElementById('tonight-list');

      // Filter visible stars (Altitude > 0)
      const visible = STAR_CATALOG
        .filter(s => s.currentAlt > 5)
        .sort((a, b) => a.mag - b.mag);

      list.innerHTML = visible.map(s => `
        <div class="tonight-card p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer flex items-center justify-between transition-all" data-id="${s.id}">
          <div>
            <div class="font-bold text-xs text-white">${s.name}</div>
            <div class="text-[10px] text-gray-400">${s.con} • Alt: ${s.currentAlt.toFixed(0)}° • Az: ${s.currentAz.toFixed(0)}°</div>
          </div>
          <span class="text-xs font-mono font-bold text-cyan-400">mag ${s.mag}</span>
        </div>
      `).join('');

      list.querySelectorAll('.tonight-card').forEach(card => {
        card.addEventListener('click', () => {
          const star = STAR_CATALOG.find(s => s.id === card.dataset.id);
          if (star) {
            this.panToStar(star);
            this.showStarModal(star);
            drawer.classList.add('hidden');
          }
        });
      });

      drawer.classList.remove('hidden');
    });

    document.getElementById('close-drawer').addEventListener('click', () => {
      document.getElementById('tonights-drawer').classList.add('hidden');
    });
  }

  showStarModal(star) {
    this.selectedStar = star;
    document.getElementById('modal-name').textContent = star.name;
    document.getElementById('modal-con').textContent = star.con;
    document.getElementById('modal-desc').textContent = star.desc;
    document.getElementById('modal-mag').textContent = star.mag.toFixed(2);
    document.getElementById('modal-dist').textContent = `${star.dist} ly`;
    document.getElementById('modal-spectral').textContent = star.spectral;
    document.getElementById('star-modal').classList.remove('hidden');
  }

  hideStarModal() {
    this.selectedStar = null;
    document.getElementById('star-modal').classList.add('hidden');
  }

  panToStar(star) {
    if (star.currentAz !== undefined && star.currentAlt !== undefined) {
      this.targetAzimuth = star.currentAz;
      this.targetAltitude = star.currentAlt;
    }
  }

  updateHud() {
    document.getElementById('azimuth-val').textContent = `${Math.round(this.azimuth).toString().padStart(3, '0')}°`;
    document.getElementById('altitude-val').textContent = `${this.altitude >= 0 ? '+' : ''}${Math.round(this.altitude)}°`;
    document.getElementById('fov-val').textContent = `${Math.round(this.fov)}°`;
  }

  // Geolocation request
  requestGeolocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.observerLat = pos.coords.latitude;
          this.observerLon = pos.coords.longitude;
          document.getElementById('gps-status').innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> GPS Locked';
        },
        () => {
          console.log('Using default geolocation coordinates (South Africa)');
        }
      );
    }
  }

  // AR Camera toggle
  async toggleCameraAR() {
    const btn = document.getElementById('toggle-camera');
    if (!this.isCameraActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        this.video.srcObject = stream;
        this.video.style.display = 'block';
        this.isCameraActive = true;
        btn.classList.add('text-cyan-400');
      } catch (err) {
        alert('Camera access denied or unavailable on this device.');
      }
    } else {
      if (this.video.srcObject) {
        this.video.srcObject.getTracks().forEach(track => track.stop());
      }
      this.video.style.display = 'none';
      this.isCameraActive = false;
      btn.classList.remove('text-cyan-400');
    }
  }

  // Mobile Device Orientation Sensor (Compass & Gyroscope)
  toggleDeviceCompass() {
    const btn = document.getElementById('toggle-compass');
    if (!this.isCompassActive) {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.enableOrientationSensor();
          }
        });
      } else {
        this.enableOrientationSensor();
      }
    } else {
      this.disableOrientationSensor();
    }
  }

  enableOrientationSensor() {
    this.orientationHandler = (e) => {
      if (e.alpha !== null) {
        this.azimuth = (360 - e.alpha) % 360;
      }
      if (e.beta !== null) {
        this.altitude = Math.max(-85, Math.min(85, e.beta - 45));
      }
      this.updateHud();
    };
    window.addEventListener('deviceorientation', this.orientationHandler);
    this.isCompassActive = true;
    document.getElementById('toggle-compass').classList.add('text-cyan-400');
  }

  disableOrientationSensor() {
    if (this.orientationHandler) {
      window.removeEventListener('deviceorientation', this.orientationHandler);
    }
    this.isCompassActive = false;
    document.getElementById('toggle-compass').classList.remove('text-cyan-400');
  }
}

// Start Planetarium on window load
window.addEventListener('DOMContentLoaded', () => {
  new SkyPlanetarium();
});
