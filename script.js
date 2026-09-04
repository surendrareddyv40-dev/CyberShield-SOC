document.addEventListener('DOMContentLoaded', () => {

  // Navigation Drawer Controls
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');

  // Notifications Drawer Controls
  const notifBtn = document.getElementById('notifBtn');
  const notifDrawer = document.getElementById('notifDrawer');
  const closeNotif = document.getElementById('closeNotif');

  function closeAllDrawers() {
    sidebar.classList.remove('open');
    notifDrawer.classList.remove('open');
    overlay.classList.remove('open');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
  }

  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      notifDrawer.classList.toggle('open');
      overlay.classList.toggle('open');
    });
  }

  if (closeNotif) closeNotif.addEventListener('click', closeAllDrawers);
  if (overlay) overlay.addEventListener('click', closeAllDrawers);

  // Tab View Switching
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');

      navItems.forEach(i => i.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(tab).classList.add('active');

      closeAllDrawers();

      if (tab === 'network-radar') {
        renderRadar();
        renderGNNTopology();
      }
      if (tab === 'dashboard') {
        renderDashboardComponents();
      }
    });
  });

  // Multi-Horizon Selector Buttons
  const tBtns = document.querySelectorAll('.t-btn');
  tBtns.forEach(b => {
    b.addEventListener('click', () => {
      tBtns.forEach(btn => btn.classList.remove('active'));
      b.classList.add('active');
      drawTrafficChart();
    });
  });

  function renderDashboardComponents() {
    renderHackerMap();
    drawTrafficChart();
    populateActionLog();
    populateNotifications();
  }

  // Populate Auto Action Log Table
  function populateActionLog() {
    const tbody = document.getElementById('autoActionTable');
    if (!tbody) return;

    const logs = [
      { time: 'Now', target: 'Auth-Gateway (Delhi)', action: 'Firewall BGP Blackhole', status: 'EXECUTED', class: 'text-green' },
      { time: '-2m', target: 'DB-Cluster (Tokyo)', action: 'Rate Limit (100 req/s)', status: 'ACTIVE', class: 'text-accent' },
      { time: '-15m', target: 'API-Edge (Dallas)', action: 'SYN Cookie Challenge', status: 'MITIGATED', class: 'text-green' }
    ];

    tbody.innerHTML = '';
    logs.forEach(l => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${l.time}</td><td>${l.target}</td><td>${l.action}</td><td class="${l.class}">${l.status}</td>`;
      tbody.appendChild(tr);
    });
  }

  // Populate Notifications Drawer
  function populateNotifications() {
    const notifList = document.getElementById('notifList');
    if (!notifList) return;

    const notifs = [
      '🚨 <strong>CRITICAL:</strong> High SYN-Flood anomaly detected in Delhi Node.',
      '🛡️ <strong>AUTO-MITIGATION:</strong> BGP Drop triggered on 103.21.244.12.',
      '🤖 <strong>GNN ENGINE:</strong> Neighbor node risk propagation score elevated to 88%.'
    ];

    notifList.innerHTML = '';
    notifs.forEach(n => {
      const li = document.createElement('li');
      li.innerHTML = n;
      notifList.appendChild(li);
    });
  }

  // Real-Time Traffic vs Forecast Canvas Chart (Light Mode)
  function drawTrafficChart() {
    const canvas = document.getElementById('miniChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || 300;
    canvas.height = canvas.parentElement.clientHeight || 140;

    const w = canvas.width, h = canvas.height;
    const paddingLeft = 30, paddingBottom = 20;
    const chartW = w - paddingLeft - 10, chartH = h - paddingBottom - 20;

    // Clear with White Canvas Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Light Mode Grid Lines
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let y = 0.2; y <= 1.0; y += 0.2) {
      const yPos = 10 + chartH * y;
      ctx.beginPath(); ctx.moveTo(paddingLeft, yPos); ctx.lineTo(w - 10, yPos); ctx.stroke();
    }

    // Baseline Line
    ctx.strokeStyle = '#ea580c';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(paddingLeft + chartW * 0.05, 10 + chartH * 0.8);
    ctx.lineTo(paddingLeft + chartW * 0.95, 10 + chartH * 0.75);
    ctx.stroke();

    // Actual Traffic Line
    ctx.setLineDash([]);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(paddingLeft + chartW * 0.05, 10 + chartH * 0.8);
    ctx.lineTo(paddingLeft + chartW * 0.3, 10 + chartH * 0.75);
    ctx.lineTo(paddingLeft + chartW * 0.5, 10 + chartH * 0.35);
    ctx.stroke();

    // Forecast Vector Line
    ctx.strokeStyle = '#dc2626';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(paddingLeft + chartW * 0.5, 10 + chartH * 0.35);
    ctx.lineTo(paddingLeft + chartW * 0.95, 10 + chartH * 0.1);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Network Topology Graph (GNN Engine)
  function renderGNNTopology() {
    const canvas = document.getElementById('gnnTopologyCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || 300;
    canvas.height = canvas.parentElement.clientHeight || 160;

    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    const nodes = [
      { id: 'Auth-Node', x: w * 0.2, y: h * 0.3, status: '#dc2626' },
      { id: 'API-Edge', x: w * 0.5, y: h * 0.2, status: '#2563eb' },
      { id: 'DB-Core', x: w * 0.8, y: h * 0.4, status: '#059669' },
      { id: 'Delhi-Node', x: w * 0.35, y: h * 0.7, status: '#dc2626' },
      { id: 'SG-SafeZone', x: w * 0.7, y: h * 0.75, status: '#059669' }
    ];

    const edges = [[0, 1], [0, 3], [1, 2], [3, 4], [1, 4]];

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    edges.forEach(e => {
      const n1 = nodes[e[0]], n2 = nodes[e[1]];
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();
    });

    nodes.forEach(n => {
      ctx.fillStyle = n.status;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.font = '9px sans-serif';
      ctx.fillText(n.id, n.x + 8, n.y + 3);
    });
  }

  // Targeted Locations Map Canvas
  function renderHackerMap() {
    const canvas = document.getElementById('locationMap');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || 300;
    canvas.height = canvas.parentElement.clientHeight || 160;

    const w = canvas.width, h = canvas.height;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#f1f5f9';
    for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }

    const locs = [
      { name: 'Delhi, IN (103.21.244.12)', x: w * 0.6, y: h * 0.45, color: '#dc2626' },
      { name: 'ASTRA SAFE ZONE (Singapore)', x: w * 0.72, y: h * 0.7, color: '#059669' }
    ];

    locs.forEach(l => {
      ctx.fillStyle = l.color;
      ctx.beginPath(); ctx.arc(l.x, l.y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#475569'; ctx.font = '9px sans-serif'; ctx.fillText(l.name, l.x + 8, l.y + 3);
    });
  }

  // Live Threat Sweep Canvas
  let rAngle = 0;
  function renderRadar() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth || 300;
    canvas.height = canvas.parentElement.clientHeight || 160;

    const w = canvas.width, h = canvas.height, r = Math.min(w, h) / 2 - 10;
    const cx = w / 2, cy = h / 2;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#05966933';
    for (let radius = 20; radius <= r; radius += 25) { ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke(); }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rAngle);
    ctx.fillStyle = 'rgba(5, 150, 105, 0.15)';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, 0, Math.PI / 4); ctx.fill();
    ctx.restore();

    rAngle += 0.04;
    requestAnimationFrame(renderRadar);
  }

  // Initial Load Trigger
  renderDashboardComponents();
  window.addEventListener('resize', renderDashboardComponents);
});
