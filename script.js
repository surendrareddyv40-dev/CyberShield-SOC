document.addEventListener('DOMContentLoaded', () => {

  // --- 1. NAVIGATION & TAB SWITCHING ---
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  const pageTitles = {
    'dashboard': 'Predictive Defense Dashboard',
    'network-radar': 'Global Network Threat Radar',
    'threat-intel': 'Threat Intelligence & Vector Analytics',
    'settings': 'System Settings & Rule Engine'
  };

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const selectedTab = item.getAttribute('data-tab');

      navItems.forEach(i => i.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(selectedTab).classList.add('active');
      pageTitle.innerText = pageTitles[selectedTab];

      // Close mobile menu
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('open');
      
      if (selectedTab === 'network-radar') {
        initRadar();
      }
    });
  });

  // Mobile drawer controls
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('open');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
  });

  // --- 2. TIME HORIZON FILTER CONTROLS ---
  const timeBtns = document.querySelectorAll('.time-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateDashboardData(btn.getAttribute('data-time'));
    });
  });

  // --- 3. CHART.JS INTEGRATION ---
  const trafficCtx = document.getElementById('trafficChart').getContext('2d');
  const attackCtx = document.getElementById('attackChart').getContext('2d');

  const trafficChart = new Chart(trafficCtx, {
    type: 'line',
    data: {
      labels: ['-30m', '-22m', '-15m', '-10m', '-5m', 'Now', '+15m (Pred)', '+30m (Pred)'],
      datasets: [{
        label: 'Actual Traffic (req/s)',
        data: [1100, 1250, 1400, 1350, 1800, 4280, null, null],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }, {
        label: 'Predicted Vector Spike',
        data: [null, null, null, null, null, 4280, 6500, 2100],
        borderColor: '#ef4444',
        borderDash: [6, 6],
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { grid: { color: '#202b42' }, ticks: { color: '#8492a6' } },
        x: { grid: { color: '#202b42' }, ticks: { color: '#8492a6' } }
      }
    }
  });

  const attackChart = new Chart(attackCtx, {
    type: 'doughnut',
    data: {
      labels: ['SYN Flood', 'Port Scan', 'Botnet Volumetric', 'Credential Stuffing'],
      datasets: [{
        data: [45, 25, 20, 10],
        backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#8492a6' } } }
    }
  });

  // --- 4. DYNAMIC THREAT DATA & HACKER LOG GENERATOR ---
  const hackerLocations = [
    { ip: '185.220.101.5', loc: 'Frankfurt, DE (Tor Exit)', node: 'Auth-Node-01' },
    { ip: '45.33.32.156', loc: 'Texas, US (DataCenter)', node: 'Edge-Gateway-02' },
    { ip: '103.21.244.0', loc: 'Beijing, CN (ISP)', node: 'Database-Cluster' },
    { ip: '194.26.29.112', loc: 'Moscow, RU (VPN)', node: 'API-Service-Main' }
  ];

  const attackTypes = ['SYN Flood DDoS', 'Brute Force SSH', 'Automated Port Scan', 'SQLi Payload Attack'];

  function generateThreatLogs() {
    const tbody = document.getElementById('threat-logs');
    tbody.innerHTML = '';

    for (let i = 0; i < 5; i++) {
      const locData = hackerLocations[Math.floor(Math.random() * hackerLocations.length)];
      const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      const confidence = (Math.random() * (99 - 80) + 80).toFixed(1) + '%';
      const timeOffset = Math.floor(Math.random() * 25 + 1);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>-${timeOffset} mins ago</td>
        <td><strong>${locData.ip}</strong> <br><small class="text-muted">${locData.loc}</small></td>
        <td>${locData.node}</td>
        <td class="text-danger">${attack}</td>
        <td>${confidence}</td>
        <td><span class="text-danger">● MITIGATED</span></td>
      `;
      tbody.appendChild(tr);
    }
  }

  generateThreatLogs();

  function updateDashboardData(horizon) {
    if (horizon === '22m') {
      document.getElementById('traffic-vol').innerText = '3,850 req/s';
      document.getElementById('risk-score').innerText = '78%';
    } else if (horizon === '30m') {
      document.getElementById('traffic-vol').innerText = '4,280 req/s';
      document.getElementById('risk-score').innerText = '84%';
    } else if (horizon === '1h') {
      document.getElementById('traffic-vol').innerText = '2,100 req/s';
      document.getElementById('risk-score').innerText = '45%';
    } else {
      document.getElementById('traffic-vol').innerText = '1,450 req/s';
      document.getElementById('risk-score').innerText = '22%';
    }
    generateThreatLogs();
  }

  // --- 5. INTERACTIVE CANVAS RADAR ---
  let radarCanvas, ctx, angle = 0;

  function initRadar() {
    radarCanvas = document.getElementById('radarMap');
    if (!radarCanvas) return;
    
    radarCanvas.width = 360;
    radarCanvas.height = 360;
    ctx = radarCanvas.getContext('2d');
    
    requestAnimationFrame(drawRadar);
  }

  function drawRadar() {
    if (!ctx) return;
    const width = radarCanvas.width;
    const height = radarCanvas.height;
    const radius = width / 2;

    ctx.clearRect(0, 0, width, height);

    // Radar Concentric Circles
    ctx.strokeStyle = '#10b98133';
    ctx.lineWidth = 1;

    for (let r = 50; r <= radius; r += 45) {
      ctx.beginPath();
      ctx.arc(radius, radius, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Grid crosshairs
    ctx.beginPath();
    ctx.moveTo(radius, 0); ctx.lineTo(radius, height);
    ctx.moveTo(0, radius); ctx.lineTo(width, radius);
    ctx.stroke();

    // Radar Sweeping Line
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle);
    
    const gradient = ctx.createConicGradient(0, 0, 0);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    gradient.addColorStop(0.2, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, 0, Math.PI / 3);
    ctx.fill();
    ctx.restore();

    // Render Simulated Threat Blips
    const blips = [
      { x: 120, y: 90, label: '185.220.101.5' },
      { x: 260, y: 220, label: '45.33.32.156' },
      { x: 80, y: 250, label: '103.21.244.0' }
    ];

    blips.forEach(blip => {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(blip.x, blip.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#8492a6';
      ctx.font = '10px sans-serif';
      ctx.fillText(blip.label, blip.x + 8, blip.y + 3);
    });

    angle += 0.03;
    requestAnimationFrame(drawRadar);
  }

  // Slider controls update
  const thresholdSlider = document.getElementById('threshold-slider');
  const thresholdVal = document.getElementById('threshold-val');
  if (thresholdSlider) {
    thresholdSlider.addEventListener('input', (e) => {
      thresholdVal.innerText = e.target.value + '%';
    });
  }

});
