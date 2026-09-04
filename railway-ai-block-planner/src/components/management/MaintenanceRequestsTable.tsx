'use client';

import React, { useState } from 'react';
import { useRailway } from '@/context/RailwayContext';
import { MaintenanceDepartment, MaintenanceRequest } from '@/types';
import { 
  ListOrdered, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ShieldAlert, 
  Sparkles, 
  FileText, 
  Check, 
  X, 
  RotateCcw,
  PlusCircle,
  Layers,
  ArrowUpDown
} from 'lucide-react';

export default function MaintenanceRequestsTable() {
  const { 
    maintenanceRequests, 
    approveBlockSchedule, 
    markBlockExecutionComplete, 
    setSelectedRequest, 
    setIsApprovalModalOpen, 
    setActiveSanctionMemo, 
    setIsMemoModalOpen,
    setIsAiPlannerOpen,
    currentUser
  } = useRailway();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  const filteredRequests = maintenanceRequests.filter(req => {
    const matchesSearch = 
      req.memoNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.workDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requesterName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    const matchesDept = deptFilter === 'ALL' || req.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStatusBadge = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'PROPOSED_BY_AI':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>AI PROPOSED</span>
          </span>
        );
      case 'APPROVED_BY_CONTROLLER':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-950/80 text-cyan-300 border border-blue-700">
            <CheckCircle2 className="w-3 h-3" />
            <span>SANCTIONED</span>
          </span>
        );
      case 'IN_EXECUTION':
      case 'EMERGENCY_ACTIVE':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-700 animate-bounce">
            <Wrench className="w-3 h-3" />
            <span>IN EXECUTION</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700">
            <Check className="w-3 h-3" />
            <span>COMPLETED</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-950/80 text-red-300 border border-red-700">
            <X className="w-3 h-3" />
            <span>REJECTED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
            <span>PENDING</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-navy-900 border border-railway-800 rounded-xl p-5 shadow-2xl space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-railway-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ListOrdered className="w-4 h-4 text-cyan-400" />
            <span>Divisional Maintenance Block Request Registry</span>
            <span className="bg-navy-950 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-railway-800">
              {filteredRequests.length} Records
            </span>
          </h3>
          <p className="text-[11px] text-slate-400">
            Track, OHE, Signal & Bridge maintenance block requisitions across Lucknow & UP divisions
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsAiPlannerOpen(true)}
          className="bg-railway-600 hover:bg-railway-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Create AI Requisition</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-navy-950/80 p-3 rounded-lg border border-railway-800">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search memo number, title, engineer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-navy-900 border border-railway-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-navy-900 border border-railway-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Requisition Statuses</option>
            <option value="PROPOSED_BY_AI">AI Proposed (Awaiting Sanction)</option>
            <option value="APPROVED_BY_CONTROLLER">Sanctioned / Approved</option>
            <option value="IN_EXECUTION">In Execution / Emergency Active</option>
            <option value="COMPLETED">Completed & Track Restored</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="w-full bg-navy-900 border border-railway-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Departments</option>
            <option value="CIVIL_PWAY">Civil Eng (P-Way / Track)</option>
            <option value="ELECTRICAL_TRD">Electrical TRD (OHE Traction)</option>
            <option value="SIGNAL_TELECOM_SNT">Signal & Telecom (S&T)</option>
            <option value="MECHANICAL_CW">Mechanical C&W</option>
            <option value="BRIDGE_ENG">Bridge Engineering</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-lg border border-railway-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-navy-950 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-railway-800">
            <tr>
              <th className="p-3">Memo ID & Date</th>
              <th className="p-3">Section & Scope</th>
              <th className="p-3">Department & Machine</th>
              <th className="p-3">Block Window</th>
              <th className="p-3">AI Score & Impact</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Controller Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-railway-800/60 font-medium">
            {filteredRequests.map(req => {
              const opt = req.selectedOption;
              const isApproved = req.status === 'APPROVED_BY_CONTROLLER';
              const isCompleted = req.status === 'COMPLETED';

              return (
                <tr key={req.id} className="hover:bg-navy-850/80 transition">
                  {/* Memo ID */}
                  <td className="p-3">
                    <div className="font-mono font-bold text-cyan-300">{req.memoNumber}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Req by: {req.requesterName}
                    </div>
                  </td>

                  {/* Section & Scope */}
                  <td className="p-3 max-w-xs">
                    <div className="text-white font-bold truncate">{req.title}</div>
                    <div className="text-[10px] text-slate-300 truncate mt-0.5">
                      {req.lineDesignation.replace('_', ' ')} • Km {req.kmFrom} - {req.kmTo}
                    </div>
                  </td>

                  {/* Dept & Machine */}
                  <td className="p-3">
                    <span className="inline-block bg-railway-800 text-blue-200 px-2 py-0.5 rounded text-[10px] font-semibold border border-railway-700">
                      {req.department.replace('_', ' ')}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {req.machineType.replace('_', ' ')}
                    </div>
                  </td>

                  {/* Proposed Window */}
                  <td className="p-3">
                    {opt ? (
                      <div>
                        <div className="font-mono font-bold text-emerald-300">
                          {opt.startTime} &rarr; {opt.endTime}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {opt.durationMinutes} mins ({opt.date})
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-mono">Pending AI</span>
                    )}
                  </td>

                  {/* AI Score */}
                  <td className="p-3">
                    {opt ? (
                      <div>
                        <div className="font-mono font-bold text-cyan-400">
                          {opt.optimizationScore}/100 Score
                        </div>
                        <div className={`text-[10px] ${opt.predictedDelayMinutesTotal === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {opt.predictedDelayMinutesTotal}m total delay
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    {getStatusBadge(req.status)}
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      {req.status === 'PROPOSED_BY_AI' && opt && (
                        <button
                          onClick={() => approveBlockSchedule(req.id, opt)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow flex items-center space-x-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Sanction</span>
                        </button>
                      )}

                      {isApproved && (
                        <>
                          <button
                            onClick={() => {
                              if (req.memoSanctionOrder) {
                                setActiveSanctionMemo(req.memoSanctionOrder);
                                setIsMemoModalOpen(true);
                              }
                            }}
                            className="bg-navy-800 hover:bg-navy-700 border border-cyan-800 text-cyan-300 text-[10px] px-2 py-1 rounded flex items-center space-x-1"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Form T/409</span>
                          </button>
                          <button
                            onClick={() => markBlockExecutionComplete(req.id)}
                            className="bg-purple-900/80 hover:bg-purple-800 border border-purple-700 text-purple-200 text-[10px] font-bold px-2 py-1 rounded flex items-center space-x-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Restore Fit</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setIsApprovalModalOpen(true);
                        }}
                        className="bg-navy-800 hover:bg-navy-700 border border-railway-700 text-slate-300 text-[10px] px-2 py-1 rounded"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
