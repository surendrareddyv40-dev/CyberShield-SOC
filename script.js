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

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
  }

  if (overlay) overlay.addEventListener('click', closeMenu);

  // Tab Switching Logic
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');

      navItems.forEach(i => i.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(tab).classList.add('active');

      closeMenu();

      if (tab === 'network-radar') renderRadar();
      if (tab === 'dashboard') renderDashboardComponents();
    });
  });

  // Time Filters Logic
  const tBtns = document.querySelectorAll('.t-btn');
  tBtns.forEach(b => {
    b.addEventListener('click', () => {
      tBtns.forEach(btn => btn.classList.remove('active'));
      b.classList.add('active');

      const time = b.getAttribute('data-time');
      const trafVal = document.getElementById('trafVal');
      const riskVal = document.getElementById('riskVal');

      if (time === '22m') {
        if (trafVal) trafVal.innerText = '2.8k r/s';
        if (riskVal) riskVal.innerText = '62%';
      } else if (time === '30m') {
        if (trafVal) trafVal.innerText = '4.2k r/s';
        if (riskVal) riskVal.innerText = '84%';
      } else if (time === '1h') {
        if (trafVal) trafVal.innerText = '1.2k r/s';
        if (riskVal) riskVal.innerText = '30%';
      }
      populateLogsTable();
    });
  });

  function renderDashboardComponents() {
    renderHackerMap();
    drawTrafficChart();
    populateLogsTable();
  }

  // 1. LIVE HACKER MAP (Includes SAFE ZONE)
  function renderHackerMap() {
    const canvas = document.getElementById('locationMap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || 300;
    canvas.height = canvas.parentElement.clientHeight || 160;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Map Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Locations including Green SAFE ZONE
    const locations = [
      { name: 'Frankfurt, DE (Origin Tor)', x: w * 0.45, y: h * 0.3, color: '#f97316' },
      { name: 'Dallas, US (Data Center)', x: w * 0.22, y: h * 0.4, color: '#3b82f6' },
      { name: 'Tokyo, JP', x: w * 0.82, y: h * 0.35, color: '#ef4444' },
      { name: 'Delhi, IN (103.21.244.12)', x: w * 0.62, y: h * 0.45, color: '#ef4444' },
      { name: 'ASTRA SAFE ZONE (SG Data Center)', x: w * 0.72, y: h * 0.68, color: '#10b981', safe: true }
    ];

    locations.forEach(loc => {
      ctx.fillStyle = loc.color;
      ctx.beginPath();
      ctx.arc(loc.x, loc.y, loc.safe ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect for Safe Zone
      if (loc.safe) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, 9, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = loc.safe ? '#10b981' : '#94a3b8';
      ctx.font = loc.safe ? 'bold 9px sans-serif' : '9px sans-serif';
      ctx.fillText(loc.name, loc.x + 8, loc.y + 3);
    });
  }

  // 2. HIGH-RELIABILITY CUSTOM CANVAS TRAFFIC FORECAST CHART
  function drawTrafficChart() {
    const canvas = document.getElementById('miniChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || 300;
    canvas.height = canvas.parentElement.clientHeight || 140;

    const w = canvas.width;
    const h = canvas.height;
    const paddingLeft = 30;
    const paddingBottom = 20;
    const chartW = w - paddingLeft - 10;
    const chartH = h - paddingBottom - 25;

    ctx.clearRect(0, 0, w, h);

    // Chart Background Grid & Y-Axis Labels
    ctx.strokeStyle = '#1e293b';
    ctx.fillStyle = '#64748b';
    ctx.font = '9px sans-serif';
    ctx.lineWidth = 1;

    const yTicks = [{ val: '10k', y: 0.1 }, { val: '7k', y: 0.35 }, { val: '5k', y: 0.55 }, { val: '2k', y: 0.8 }, { val: '0', y: 1.0 }];
    yTicks.forEach(tick => {
      const yPos = 10 + chartH * tick.y;
      ctx.fillText(tick.val, 5, yPos + 3);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, yPos);
      ctx.lineTo(w - 10, yPos);
      ctx.stroke();
    });

    // X-Axis Labels
    const xTicks = [
      { label: '-30m', x: 0.05 },
      { label: '-15m', x: 0.3 },
      { label: 'NOW', x: 0.55 },
      { label: '+15m', x: 0.78 },
      { label: '+30m', x: 0.95 }
    ];
    xTicks.forEach(tick => {
      const xPos = paddingLeft + chartW * tick.x;
      ctx.fillText(tick.label, xPos - 10, h - 5);
    });

    // Chart Legend
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(paddingLeft, 5, 8, 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Current Traffic', paddingLeft + 12, 9);

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(paddingLeft + 90, 5, 8, 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Predicted DDoS Vector', paddingLeft + 102, 9);

    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(paddingLeft + 210, 5, 8, 2);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Normal Baseline', paddingLeft + 222, 9);

    // Draw Line 1: Normal Baseline Traffic (Yellow / Gold dotted)
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(paddingLeft + chartW * 0.05, 10 + chartH * 0.8);
    ctx.bezierCurveTo(
      paddingLeft + chartW * 0.3, 10 + chartH * 0.75,
      paddingLeft + chartW * 0.55, 10 + chartH * 0.72,
      paddingLeft + chartW * 0.95, 10 + chartH * 0.78
    );
    ctx.stroke();

    // Draw Line 2: Current Request Traffic (Blue solid line)
    ctx.setLineDash([]);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(paddingLeft + chartW * 0.05, 10 + chartH * 0.8);
    ctx.lineTo(paddingLeft + chartW * 0.2, 10 + chartH * 0.78);
    ctx.lineTo(paddingLeft + chartW * 0.35, 10 + chartH * 0.81);
    ctx.lineTo(paddingLeft + chartW * 0.45, 10 + chartH * 0.79);
    ctx.bezierCurveTo(
      paddingLeft + chartW * 0.5, 10 + chartH * 0.4,
      paddingLeft + chartW * 0.53, 10 + chartH * 0.45,
      paddingLeft + chartW * 0.58, 10 + chartH * 0.6
    );
    ctx.stroke();

    // Draw Line 3: Predicted DDoS Volumetric Spike (Red dashed line)
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(paddingLeft + chartW * 0.58, 10 + chartH * 0.6);
    ctx.bezierCurveTo(
      paddingLeft + chartW * 0.68, 10 + chartH * 0.25,
      paddingLeft + chartW * 0.82, 10 + chartH * 0.12,
      paddingLeft + chartW * 0.95, 10 + chartH * 0.1
    );
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
  }

  // 3. RECENT ATTACK VECTORS LOG (Includes Safe Zone in 4th Row)
  function populateLogsTable() {
    const tbody = document.getElementById('logsTable');
    const nodeList = document.getElementById('nodeList');
    if (!tbody) return;

    const logs = [
      { time: '-22m', loc: 'Delhi, IN (Target: API Gateway)', type: 'SYN Flood', class: 'text-danger' },
      { time: '-18m', loc: 'Frankfurt, DE (Origin: Tor Exit)', type: 'Brute Force', class: 'text-danger' },
      { time: '-5m', loc: 'Tokyo, JP (Target: DB Cluster)', type: 'Port Scan', class: 'text-danger' },
      { time: 'Now', loc: 'ASTRA SAFE ZONE (Singapore Data Center)', type: 'VERIFIED SAFE', class: 'text-green' }
    ];

    tbody.innerHTML = '';
    if (nodeList) nodeList.innerHTML = '';

    logs.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${l.time}</td>
        <td><strong>${l.loc}</strong></td>
        <td class="${l.class}">${l.type}</td>
      `;
      tbody.appendChild(tr);

      if (nodeList) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${l.loc}</strong> - <span class="${l.class}">${l.type}</span>`;
        nodeList.appendChild(li);
      }
    });
  }

  // 4. NETWORK RADAR ANIMATION
  let rAngle = 0;
  function renderRadar() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || 300;
    canvas.height = canvas.parentElement.clientHeight || 180;

    const w = canvas.width, h = canvas.height, r = Math.min(w, h) / 2 - 10;
    const cx = w / 2, cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Radar Concentric Circles
    ctx.strokeStyle = '#10b98144';
    ctx.lineWidth = 1;
    for (let radius = 20; radius <= r; radius += 25) {
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();
    }

    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();

    // Radar Sweep Beam
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rAngle);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, 0, Math.PI / 4); ctx.fill();
    ctx.restore();

    rAngle += 0.04;
    requestAnimationFrame(renderRadar);
  }

  // Initial Execution
  renderDashboardComponents();
  window.addEventListener('resize', renderDashboardComponents);
});
