'use client';

import React, { useState } from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Layers, 
  Wrench, 
  FileText, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export default function BlockApprovalModal() {
  const { 
    isApprovalModalOpen, 
    setIsApprovalModalOpen, 
    selectedRequest, 
    approveBlockSchedule, 
    rejectBlockSchedule, 
    currentUser,
    sections 
  } = useRailway();

  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isApprovalModalOpen || !selectedRequest) return null;

  const opt = selectedRequest.selectedOption;
  const sec = sections.find(s => s.id === selectedRequest.sectionId);

  const handleApprove = () => {
    if (opt) {
      approveBlockSchedule(selectedRequest.id, opt, approvalNotes);
      setIsApprovalModalOpen(false);
    }
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      rejectBlockSchedule(selectedRequest.id, rejectReason);
      setIsApprovalModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="bg-navy-900 border border-railway-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-railway-900 to-navy-950 border-b border-railway-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-railway-700 flex items-center justify-center text-cyan-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                Section Controller Sanction Desk • Form T/409
              </div>
              <h3 className="text-sm font-bold text-white">
                Review & Sanction Track Maintenance Block
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsApprovalModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Request Header Dossier */}
          <div className="bg-navy-950 p-3.5 rounded-xl border border-railway-800 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-cyan-400 font-bold text-[11px]">{selectedRequest.memoNumber}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{selectedRequest.title}</h4>
              </div>
              <span className="text-[10px] font-mono bg-railway-800 text-blue-200 px-2 py-0.5 rounded border border-railway-700">
                {selectedRequest.department.replace('_', ' ')}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">{selectedRequest.workDescription}</p>

            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-2 border-t border-railway-800/80">
              <div>
                <span className="text-slate-400 block">Section:</span>
                <span className="text-white font-bold">{sec?.sectionName || selectedRequest.sectionId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Line Granted:</span>
                <span className="text-white font-bold">{selectedRequest.lineDesignation.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Location:</span>
                <span className="text-white font-bold">Km {selectedRequest.kmFrom} - {selectedRequest.kmTo}</span>
              </div>
            </div>
          </div>

          {/* AI Recommended Window */}
          {opt && (
            <div className="bg-emerald-950/30 border border-emerald-800/70 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-xs">{opt.title}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-300">
                  AI Score: {opt.optimizationScore}/100
                </span>
              </div>

              <div className="flex items-baseline space-x-3 text-emerald-300 font-mono">
                <span className="text-xl font-black">{opt.startTime} &rarr; {opt.endTime} hrs</span>
                <span className="text-xs text-slate-300">({opt.durationMinutes} mins / Date: {opt.date})</span>
              </div>

              <p className="text-[11px] text-slate-300">{opt.reasonSummary}</p>

              {/* Train impact list */}
              <div className="bg-navy-950/70 p-2 rounded border border-railway-800 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Train Precedence & Regulation Impact ({opt.affectedTrainsCount} Trains):
                </span>
                {opt.affectedTrains.map((trn, i) => (
                  <div key={i} className="text-[10px] font-mono flex items-center justify-between text-slate-300">
                    <span className="font-bold text-white">{trn.trainNumber} ({trn.trainType})</span>
                    <span className="text-cyan-300">{trn.regulationAction} • Delay: +{trn.delayIncurredMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controller Notes Input */}
          {!isRejecting ? (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Section Controller Sanction Memo Instructions / Cautions:
              </label>
              <textarea
                placeholder="e.g. Single Line Working authorized on adjacent UP line with 50 km/h pilot caution. Station Master Unnao to clamp point 214A."
                value={approvalNotes}
                onChange={e => setApprovalNotes(e.target.value)}
                rows={2}
                className="w-full bg-navy-950 border border-railway-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
              />
            </div>
          ) : (
            <div className="bg-red-950/30 border border-red-800 p-3 rounded-xl space-y-2">
              <label className="text-[11px] font-bold text-red-300 block">
                Reason for Controller Rejection:
              </label>
              <textarea
                placeholder="Specify reason (e.g. Clash with VIP Special Train or Mega Traffic movement)..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={2}
                className="w-full bg-navy-950 border border-red-700 rounded-lg p-2 text-xs text-white focus:outline-none placeholder-slate-500"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-navy-950 border-t border-railway-800 flex items-center justify-between">
          {!isRejecting ? (
            <>
              <button
                onClick={() => setIsRejecting(true)}
                className="text-red-400 hover:text-red-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-800/60 hover:bg-red-950/40"
              >
                Reject Request
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsApprovalModalOpen(false)}
                  className="bg-navy-850 hover:bg-navy-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-railway-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-lg flex items-center space-x-1.5 transition transform hover:scale-[1.02]"
                >
                  <Check className="w-4 h-4" />
                  <span>Sanction Block Memo (T/409)</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsRejecting(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-1.5"
              >
                Back to Approval
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow"
              >
                Confirm Rejection
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
