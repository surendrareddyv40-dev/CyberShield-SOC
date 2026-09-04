// Data initialization for Charts
const trafficCtx = document.getElementById('trafficChart').getContext('2d');
const attackCtx = document.getElementById('attackChart').getContext('2d');

// Real-time Traffic Line Chart
const trafficChart = new Chart(trafficCtx, {
  type: 'line',
  data: {
    labels: ['12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30 (Forecast)'],
    datasets: [{
      label: 'Actual Traffic (req/s)',
      data: [1200, 1250, 1180, 1300, 1240, 1290, null],
      borderColor: '#3b82f6',
      tension: 0.3,
      fill: false
    }, {
      label: 'Predicted Traffic (ASTRA)',
      data: [null, null, null, null, 1240, 1290, 4800],
      borderColor: '#ef4444',
      borderDash: [5, 5],
      tension: 0.3,
      fill: false
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { grid: { color: '#1e293b' } },
      x: { grid: { color: '#1e293b' } }
    }
  }
});

// Attack Distribution Doughnut Chart
const attackChart = new Chart(attackCtx, {
  type: 'doughnut',
  data: {
    labels: ['DDoS', 'Port Scan', 'Botnet', 'Normal Traffic'],
    datasets: [{
      data: [15, 10, 5, 70],
      backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#10b981']
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  }
});

// Simulated Real-Time Prediction Updates
const simulatedLocations = ['192.168.1.45 (Local)', '45.33.32.156 (US)', '185.220.101.5 (DE)', '103.21.244.0 (IN)'];
const attackTypes = ['DDoS Flood', 'SYN Scan', 'Brute Force', 'SQL Injection'];

function addPredictionLog() {
  const tbody = document.getElementById('threat-logs');
  const now = new Date().toLocaleTimeString();
  
  const isHighRisk = Math.random() > 0.6;
  const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
  const location = simulatedLocations[Math.floor(Math.random() * simulatedLocations.length)];
  const confidence = (Math.random() * (99 - 75) + 75).toFixed(1) + '%';
  
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${now}</td>
    <td class="${isHighRisk ? 'severity-high' : 'severity-med'}">${attack}</td>
    <td>${confidence}</td>
    <td>Server-Node-0${Math.floor(Math.random() * 5 + 1)}</td>
    <td>${location}</td>
    <td><span class="${isHighRisk ? 'severity-high' : 'severity-low'}">${isHighRisk ? 'PREDICTED' : 'MONITORING'}</span></td>
  `;

  tbody.prepend(row);
  if (tbody.children.length > 6) tbody.removeChild(tbody.lastChild);

  // Dynamic UI metric updates
  if (isHighRisk) {
    document.getElementById('risk-score').innerText = (Math.random() * (88 - 60) + 60).toFixed(0) + '%';
    document.getElementById('threat-level').innerText = 'HIGH';
    document.getElementById('threat-level').style.color = '#ef4444';
  }
}

// Trigger simulation every 4 seconds
setInterval(addPredictionLog, 4000);
addPredictionLog();
