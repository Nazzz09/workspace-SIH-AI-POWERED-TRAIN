'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  FileCheck2, 
  Printer, 
  Search, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function SanctionMemoDispatcher() {
  const { 
    maintenanceRequests, 
    setActiveSanctionMemo, 
    setIsMemoModalOpen,
    currentDivision 
  } = useRailway();

  const sanctionedRequests = maintenanceRequests.filter(r => r.memoSanctionOrder);

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-navy-900 border border-railway-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-extrabold text-white">
              Form T/409 Block Sanction & Caution Order Dispatcher
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official Indian Railways Operating Form T/409 (Notice of Track, Power and Signal Maintenance Block)
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-mono">Issuing Authority:</span>
          <span className="text-xs font-bold text-amber-300">
            Divisional Operations Manager (DOM / Section Control), {currentDivision.headquarters}
          </span>
        </div>
      </div>

      {/* Sanction Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sanctionedRequests.map(req => {
          const memo = req.memoSanctionOrder!;
          return (
            <div
              key={req.id}
              className="bg-navy-900 border border-railway-800 rounded-xl p-4 shadow-xl flex flex-col justify-between hover:border-cyan-500/50 transition group"
            >
              <div>
                <div className="flex items-start justify-between border-b border-railway-800 pb-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-navy-950 px-2 py-0.5 rounded border border-railway-800">
                    {memo.memoNumber}
                  </span>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>VERIFIED</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mt-2 group-hover:text-amber-300 transition">
                  {memo.sectionName}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{memo.lineGranted}</p>

                <div className="mt-3 bg-navy-950 p-2.5 rounded-lg border border-railway-800 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sanctioned Window:</span>
                    <strong className="text-emerald-400 font-mono">{memo.blockStartTime} - {memo.blockEndTime} hrs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Caution Order:</span>
                    <strong className="text-amber-300 font-mono">{memo.speedRestrictionKmph} km/h (TSR)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Station Ack Code:</span>
                    <span className="text-cyan-300 font-mono">{memo.stationMasterAcknowledgementCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sanctioning Officer:</span>
                    <span className="text-slate-200 truncate max-w-[140px]">{memo.sanctioningController}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-railway-800 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                  <QrCode className="w-4 h-4 text-slate-500" />
                  <span>E-Signed</span>
                </div>

                <button
                  onClick={() => {
                    setActiveSanctionMemo(memo);
                    setIsMemoModalOpen(true);
                  }}
                  className="bg-railway-700 hover:bg-railway-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>View Printable Form</span>
                </button>
              </div>
            </div>
          );
        })}

        {sanctionedRequests.length === 0 && (
          <div className="col-span-3 bg-navy-900 border border-railway-800 rounded-xl p-8 text-center text-slate-400">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No Sanctioned Memos Yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Sanction any pending block in the Maintenance Registry or AI Planner to generate official Form T/409 notices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
