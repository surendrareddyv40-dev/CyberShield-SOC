"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [metrics, setMetrics] = useState({ accuracy: "87%", horizon: "30 MIN", latency: "< 1.8s" });
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeEngine, setActiveEngine] = useState("TRI_ENGINE_PARALLEL_SCAN");

  useEffect(() => {
    const fetchStream = setInterval(async () => {
      try {
        const response = await fetch('http://127.0.0');
        const data = await response.json();
        if (data.status === "ATTACK_TRAJECTORY_MAPPED") {
          setAlerts(prev => [data.alert, ...prev.slice(0, 1)]);
          setActiveEngine("ASYNC_FUSION_TRIGGERED");
        } else {
          setActiveEngine("TRI_ENGINE_PARALLEL_SCAN");
        }
        setLogs(prev => [data.log_string, ...prev.slice(0, 7)]);
        setMetrics(prev => ({ ...prev, latency: `${data.compute_latency}s` }));
      } catch (err) {
        setLogs(prev => ["[-] Backend infrastructure offline. Check FastAPI engine...", ...prev.slice(0, 4)]);
      }
    }, 1500);
    return () => clearInterval(fetchStream);
  }, []);

  return (
    <div className="min-h-screen bg-[#090D16] text-[#E2E8F0] font-mono p-4 md:p-8">
      <header className="border border-slate-800 bg-[#0F172A]/80 p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <div>
          <div className="text-xs uppercase tracking-widest text-blue-400 font-bold">// SYSTEM STATUS: ENGAGED // UPLINK: SEC-ENG-INSTITUTE</div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">ASTRA-FORECAST <span className="text-xs font-normal border border-slate-700 text-slate-400 px-2 py-0.5 ml-2 bg-slate-900">SIH26153</span></h1>
        </div>
        <div className="mt-4 md:mt-0 text-left md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-sm font-bold text-slate-200">National Technical Research Organisation (NTRO)</div>
        </div>
      </header>

      <section className="mb-6">
        {alerts.length > 0 ? (
          alerts.map((alert, idx) => (
            <div key={idx} className="border border-orange-500/30 bg-orange-950/20 p-4 flex items-center justify-between border-l-4 border-l-orange-500 animate-pulse">
              <span className="text-sm font-bold text-orange-200">{alert}</span>
            </div>
          ))
        ) : (
          <div className="border border-slate-800 bg-slate-900/20 p-4 text-sm text-slate-400 font-bold border-l-4 border-l-blue-500">[+] Evaluation scanner tracking network metrics parameters...</div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0F172A]/40 border border-slate-800 p-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-black text-slate-300 uppercase">// PIPELINE LOG ANALYSIS</h2>
              <span className="text-xs px-2 py-0.5 bg-blue-950/50 text-blue-400 border border-blue-900 font-bold">{activeEngine}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="border border-slate-800 p-3 bg-[#090D16]/90"><span className="text-blue-400 font-bold">01. LSTM/GRU</span><p className="text-slate-400 mt-1">Temporal Model</p></div>
              <div className="border border-slate-800 p-3 bg-[#090D16]/90"><span className="text-emerald-400 font-bold">02. RANDOM FOREST</span><p className="text-slate-400 mt-1">Feature Sorting</p></div>
              <div className="border border-slate-800 p-3 bg-[#090D16]/90"><span className="text-purple-400 font-bold">03. GNN</span><p className="text-slate-400 mt-1">Topology Mapping</p></div>
            </div>
          </div>

          <div className="bg-[#090D16] border border-slate-800 p-4 h-44 overflow-y-auto text-xs text-slate-400">
            {logs.map((log, i) => <div key={i}>[{new Date().toLocaleTimeString()}] {log}</div>)}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0F172A]/90 p-5 border border-slate-800 space-y-4">
            <div className="flex justify-between border-b border-slate-800 pb-2"><span>Precision</span><span className="text-emerald-400 font-bold">{metrics.accuracy}</span></div>
            <div className="flex justify-between border-b border-slate-800 pb-2"><span>Warning Horizon</span><span className="text-blue-400 font-bold">{metrics.horizon}</span></div>
            <div className="flex justify-between"><span>Latency</span><span className="text-amber-400 font-bold">{metrics.latency}</span></div>
          </div>
          <button onClick={async () => {
            const res = await fetch('http://127.0.0', { method: 'POST' });
            const data = await res.json();
            alert(`Protocol Active: ${data.message}`);
          }} className="w-full bg-blue-900/40 text-blue-400 border border-blue-800 font-bold text-xs py-3 px-4 uppercase tracking-wider hover:bg-blue-900/60">
            Trigger System Failover Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
