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

      navItems.forEach(i => i.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(tab).classList.add('active');

      closeMenu();

      if (tab === 'network-radar') renderRadar();
      if (tab === 'dashboard') renderMap();
    });
  });

  // Time Filters
  const tBtns = document.querySelectorAll('.t-btn');
  tBtns.forEach(b => {
    b.addEventListener('click', () => {
      tBtns.forEach(btn => btn.classList.remove('active'));
      b.classList.add('active');

      const time = b.getAttribute('data-time');
      if (time === '22m') {
        document.getElementById('riskVal').innerText = '62%';
        document.getElementById('trafVal').innerText = '2.8k r/s';
      } else if (time === '30m') {
        document.getElementById('riskVal').innerText = '84%';
        document.getElementById('trafVal').innerText = '4.2k r/s';
      } else {
        document.getElementById('riskVal').innerText = '30%';
        document.getElementById('trafVal').innerText = '1.2k r/s';
      }
      populateLogs();
    });
  });

  // Live Location Hacker Map (Canvas)
  function renderMap() {
    const canvas = document.getElementById('locationMap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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

    // Locations (Delhi, Frankfurt, Dallas, Tokyo)
    const locations = [
      { name: 'Delhi, IN', x: w * 0.65, y: h * 0.45, color: '#ef4444' },
      { name: 'Frankfurt, DE', x: w * 0.45, y: h * 0.3, color: '#f97316' },
      { name: 'Dallas, US', x: w * 0.2, y: h * 0.4, color: '#3b82f6' },
      { name: 'Tokyo, JP', x: w * 0.85, y: h * 0.35, color: '#ef4444' }
    ];

    locations.forEach(loc => {
      ctx.fillStyle = loc.color;
      ctx.beginPath();
      ctx.arc(loc.x, loc.y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText(loc.name, loc.x + 6, loc.y + 3);
    });
  }

  // Mini Chart Rendering
  const miniCtx = document.getElementById('miniChart').getContext('2d');
  new Chart(miniCtx, {
    type: 'line',
    data: {
      labels: ['-30m', '-22m', '-10m', 'Now', '+15m'],
      datasets: [{
        data: [1200, 2800, 1800, 4200, 5800],
        borderColor: '#ef4444',
        borderWidth: 1.5,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 9 } } },
        y: { ticks: { color: '#64748b', font: { size: 9 } } }
      }
    }
  });

  // Populate Table Logs
  function populateLogs() {
    const logs = [
      { time: '-22m', loc: 'Delhi, IN (103.21.244.12)', type: 'SSH Brute' },
      { time: '-18m', loc: 'Frankfurt, DE (185.220.101.5)', type: 'SYN Flood' },
      { time: '-5m', loc: 'Tokyo, JP (114.114.114.114)', type: 'Port Scan' }
    ];

    const tbody = document.getElementById('logsTable');
    const nodeList = document.getElementById('nodeList');
    tbody.innerHTML = '';
    if (nodeList) nodeList.innerHTML = '';

    logs.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${l.time}</td><td>${l.loc}</td><td class="text-danger">${l.type}</td>`;
      tbody.appendChild(tr);

      if (nodeList) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${l.loc}</strong> - ${l.type}`;
        nodeList.appendChild(li);
      }
    });
  }

  // Radar Animation
  let rAngle = 0;
  function renderRadar() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const w = canvas.width, h = canvas.height, r = Math.min(w, h) / 2 - 10;
    const cx = w / 2, cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Radar Rings
    ctx.strokeStyle = '#10b98144';
    for (let radius = 20; radius <= r; radius += 25) {
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
    }

    // Sweep Line
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rAngle);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, 0, Math.PI / 4); ctx.fill();
    ctx.restore();

    rAngle += 0.04;
    requestAnimationFrame(renderRadar);
  }

  // Initial call
  renderMap();
  populateLogs();
  window.addEventListener('resize', renderMap);
});
