document.addEventListener('DOMContentLoaded', () => {

  // Menu Drawer Control
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
  }

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });

  overlay.addEventListener('click', closeMenu);

  // Tab View Switching
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');

      // Update Navigation State
      navItems.forEach(i => i.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(tab).classList.add('active');

      closeMenu();

      // Trigger re-rendering of tab content
      if (tab === 'network-radar') {
        renderRadar();
      }
      
      // CRITICAL FIX: Re-render map and chart when switching back to dashboard
      if (tab === 'dashboard') {
        renderMapAndDataView();
      }
    });
  });

  // Time Filters
  const tBtns = document.querySelectorAll('.t-btn');
  tBtns.forEach(b => {
    b.addEventListener('click', () => {
      tBtns.forEach(btn => btn.classList.remove('active'));
      b.classList.add('active');

      const time = b.getAttribute('data-time');
      const trafVal = document.getElementById('trafVal');
      const riskVal = document.getElementById('riskVal');

      // Mock Data Update
      if (time === '22m') {
        trafVal.innerText = '2.8k r/s';
        riskVal.innerText = '62%';
      } else if (time === '30m') {
        trafVal.innerText = '4.2k r/s';
        riskVal.innerText = '84%';
      } else if (time === '1h') {
        trafVal.innerText = '1.2k r/s';
        riskVal.innerText = '30%';
      }
      populateLogsTable();
    });
  });

  // -- MAIN DASHBOARD VIEW RENDERING FUNCTION --
  function renderMapAndDataView() {
    renderHackerMap();
    renderMiniChart(); // Re-creates chart to prevent canvas reuse error
    populateLogsTable();
  }

  // Live Location Hacker Map (Canvas)
  function renderHackerMap() {
    const canvas = document.getElementById('locationMap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set internal dimensions to match parent CSS size
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Map Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Target/Origin Locations
    const locations = [
      { name: 'Delhi, IN (103.21.244.12)', x: w * 0.65, y: h * 0.45, color: '#ef4444', origin: false },
      { name: 'Frankfurt, DE (Origin Tor)', x: w * 0.45, y: h * 0.3, color: '#f97316', origin: true },
      { name: 'Dallas, US (Data Center)', x: w * 0.2, y: h * 0.4, color: '#3b82f6', origin: false },
      { name: 'Tokyo, JP (Target)', x: w * 0.85, y: h * 0.35, color: '#ef4444', origin: false }
    ];

    locations.forEach(loc => {
      ctx.fillStyle = loc.color;
      ctx.beginPath();
      // origins are larger/bolder
      ctx.arc(loc.x, loc.y, loc.origin ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // location text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText(loc.name, loc.x + 8, loc.y + 3);
    });
  }

  // Mini Chart Rendering
  // CRITICAL FIX: Canvas reuse often fails. Safer to destroy and replace the entire canvas element.
  function renderMiniChart() {
    const container = document.getElementById('chartBoxContainer');
    if (!container) return;

    // Remove old canvas
    container.innerHTML = '';
    
    // Create new canvas
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'miniChart';
    container.appendChild(newCanvas);

    const miniCtx = newCanvas.getContext('2d');

    // MOCK DATA: Server Traffic Forecast
    new Chart(miniCtx, {
      type: 'line',
      data: {
        labels: ['-30m', '-22m', '-10m', 'Now', '+15m (Forecast)'],
        datasets: [{
          label: 'Incoming Traffic Baseline (req/s)',
          data: [1200, 2800, 1800, 4200, null],
          borderColor: '#2563eb', // Blue
          borderWidth: 1.5,
          tension: 0.3
        },{
          label: 'Predicted Vector Spike (req/s)',
          data: [null, null, null, 4200, 6800],
          borderColor: '#ef4444', // Red
          borderDash: [5, 5],
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#64748b', font: { size: 9 } } },
          y: { 
            ticks: { color: '#64748b', font: { size: 9 } },
            title: { display: false }
          }
        }
      }
    });
  }

  // Populate Table Logs & Node List
  function populateLogsTable() {
    const tableBody = document.getElementById('logsTable');
    const nodeList = document.getElementById('nodeList');
    if (!tableBody) return;

    const logs = [
      { time: '-22m', loc: 'Delhi, IN (Target: API Gateway)', type: 'SYN Flood' },
      { time: '-18m', loc: 'Frankfurt, DE (Origin: Tor Exit)', type: 'Brute Force' },
      { time: '-5m', loc: 'Tokyo, JP (Target: DB Cluster)', type: 'Port Scan' }
    ];

    tableBody.innerHTML = '';
    if (nodeList) nodeList.innerHTML = '';

    logs.forEach(l => {
      // populate table
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${l.time}</td><td>${l.loc}</td><td class="text-danger">${l.type}</td>`;
      tableBody.appendChild(tr);

      // populate radar view node list if needed
      if (nodeList) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${l.loc}</strong> - ${l.type}`;
        nodeList.appendChild(li);
      }
    });
  }

  // -- RADAR VIEW RENDERING FUNCTION --
  let rAngle = 0;
  function renderRadar() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Match parent container size
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const w = canvas.width, h = canvas.height, r = Math.min(w, h) / 2 - 10;
    const cx = w / 2, cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Radar Rings
    ctx.strokeStyle = '#10b98144';
    ctx.lineWidth = 1;
    for (let radius = 20; radius <= r; radius += 25) {
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
    }

    // Crosshairs
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();

    // Sweep Line
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rAngle);
    
    const gradient = ctx.createConicGradient(0, 0, 0);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
    gradient.addColorStop(0.2, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, 0, Math.PI / 4); ctx.fill();
    ctx.restore();

    rAngle += 0.04;
    // Keep animation looping
    requestAnimationFrame(renderRadar);
  }

  // --- INITIAL PAGE LOAD SETUP ---
  renderMapAndDataView();
  
  // Re-run canvas draws on window resize to keep things crisp
  window.addEventListener('resize', () => {
    // Only update if current view is Dashboard
    if (document.getElementById('dashboard').classList.contains('active')) {
      renderHackerMap();
      // Chartjs handles resize automatically, but map canvas needs redraw
    }
  });

});
