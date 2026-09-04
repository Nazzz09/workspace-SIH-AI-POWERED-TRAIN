'use client';

import React, { useState } from 'react';
import { useRailway } from '@/context/RailwayContext';
import { UserRole, DivisionId } from '@/types';
import { 
  Train as TrainIcon, 
  ShieldAlert, 
  Cpu, 
  Clock, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Bell, 
  UserCheck, 
  PlusCircle, 
  Radio, 
  AlertTriangle,
  ChevronDown,
  Layers,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function Navbar() {
  const {
    currentDivision,
    selectedDivisionId,
    setSelectedDivisionId,
    divisions,
    currentUser,
    switchRole,
    simulationTime,
    isSimulationRunning,
    setIsSimulationRunning,
    setSimulationTime,
    soundAlertsEnabled,
    setSoundAlertsEnabled,
    conflictAlerts,
    setIsAiPlannerOpen,
    setIsEmergencyModalOpen,
    setActiveTab,
  } = useRailway();

  const [isDivisionDropdownOpen, setIsDivisionDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);

  const unreadAlerts = conflictAlerts.filter(a => !a.autoResolved);
  const criticalCount = unreadAlerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <header className="sticky top-0 z-40 bg-navy-900 border-b border-railway-800 shadow-xl select-none backdrop-blur-md bg-opacity-95">
      {/* Emergency ticker bar if critical alerts active */}
      {criticalCount > 0 && (
        <div className="bg-red-600/90 text-white px-4 py-1 text-xs font-semibold flex items-center justify-between border-b border-red-500 animate-pulse">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4" />
            <span>
              <strong>CRITICAL SAFETY ALERT:</strong> Track block clash detected with Priority Train #22436 Vande Bharat on Lucknow-Kanpur Corridor. Immediate AI re-planning recommended.
            </span>
          </div>
          <button 
            onClick={() => setActiveTab('ai_planner')}
            className="underline hover:text-amber-200 text-xs font-bold"
          >
            Review AI Resolution &rarr;
          </button>
        </div>
      )}

      <div className="max-w-[1720px] mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Logo & System Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5 bg-gradient-to-r from-railway-900 to-navy-800 px-3 py-1.5 rounded-lg border border-railway-700/60 shadow-inner">
            {/* Indian Railways Crest Emblem Style */}
            <div className="w-9 h-9 rounded-md bg-railway-700 flex items-center justify-center border border-amber-400/40 text-amber-400 shadow-md">
              <TrainIcon className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                  भारतीय रेल • INDIAN RAILWAYS
                </span>
                <span className="bg-railway-800 text-cyan-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyan-800">
                  AI-ABPE v3.4
                </span>
              </div>
              <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center space-x-1.5">
                <span>Auto-Block Planning Engine</span>
                <span className="text-railway-400 font-medium">| {currentDivision.code}</span>
              </h1>
            </div>
          </div>

          {/* Division Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDivisionDropdownOpen(!isDivisionDropdownOpen)}
              className="flex items-center space-x-2 bg-navy-850 hover:bg-railway-800/80 border border-railway-700/70 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-railway-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 leading-none">Railway Division</div>
                <div className="font-semibold text-white leading-tight">{currentDivision.name}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isDivisionDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-navy-900 border border-railway-700 rounded-lg shadow-2xl z-50 p-1.5 text-xs">
                <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-railway-800 mb-1">
                  Select Uttar Pradesh Railway Division
                </div>
                {divisions.map(div => (
                  <button
                    key={div.id}
                    onClick={() => {
                      setSelectedDivisionId(div.id);
                      setIsDivisionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition ${
                      div.id === selectedDivisionId 
                        ? 'bg-railway-600 text-white font-semibold' 
                        : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{div.name}</div>
                      <div className="text-[10px] opacity-75">{div.zone} • HQ: {div.headquarters}</div>
                    </div>
                    <span className="text-[10px] font-mono bg-navy-950/60 px-1.5 py-0.5 rounded text-amber-300 border border-amber-500/20">
                      {div.totalSections} Sec
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Simulation Clock & Time Scrubber */}
        <div className="hidden lg:flex items-center space-x-3 bg-navy-950/80 border border-railway-800/80 px-3.5 py-1.5 rounded-lg shadow-inner">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[11px] text-slate-400 font-medium">CTC Master Clock:</span>
            <span className="text-sm font-mono font-bold text-emerald-300 tracking-wider bg-navy-900 px-2 py-0.5 rounded border border-emerald-900/50">
              {simulationTime} hrs (IST)
            </span>
          </div>

          <div className="h-4 w-px bg-railway-800"></div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsSimulationRunning(!isSimulationRunning)}
              title={isSimulationRunning ? 'Pause simulation tick' : 'Start live clock'}
              className={`p-1 rounded text-xs flex items-center space-x-1 transition ${
                isSimulationRunning 
                  ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-800/60' 
                  : 'bg-amber-900/50 text-amber-300 border border-amber-700/50 hover:bg-amber-800/60'
              }`}
            >
              {isSimulationRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="text-[10px] font-semibold">{isSimulationRunning ? 'LIVE' : 'PAUSED'}</span>
            </button>

            {/* Quick Time Shift presets */}
            <div className="flex space-x-1 text-[10px] font-mono">
              {['02:00', '09:30', '13:00', '21:30'].map(t => (
                <button
                  key={t}
                  onClick={() => setSimulationTime(t)}
                  className={`px-1.5 py-0.5 rounded border transition ${
                    simulationTime === t 
                      ? 'bg-railway-600 text-white border-railway-400' 
                      : 'bg-navy-850 text-slate-400 border-railway-800 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons & User Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Sound alert toggle */}
          <button
            onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
            title={soundAlertsEnabled ? 'Mute control room audio' : 'Enable audio alerts'}
            className={`p-2 rounded-lg border text-xs transition ${
              soundAlertsEnabled 
                ? 'bg-navy-850 text-cyan-300 border-cyan-800/60 hover:bg-navy-800' 
                : 'bg-navy-950 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            {soundAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Conflict Alerts Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              className={`relative p-2 rounded-lg border text-xs transition ${
                unreadAlerts.length > 0
                  ? 'bg-amber-950/40 text-amber-400 border-amber-700/60 hover:bg-amber-900/50'
                  : 'bg-navy-850 text-slate-400 border-railway-800 hover:text-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {isAlertsOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-navy-900 border border-railway-700 rounded-lg shadow-2xl z-50 p-2 text-xs">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-railway-800 font-bold text-slate-200">
                  <span className="flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Active Train & Block Conflict Radar</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{unreadAlerts.length} Active</span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-1.5 py-2">
                  {conflictAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded border text-left transition ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-950/30 border-red-700/60 text-red-200'
                          : alert.severity === 'WARNING'
                          ? 'bg-amber-950/30 border-amber-700/60 text-amber-200'
                          : 'bg-cyan-950/30 border-cyan-800/60 text-cyan-200'
                      }`}
                    >
                      <div className="flex items-start justify-between font-semibold">
                        <span>{alert.title}</span>
                        <span className="text-[9px] font-mono opacity-70 ml-2">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-snug">{alert.description}</p>
                      <div className="mt-2 bg-navy-950/70 p-1.5 rounded border border-railway-800/60 text-[10px] text-emerald-300 flex items-start space-x-1">
                        <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>AI Solution:</strong> {alert.resolutionAdvice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* New AI Block Request Button */}
          <button
            onClick={() => setIsAiPlannerOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-railway-600 to-railway-500 hover:from-railway-500 hover:to-railway-400 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md border border-railway-400/30 transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Auto-Plan Block</span>
          </button>

          {/* Emergency Override Red Button */}
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center space-x-1.5 bg-red-600/90 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-red-400/50 shadow-md shadow-red-950/40 transition hover:shadow-red-700/30 animate-pulse"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Override</span>
          </button>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center space-x-2 bg-navy-850 hover:bg-navy-800 border border-railway-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium transition"
            >
              <div className="w-6 h-6 rounded-full bg-railway-700 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-[10px] text-amber-400 font-bold uppercase">{currentUser.role}</div>
                <div className="text-[11px] text-slate-200 truncate max-w-[120px]">{currentUser.name}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-navy-900 border border-railway-700 rounded-lg shadow-2xl z-50 p-1.5 text-xs">
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-railway-800 mb-1">
                  Switch User Simulation Role
                </div>
                {(['CONTROLLER', 'DOM', 'ENGINEER', 'STATION_MASTER', 'VIEWER'] as UserRole[]).map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition ${
                      currentUser.role === r
                        ? 'bg-railway-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                    }`}
                  >
                    <span>{r.replace('_', ' ')}</span>
                    {currentUser.role === r && <UserCheck className="w-3.5 h-3.5 text-amber-300" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
