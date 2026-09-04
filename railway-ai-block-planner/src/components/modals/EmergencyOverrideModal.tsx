'use client';

import React, { useState } from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  ShieldAlert, 
  X, 
  AlertTriangle, 
  Zap, 
  Wrench, 
  Radio, 
  Check,
  Flame
} from 'lucide-react';

export default function EmergencyOverrideModal() {
  const { 
    isEmergencyModalOpen, 
    setIsEmergencyModalOpen, 
    sections, 
    triggerEmergencyOverride 
  } = useRailway();

  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0].id);
  const [emergencyReason, setEmergencyReason] = useState<string>('Rail Fracture Detected on Track Circuit');
  const [department, setDepartment] = useState<'CIVIL_PWAY' | 'ELECTRICAL_TRD' | 'SIGNAL_TELECOM_SNT'>('CIVIL_PWAY');
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isEmergencyModalOpen) return null;

  const targetSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  const handleExecuteEmergency = () => {
    triggerEmergencyOverride(selectedSectionId, emergencyReason, durationMinutes, department);
    setIsEmergencyModalOpen(false);
    setIsConfirming(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-md select-none">
      <div className="bg-navy-950 border-2 border-red-600 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl shadow-red-950 animate-in fade-in zoom-in-95 duration-200">
        {/* Red Flashing Header */}
        <div className="p-4 bg-red-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
            <div>
              <div className="text-[10px] font-mono uppercase font-black tracking-wider text-red-100">
                CRITICAL EMERGENCY DISPATCH PROTOCOL
              </div>
              <h3 className="text-base font-extrabold leading-tight">
                Emergency Track Block & Traction Power Disconnection
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="text-red-200 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-red-950/40 border border-red-800/80 p-3 rounded-xl text-red-200 flex items-start space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>WARNING:</strong> Triggering an Emergency Override will immediately set section signals to <strong>DANGER (Red)</strong>, halt approaching trains at rear stations, isolate 25 kV OHE traction power, and dispatch emergency gang protection.
            </div>
          </div>

          {/* Section Selector */}
          <div>
            <label className="text-[11px] font-bold text-white block mb-1">
              Select Incident Corridor Section:
            </label>
            <select
              value={selectedSectionId}
              onChange={e => setSelectedSectionId(e.target.value)}
              className="w-full bg-navy-900 border border-red-800 rounded-lg px-3 py-2 text-xs text-white font-medium"
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>
                  {s.sectionName} ({s.corridorName})
                </option>
              ))}
            </select>
          </div>

          {/* Emergency Incident Type */}
          <div>
            <label className="text-[11px] font-bold text-white block mb-1">
              Incident Category & Cause:
            </label>
            <select
              value={emergencyReason}
              onChange={e => setEmergencyReason(e.target.value)}
              className="w-full bg-navy-900 border border-red-800 rounded-lg px-3 py-2 text-xs text-white font-medium"
            >
              <option value="Rail Fracture / Weld Failure Detected">Rail Fracture / Weld Failure (USFD Red Alert)</option>
              <option value="OHE Catenary Wire Parting / Pantograph Entanglement">OHE Catenary Wire Parting / Pantograph Entanglement</option>
              <option value="Signal Electronic Interlocking Failure / Route Locking">Signal Electronic Interlocking Failure / Route Locking</option>
              <option value="Track Obstruction / Boulder / Fallen Tree">Track Obstruction / Boulder / Fallen Tree</option>
              <option value="Hot Axle / Brake Binding Defect on Passing Freight">Hot Axle / Brake Binding Defect on Passing Train</option>
            </select>
          </div>

          {/* Department & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-white block mb-1">Lead Department:</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as any)}
                className="w-full bg-navy-900 border border-railway-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="CIVIL_PWAY">Civil P-Way (Track Gang)</option>
                <option value="ELECTRICAL_TRD">Electrical TRD (Tower Wagon)</option>
                <option value="SIGNAL_TELECOM_SNT">Signal & Telecom (S&T)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-white block mb-1">Est. Duration (Mins):</label>
              <select
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-navy-900 border border-railway-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              >
                <option value={45}>45 mins (Quick Joint Clamp)</option>
                <option value={90}>90 mins (Rail Piece Replacement)</option>
                <option value={120}>120 mins (OHE Restringing)</option>
                <option value={180}>180 mins (Full Turnout Repair)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-navy-900 border-t border-railway-800 flex items-center justify-between">
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-1.5"
          >
            Cancel
          </button>

          {!isConfirming ? (
            <button
              onClick={() => setIsConfirming(true)}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg flex items-center space-x-1.5 animate-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Arm Emergency Override</span>
            </button>
          ) : (
            <button
              onClick={handleExecuteEmergency}
              className="bg-red-700 hover:bg-red-600 text-white text-xs font-black px-5 py-2 rounded-lg shadow-2xl flex items-center space-x-2 ring-2 ring-red-400 animate-bounce"
            >
              <Flame className="w-4 h-4" />
              <span>CONFIRM: IMPOSE EMERGENCY BLOCK NOW</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
