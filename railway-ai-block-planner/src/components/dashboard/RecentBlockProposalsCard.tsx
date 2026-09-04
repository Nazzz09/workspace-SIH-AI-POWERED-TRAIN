'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Wrench, 
  ShieldAlert, 
  Layers, 
  ArrowRight, 
  Check, 
  X,
  FileText
} from 'lucide-react';

export default function RecentBlockProposalsCard() {
  const { 
    maintenanceRequests, 
    approveBlockSchedule, 
    rejectBlockSchedule, 
    setSelectedRequest, 
    setIsApprovalModalOpen, 
    setActiveSanctionMemo,
    setIsMemoModalOpen,
    setActiveTab 
  } = useRailway();

  const proposedOrPending = maintenanceRequests.filter(r => r.status === 'PROPOSED_BY_AI' || r.status === 'APPROVED_BY_CONTROLLER');

  return (
    <div className="bg-navy-900 border border-railway-800/90 rounded-xl p-4 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-railway-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-amber-950/60 text-amber-400 border border-amber-800/50">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Block Sanction Queue</h3>
              <p className="text-[11px] text-slate-400">Algorithmic schedule recommendations ready for Section Controller approval</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('requests')}
            className="text-xs text-railway-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
          >
            <span>All Requests ({maintenanceRequests.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {proposedOrPending.slice(0, 3).map(req => {
            const opt = req.selectedOption;
            const isApproved = req.status === 'APPROVED_BY_CONTROLLER';

            return (
              <div
                key={req.id}
                className={`p-3 rounded-lg border transition ${
                  isApproved
                    ? 'bg-emerald-950/20 border-emerald-800/50'
                    : 'bg-navy-850 border-railway-700/80 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-navy-950 px-1.5 py-0.5 rounded text-cyan-300 border border-railway-800">
                        {req.memoNumber}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-railway-900 text-blue-200 border border-railway-700">
                        {req.department.replace('_', ' ')}
                      </span>
                      {opt?.recommendationBadge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-700">
                          ★ {opt.recommendationBadge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1.5">{req.title}</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{req.workDescription}</p>
                  </div>

                  <div className="text-right shrink-0">
                    {isApproved ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-700">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SANCTIONED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-700 animate-pulse">
                        <Clock className="w-3 h-3" />
                        <span>AWAITING DOM SANCTION</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Plan Summary Box */}
                {opt && (
                  <div className="mt-2.5 bg-navy-950/80 p-2 rounded border border-railway-800/80 text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Proposed Window</span>
                      <span className="font-mono font-bold text-emerald-300">{opt.startTime} - {opt.endTime}</span>
                      <span className="text-[9px] text-slate-400 block">({opt.durationMinutes} mins)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Delay Impact</span>
                      <span className={`font-mono font-bold ${opt.predictedDelayMinutesTotal === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {opt.predictedDelayMinutesTotal} mins total
                      </span>
                      <span className="text-[9px] text-slate-400 block">({opt.affectedTrainsCount} trains)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">AI Score</span>
                      <span className="font-mono font-bold text-cyan-300">{opt.optimizationScore} / 100</span>
                      <span className="text-[9px] text-slate-400 block">+{opt.assetAvailabilityGainPercent}% avail</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Shadow Opportunity</span>
                      <span className="font-semibold text-purple-300 truncate block">
                        {opt.shadowBlockOpportunities ? `${opt.shadowBlockOpportunities.length} Teams Ready` : 'Standalone'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="mt-2.5 pt-2 border-t border-railway-800/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    Req by: <strong className="text-slate-300">{req.requesterName}</strong>
                  </span>

                  <div className="flex items-center space-x-2">
                    {isApproved ? (
                      req.memoSanctionOrder && (
                        <button
                          onClick={() => {
                            setActiveSanctionMemo(req.memoSanctionOrder!);
                            setIsMemoModalOpen(true);
                          }}
                          className="bg-navy-800 hover:bg-navy-700 text-cyan-300 text-[11px] px-2.5 py-1 rounded border border-cyan-800 flex items-center space-x-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View Form T/409 Memo</span>
                        </button>
                      )
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setIsApprovalModalOpen(true);
                          }}
                          className="bg-navy-800 hover:bg-navy-700 text-slate-200 text-[11px] px-2.5 py-1 rounded border border-railway-700"
                        >
                          Detailed Review
                        </button>
                        <button
                          onClick={() => {
                            if (opt) approveBlockSchedule(req.id, opt);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded shadow flex items-center space-x-1 transition transform hover:scale-[1.02]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>1-Click Sanction</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
