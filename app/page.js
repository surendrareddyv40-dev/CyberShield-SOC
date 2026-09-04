"use client";
import React, { useState, useEffect } from 'react';

export default function AdvancedAstraConsole() {
  const [metrics, setMetrics] = useState({
    accuracy: "87%",
    horizon: "30 MIN",
    latency: "< 1.8s"
  });
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
      
      {/* OPERATIONS CENTER OVERVIEW GRID */}
      <header className="border border-slate-800 bg-[#0F172A]/80 backdrop-blur p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <div>
          <div className="text-xs uppercase tracking-widest text-blue-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM STATUS: ENGAGED // UPLINK: SEC-ENG-INSTITUTE
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-white mt-1">
            ASTRA-FORECAST <span className="text-xs font-normal border border-slate-700 text-slate-400 px-2 py-0.5 ml-2 bg-slate-900">PS ID: SIH26153</span>
          </h1>
        </div>
        <div className="mt-4 md:mt-0 text-left md:text-right border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="text-xs text-slate-500 font-bold">SPONSOR INTERFACE AREA</div>
          <div className="text-sm font-bold text-slate-200">National Technical Research Organisation (NTRO)</div>
        </div>
      </header>

      {/* DYNAMIC ALERTS HUD BAR */}
      <section className="mb-6 space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert, idx) => (
            <div key={idx} className="border border-orange-500/30 bg-orange-950/20 p-4 flex items-center justify-between border-l-4 border-l-orange-500 animate-pulse">
              <div>
                <span className="bg-orange-500 text-black text-xs font-black px-1.5 py-0.5 mr-3">PROACTIVE DETECTION</span>
                <span className="text-sm font-bold text-orange-200">{alert}</span>
              </div>
              <span className="text-xs text-orange-400 font-bold hidden md:inline">SHAP ENGINE: ACTIVE</span>
            </div>
          ))
        ) : (
          <div className="border border-slate-800 bg-slate-900/20 p-4 text-sm text-slate-400 font-bold border-l-4 border-l-blue-500">
            [+] Evaluation scanner tracing system packets. Network metrics parameters nominal.
          </div>
        )}
      </section>

      {/* THREE-COLUMN HUD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MODEL LAYER ENGINE READOUTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0F172A]/40 border border-slate-800 p-5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h2 className="text-sm font-black text-slate-300 uppercase tracking-widest">// MODEL PIPELINE LOG ANALYSIS</h2>
              <span className="text-xs px-2 py-0.5 bg-blue-950/50 text-blue-400 border border-blue-900 font-bold">{activeEngine}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-800 p-4 bg-[#090D16]/90">
                <div className="text-xs font-bold text-blue-400">01. LSTM / GRU</div>
                <div className="text-base font-bold text-white mt-1">Temporal Model</div>
                <div className="text-xs text-slate-500 mt-2">Extracting multi-dimensional patterns.</div>
              </div>
              <div className="border border-slate-800 p-4 bg-[#090D16]/90">
                <div className="text-xs font-bold text-emerald-400">02. RANDOM FOREST</div>
                <div className="text-base font-bold text-white mt-1">Feature Sorting</div>
                <div className="text-xs text-slate-500 mt-2">Isolating risk thresholds over 200 estimators.</div>
              </div>
              <div className="border border-slate-800 p-4 bg-[#090D16]/90">
                <div className="text-xs font-bold text-purple-400">03. GRAPH NEURAL NETWORK</div>
                <div className="text-base font-bold text-white mt-1">Topology Map</div>
                <div className="text-xs text-slate-500 mt-2">Validating node distribution metrics.</div>
              </div>
            </div>
          </div>

          {/* TELEMETRY EVENT STREAM WINDOW */}
          <div className="bg-[#090D16] border border-slate-800 p-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-3">// CONSOLE EVENT STREAM</h2>
            <div className="space-y-1.5 h-44 overflow-y-auto text-xs text-slate-400">
              {logs.map((log, i) => (
                <div key={i} className="font-mono">
                  <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERFORMANCE KPI MODULE */}
        <div className="space-y-6">
          <div className="bg-[#0F172A]/90 p-5 border border-slate-800">
            <h2 className="text-sm font-black tracking-widest text-slate-300 uppercase border-b border-slate-800 pb-3 mb-4">// REAL-TIME STATUS AUDIT</h2>
            <div className="space-y-5">
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-3">
                <span className="text-xs text-slate-500 font-bold uppercase">Forecast Precision</span>
                <span className="text-2xl font-black text-emerald-400">{metrics.accuracy}</span>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800/60 pb-3">
                <span className="text-xs text-slate-500 font-bold uppercase">Early Warning Window</span>
                <span className="text-2xl font-black text-blue-400">{metrics.horizon}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-500 font-bold uppercase">Pipeline Latency</span>
                <span className="text-2xl font-black text-amber-400">{metrics.latency}</span>
              </div>
            </div>
          </div>

          {/* ACTIVE TRIGGER WORKFLOW BUTTON */}
          <div className="border border-slate-800 bg-[#0F172A]/20 p-4 text-center">
            <button 
              onClick={async () => {
                const res = await fetch('http://127.0.0', { method: 'POST' });
                const data = await res.json();
                alert(`Protocol Active: ${data.message}`);
              }}
              className="w-full bg-transparent hover:bg-blue-900/20 text-blue-400 border border-blue-800 hover:border-blue-500 font-bold text-xs py-2.5 px-4 uppercase tracking-wider transition-all"
            >
              Trigger System Failover Protocol
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
