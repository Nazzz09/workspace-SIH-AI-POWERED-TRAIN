'use client';

import React, { useState } from 'react';
import { useRailway } from '@/context/RailwayContext';
import { STATIONS, TRACK_SECTIONS } from '@/lib/constants';
import { Station, TrackSection, Train } from '@/types';
import { 
  MapPin, 
  Train as TrainIcon, 
  Activity, 
  Wrench, 
  Layers, 
  Zap, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Eye, 
  Gauge, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  Navigation
} from 'lucide-react';

export default function GisLeafletView() {
  const { 
    sections, 
    trains, 
    selectedSection, 
    setSelectedSection, 
    selectedTrain, 
    setSelectedTrain,
    setIsAiPlannerOpen,
    setSelectedRequest,
    maintenanceRequests
  } = useRailway();

  const [activePreset, setActivePreset] = useState<'UP_FULL' | 'LKO_CORE' | 'LKO_CNB' | 'LKO_AYC'>('LKO_CNB');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showTrains, setShowTrains] = useState(true);
  const [showTsrOnly, setShowTsrOnly] = useState(false);

  // Map Bounds / Centers depending on active preset
  const presets = {
    LKO_CNB: {
      name: 'Lucknow – Kanpur High-Speed Trunk',
      minLat: 26.35,
      maxLat: 26.95,
      minLng: 80.25,
      maxLng: 81.15,
    },
    LKO_CORE: {
      name: 'Lucknow NR & NER Terminal Hub',
      minLat: 26.75,
      maxLat: 26.95,
      minLng: 80.85,
      maxLng: 81.10,
    },
    LKO_AYC: {
      name: 'Lucknow – Ayodhya – Varanasi Line',
      minLat: 25.20,
      maxLat: 27.05,
      minLng: 80.85,
      maxLng: 83.20,
    },
    UP_FULL: {
      name: 'Full Uttar Pradesh Railway Network',
      minLat: 25.00,
      maxLat: 29.00,
      minLng: 78.00,
      maxLng: 83.60,
    },
  };

  const currentBounds = presets[activePreset];

  // Helper to project GPS lat/lng to SVG percentage canvas
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - currentBounds.minLng) / (currentBounds.maxLng - currentBounds.minLng)) * 100;
    const y = ((currentBounds.maxLat - lat) / (currentBounds.maxLat - currentBounds.minLat)) * 100;
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
  };

  const getSectionColor = (sec: TrackSection) => {
    if (sec.currentStatus === 'BLOCKED') return '#ef4444'; // Red
    if (sec.currentStatus === 'MAINTENANCE_SCHEDULED') return '#a855f7'; // Purple
    if (sec.currentStatus === 'CAUTION') return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  return (
    <div className="bg-navy-950 border border-railway-800 rounded-xl shadow-2xl flex flex-col h-full overflow-hidden select-none">
      {/* Top Map Control Bar */}
      <div className="p-3 bg-navy-900 border-b border-railway-800 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-md bg-railway-800 text-cyan-300">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Uttar Pradesh Railway GIS Corridor Navigator
            </h3>
            <p className="text-[10px] text-slate-400">
              Live GIS positioning for Lucknow NR, Lucknow NER, Kanpur Area, Prayagraj, Varanasi & Ayodhya
            </p>
          </div>
        </div>

        {/* Corridor View Presets */}
        <div className="flex items-center space-x-1.5 bg-navy-950 p-1 rounded-lg border border-railway-800 text-xs">
          {(
            [
              { id: 'LKO_CNB', label: 'Lucknow – Kanpur' },
              { id: 'LKO_CORE', label: 'Lucknow Metro Hub' },
              { id: 'LKO_AYC', label: 'Ayodhya & Varanasi' },
              { id: 'UP_FULL', label: 'All UP Network' },
            ] as const
          ).map(preset => (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                activePreset === preset.id
                  ? 'bg-railway-600 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-navy-850'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTrains(!showTrains)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center space-x-1.5 transition ${
              showTrains 
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60' 
                : 'bg-navy-900 text-slate-500 border-slate-800'
            }`}
          >
            <TrainIcon className="w-3.5 h-3.5" />
            <span>Trains ({trains.length})</span>
          </button>

          <button
            onClick={() => setShowTsrOnly(!showTsrOnly)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center space-x-1.5 transition ${
              showTsrOnly 
                ? 'bg-amber-950/80 text-amber-300 border-amber-700/60' 
                : 'bg-navy-900 text-slate-400 border-railway-800 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>TSR Caution Only</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport & Interactive Inspector Drawer */}
      <div className="relative flex-1 bg-[#070e1c] min-h-[520px] overflow-hidden flex">
        {/* Interactive Vector GIS Canvas */}
        <div className="flex-1 relative w-full h-full p-4 control-room-grid">
          <svg className="w-full h-full min-h-[480px]" viewBox="0 0 1000 600" preserveAspectRatio="none">
            {/* Ambient UP State Outline / Region Contours */}
            <rect x="10" y="10" width="980" height="580" rx="12" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
            <text x="30" y="40" fill="#334155" fontSize="16" fontWeight="bold" letterSpacing="4">
              UTTAR PRADESH RAILWAY NETWORK • NORTHERN & NORTH EASTERN RAILWAY
            </text>

            {/* Render Track Sections */}
            {sections.map(sec => {
              if (showTsrOnly && !sec.currentTSR) return null;
              const fromStn = STATIONS.find(s => s.code === sec.stationFrom);
              const toStn = STATIONS.find(s => s.code === sec.stationTo);
              if (!fromStn || !toStn) return null;

              const p1 = projectCoords(fromStn.lat, fromStn.lng);
              const p2 = projectCoords(toStn.lat, toStn.lng);

              // Map coordinates into 1000x600 viewBox
              const x1 = (p1.x / 100) * 1000;
              const y1 = (p1.y / 100) * 600;
              const x2 = (p2.x / 100) * 1000;
              const y2 = (p2.y / 100) * 600;

              const isSelected = selectedSection?.id === sec.id;
              const color = getSectionColor(sec);

              return (
                <g 
                  key={sec.id}
                  className="cursor-pointer transition-all"
                  onClick={() => {
                    setSelectedSection(sec);
                    setSelectedStation(null);
                    setSelectedTrain(null);
                  }}
                >
                  {/* Outer track ballast sleeper layer */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#0f172a"
                    strokeWidth={isSelected ? 10 : 7}
                    strokeLinecap="round"
                  />
                  {/* Glowing signal track line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={color}
                    strokeWidth={isSelected ? 5 : 3}
                    strokeLinecap="round"
                    strokeDasharray={sec.currentStatus === 'MAINTENANCE_SCHEDULED' ? '6 3' : undefined}
                    className={sec.currentStatus === 'BLOCKED' ? 'track-glow-red' : isSelected ? 'track-glow-blue' : undefined}
                  />

                  {/* Midpoint Speed/Block Tag */}
                  {isSelected && (
                    <g transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2 - 10})`}>
                      <rect x="-40" y="-12" width="80" height="20" rx="4" fill="#030712" stroke={color} strokeWidth="1.5" />
                      <text x="0" y="2" fill="#f8fafc" fontSize="9" fontWeight="bold" textAnchor="middle">
                        {sec.maxPermissibleSpeed} km/h
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Render Stations */}
            {STATIONS.map(stn => {
              const p = projectCoords(stn.lat, stn.lng);
              const cx = (p.x / 100) * 1000;
              const cy = (p.y / 100) * 600;

              // Don't render out-of-bounds stations in tight zoom presets
              if (p.x < 1 || p.x > 99 || p.y < 1 || p.y > 99) return null;

              const isSelected = selectedStation?.code === stn.code;
              const isJunction = stn.isJunction;

              return (
                <g
                  key={stn.code}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedStation(stn);
                    setSelectedSection(null);
                    setSelectedTrain(null);
                  }}
                >
                  {/* Radar pulse around major junctions */}
                  {isJunction && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="14"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Station Marker */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 9 : isJunction ? 7 : 5}
                    fill={isJunction ? '#0284c7' : '#1e293b'}
                    stroke={isSelected ? '#fde047' : isJunction ? '#38bdf8' : '#94a3b8'}
                    strokeWidth={isSelected ? 3 : 2}
                  />

                  {/* Station Code & Name */}
                  <text
                    x={cx}
                    y={cy - 12}
                    fill={isSelected ? '#fde047' : '#ffffff'}
                    fontSize={isJunction ? 11 : 9}
                    fontWeight="bold"
                    textAnchor="middle"
                    className="drop-shadow-md"
                  >
                    {stn.name}
                  </text>
                  <text
                    x={cx}
                    y={cy + 16}
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {stn.code} ({stn.totalPlatforms} PF)
                  </text>
                </g>
              );
            })}

            {/* Render Active Moving Trains */}
            {showTrains && trains.map(trn => {
              const p = projectCoords(trn.currentLat, trn.currentLng);
              const tx = (p.x / 100) * 1000;
              const ty = (p.y / 100) * 600;

              if (p.x < 1 || p.x > 99 || p.y < 1 || p.y > 99) return null;

              const isVip = trn.priority.startsWith('P1');
              const isSelected = selectedTrain?.id === trn.id;

              return (
                <g
                  key={trn.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedTrain(trn);
                    setSelectedSection(null);
                    setSelectedStation(null);
                  }}
                >
                  {/* Train Marker Icon Pin */}
                  <g transform={`translate(${tx}, ${ty})`}>
                    <rect
                      x="-26"
                      y="-12"
                      width="52"
                      height="20"
                      rx="4"
                      fill={isVip ? '#ea580c' : '#0369a1'}
                      stroke={isSelected ? '#fde047' : '#ffffff'}
                      strokeWidth={isSelected ? 2 : 1}
                      className="shadow-lg"
                    />
                    <text
                      x="0"
                      y="2"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      #{trn.trainNumber}
                    </text>

                    {/* Speed Badge */}
                    <circle cx="24" cy="-8" r="6" fill="#10b981" />
                    <text x="24" y="-6" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">
                      {trn.speedKmH}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Deep Detail Inspector Sidebar (Slides in on Selection) */}
        {(selectedSection || selectedTrain || selectedStation) && (
          <div className="w-80 bg-navy-900 border-l border-railway-800 p-4 overflow-y-auto flex flex-col justify-between shadow-2xl z-20">
            <div>
              {/* SECTION INSPECTOR */}
              {selectedSection && (
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-railway-800">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase">
                      Track Section Dossier
                    </span>
                    <button
                      onClick={() => setSelectedSection(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2">{selectedSection.sectionName}</h4>
                  <p className="text-[11px] text-slate-400">{selectedSection.corridorName}</p>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Current Status:</span>
                      <strong className={`font-mono ${
                        selectedSection.currentStatus === 'CLEAR' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {selectedSection.currentStatus}
                      </strong>
                    </div>

                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Section MPS:</span>
                      <strong className="text-white font-mono">{selectedSection.maxPermissibleSpeed} km/h</strong>
                    </div>

                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Asset Health:</span>
                      <strong className="text-cyan-400 font-mono">{selectedSection.assetHealthIndex}%</strong>
                    </div>

                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">OHE Traction:</span>
                      <span className="text-slate-200">{selectedSection.oheVoltage}</span>
                    </div>

                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Signalling Type:</span>
                      <span className="text-slate-200 text-right">{selectedSection.signallingType}</span>
                    </div>

                    {selectedSection.currentTSR && (
                      <div className="bg-amber-950/40 border border-amber-800/80 p-2 rounded text-amber-200 text-[11px]">
                        <strong>Temporary Speed Restriction (TSR):</strong>
                        <div className="font-mono text-amber-300 font-bold">{selectedSection.currentTSR.speedKm} km/h</div>
                        <div className="text-[10px] text-slate-300 mt-0.5">{selectedSection.currentTSR.reason}</div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-railway-800 space-y-2">
                    <button
                      onClick={() => setIsAiPlannerOpen(true)}
                      className="w-full bg-railway-600 hover:bg-railway-500 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>AI Auto-Schedule Block on Section</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TRAIN INSPECTOR */}
              {selectedTrain && (
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-railway-800">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                      Live Train Telemetry
                    </span>
                    <button
                      onClick={() => setSelectedTrain(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2">
                    {selectedTrain.trainNumber} - {selectedTrain.trainName}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-railway-800 text-cyan-300 inline-block mt-1">
                    {selectedTrain.trainType} ({selectedTrain.priority})
                  </span>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Current Speed:</span>
                      <strong className="text-emerald-400 font-mono text-sm">{selectedTrain.speedKmH} km/h</strong>
                    </div>

                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Punctuality Delay:</span>
                      <strong className={`font-mono ${selectedTrain.delayMinutes === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {selectedTrain.delayMinutes === 0 ? 'Right Time (RT)' : `+${selectedTrain.delayMinutes} mins`}
                      </strong>
                    </div>

                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Rake / Power:</span>
                      <span className="text-slate-200 text-right">{selectedTrain.locoType}</span>
                    </div>

                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Next Halt:</span>
                      <strong className="text-white">{selectedTrain.nextStation} (ETA: {selectedTrain.etaNextStation})</strong>
                    </div>
                  </div>

                  {/* Scheduled Stops */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Corridor Timetable
                    </span>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {selectedTrain.timetable.map((st, i) => (
                        <div key={i} className="text-[10px] bg-navy-950 p-1.5 rounded flex items-center justify-between font-mono">
                          <span className="text-white font-bold">{st.stationCode} ({st.stationName})</span>
                          <span className="text-cyan-300">Arr: {st.scheduledArrival} | PF {st.platform}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STATION INSPECTOR */}
              {selectedStation && (
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-railway-800">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      Station Junction Overview
                    </span>
                    <button
                      onClick={() => setSelectedStation(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2">{selectedStation.name} ({selectedStation.code})</h4>
                  <p className="text-[11px] text-amber-300 font-medium">{selectedStation.hindiName}</p>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Platforms / Lines:</span>
                      <strong className="text-white font-mono">{selectedStation.totalPlatforms} PF / {selectedStation.totalLines} Lines</strong>
                    </div>
                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Station Category:</span>
                      <strong className="text-cyan-400 font-mono">{selectedStation.category}</strong>
                    </div>
                    <div className="bg-navy-950 p-2 rounded border border-railway-800 flex justify-between">
                      <span className="text-slate-400">Interlocking:</span>
                      <span className="text-emerald-400 font-semibold">Route Relay / Electronic</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
