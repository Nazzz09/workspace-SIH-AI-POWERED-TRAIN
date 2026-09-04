'use client';

import React, { useState } from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  MaintenanceDepartment, 
  MachineType, 
  LineDesignation, 
  UrgencyLevel, 
  AiBlockOption 
} from '@/types';
import { 
  Sparkles, 
  Cpu, 
  Clock, 
  Calendar, 
  Wrench, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Gauge, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Check
} from 'lucide-react';

export default function AiBlockPlannerTool() {
  const { 
    sections, 
    generateAiBlockOptions, 
    submitNewMaintenanceRequest, 
    approveBlockSchedule, 
    setActiveTab, 
    setSelectedRequest,
    setIsApprovalModalOpen,
    showToast
  } = useRailway();

  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[4]?.id || sections[0].id); // Default to Ajgain-Unnao
  const [department, setDepartment] = useState<MaintenanceDepartment>('CIVIL_PWAY');
  const [machineType, setMachineType] = useState<MachineType>('BCM_BALLAST_CLEANER');
  const [durationMinutes, setDurationMinutes] = useState<number>(180);
  const [lineDesignation, setLineDesignation] = useState<LineDesignation>('DN_LINE');
  const [urgency, setUrgency] = useState<UrgencyLevel>('PLANNED_ROUTINE');
  const [kmFrom, setKmFrom] = useState<number>(52.12);
  const [kmTo, setKmTo] = useState<number>(54.80);
  const [cautionOrderRequired, setCautionOrderRequired] = useState<boolean>(true);
  const [tsrSpeed, setTsrSpeed] = useState<number>(45);
  const [workDescription, setWorkDescription] = useState<string>(
    'Ballast deep screening by BCM to eliminate track pumping and restore line speed to 130 km/h.'
  );

  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [aiOptions, setAiOptions] = useState<AiBlockOption[] | null>(null);
  const [selectedAiOption, setSelectedAiOption] = useState<AiBlockOption | null>(null);

  const targetSection = sections.find(s => s.id === selectedSectionId) || sections[0];

  const handleRunAiSolver = () => {
    setIsSolving(true);
    setTimeout(() => {
      const results = generateAiBlockOptions({
        sectionId: selectedSectionId,
        department,
        durationMinutes,
        urgency,
        lineDesignation,
        kmFrom,
        kmTo,
        machineType,
      });
      setAiOptions(results);
      setSelectedAiOption(results[0]);
      setIsSolving(false);
      showToast('AI Timetable Conflict Engine: 3 Optimal Block Options Generated!', 'success');
    }, 900);
  };

  const handleApplyOption = (option: AiBlockOption) => {
    const createdReq = submitNewMaintenanceRequest({
      sectionId: selectedSectionId,
      department,
      machineType,
      requiredDurationMinutes: durationMinutes,
      lineDesignation,
      urgency,
      kmFrom,
      kmTo,
      cautionOrderRequired,
      temporarySpeedRestrictionKmph: tsrSpeed,
      workDescription,
      title: `${department.replace('_', ' ')} Maintenance on ${targetSection.sectionName}`,
    });

    approveBlockSchedule(createdReq.id, option);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-railway-900 via-navy-900 to-navy-950 p-5 rounded-2xl border border-railway-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400 text-navy-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded font-mono">
                INDIAN RAILWAYS AI SOLVER
              </span>
              <span className="text-cyan-400 text-xs font-mono">Lucknow Division NR/NER Operations</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              AI Automatic Block Planner & Timetable Optimization Engine
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Evaluates real-time train density, sectional headways, Vande Bharat / Rajdhani priority penalties, and track machine logistics to compute zero-delay and multi-department shadow block windows.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('gantt_schedule')}
            className="bg-navy-800 hover:bg-navy-700 border border-railway-700 text-cyan-300 text-xs px-3.5 py-2 rounded-lg font-semibold flex items-center space-x-1.5 shrink-0"
          >
            <Clock className="w-4 h-4" />
            <span>Open 24-Hr Master Gantt</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters Form (Left) + AI Recommendations & Gantt Visualizer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Input Form */}
        <div className="lg:col-span-5 bg-navy-900 border border-railway-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-railway-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded bg-railway-800 text-cyan-300">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Maintenance Requisition Parameters</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">IR-PWM Form S-1</span>
          </div>

          {/* Section Picker */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Select UP Track Corridor / Section:
            </label>
            <select
              value={selectedSectionId}
              onChange={e => setSelectedSectionId(e.target.value)}
              className="w-full bg-navy-950 border border-railway-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              {sections.map(s => (
                <option key={s.id} value={s.id}>
                  {s.sectionName} ({s.maxPermissibleSpeed} km/h | {s.currentStatus})
                </option>
              ))}
            </select>
          </div>

          {/* Department & Machine Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Department:
              </label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value as MaintenanceDepartment)}
                className="w-full bg-navy-950 border border-railway-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="CIVIL_PWAY">Civil Eng (P-Way / Track)</option>
                <option value="ELECTRICAL_TRD">Electrical TRD (OHE Traction)</option>
                <option value="SIGNAL_TELECOM_SNT">Signal & Telecom (S&T / EI)</option>
                <option value="MECHANICAL_CW">Mechanical C&W (Rolling Stock)</option>
                <option value="BRIDGE_ENG">Bridge Engineering</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Track Machine / Equipment:
              </label>
              <select
                value={machineType}
                onChange={e => setMachineType(e.target.value as MachineType)}
                className="w-full bg-navy-950 border border-railway-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="BCM_BALLAST_CLEANER">BCM (Ballast Cleaner)</option>
                <option value="CSM_DUOMATIC_TAMPER">CSM / Duomatic Tamper</option>
                <option value="DGS_STABILIZER">DGS Dynamic Stabilizer</option>
                <option value="T28_TURNOUT_RELAYING">T-28 Turnout Crane</option>
                <option value="TOWER_WAGON_OHE">TRD 8-Wheeler Tower Wagon</option>
                <option value="RAIL_GRINDING_RGM">RGM Rail Grinding Machine</option>
                <option value="MANUAL_GANG_MAINTENANCE">Manual Gang Maintenance</option>
                <option value="SIGNAL_TESTING_TROLLEY">S&T Testing Trolley</option>
              </select>
            </div>
          </div>

          {/* Line Designation & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Line Designation:
              </label>
              <select
                value={lineDesignation}
                onChange={e => setLineDesignation(e.target.value as LineDesignation)}
                className="w-full bg-navy-950 border border-railway-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="DN_LINE">Down (DN) Main Line</option>
                <option value="UP_LINE">Up (UP) Main Line</option>
                <option value="BOTH_LINES">Both UP & DN Lines (Mega-Block)</option>
                <option value="LOOP_LINE_1">Loop Line / Siding</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Urgency Level:
              </label>
              <select
                value={urgency}
                onChange={e => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full bg-navy-950 border border-railway-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
              >
                <option value="PLANNED_ROUTINE">Planned Routine (Standard)</option>
                <option value="CRITICAL_URGENT">Critical Urgent (Within 12h)</option>
                <option value="OPPORTUNISTIC_SHADOW">Shadow Mega Block (Co-shared)</option>
                <option value="EMERGENCY_OVERRIDE">Emergency Immediate Override</option>
              </select>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="bg-navy-950/80 p-3 rounded-lg border border-railway-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-semibold">Required Block Duration:</span>
              <span className="font-mono font-bold text-cyan-400 text-sm">
                {durationMinutes} mins ({(durationMinutes / 60).toFixed(1)} hrs)
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="360"
              step="15"
              value={durationMinutes}
              onChange={e => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-navy-850 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>30m</span>
              <span>1.5h</span>
              <span>3.0h (Standard BCM)</span>
              <span>4.5h</span>
              <span>6.0h (Mega)</span>
            </div>
          </div>

          {/* Kilometer Range & Caution Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Km From:</label>
              <input
                type="number"
                step="0.01"
                value={kmFrom}
                onChange={e => setKmFrom(Number(e.target.value))}
                className="w-full bg-navy-950 border border-railway-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">Km To:</label>
              <input
                type="number"
                step="0.01"
                value={kmTo}
                onChange={e => setKmTo(Number(e.target.value))}
                className="w-full bg-navy-950 border border-railway-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-navy-950/60 p-2.5 rounded-lg border border-railway-800 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={cautionOrderRequired}
                onChange={e => setCautionOrderRequired(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
              <span className="text-slate-200">Impose Caution Order (TSR):</span>
            </label>
            {cautionOrderRequired && (
              <div className="flex items-center space-x-1 font-mono">
                <input
                  type="number"
                  value={tsrSpeed}
                  onChange={e => setTsrSpeed(Number(e.target.value))}
                  className="w-16 bg-navy-900 border border-railway-700 rounded px-2 py-0.5 text-xs text-amber-300 font-bold"
                />
                <span className="text-[11px] text-slate-400">km/h</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Work Description & Scope:</label>
            <textarea
              value={workDescription}
              onChange={e => setWorkDescription(e.target.value)}
              rows={2}
              className="w-full bg-navy-950 border border-railway-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Run AI Engine Button */}
          <button
            onClick={handleRunAiSolver}
            disabled={isSolving}
            className="w-full bg-gradient-to-r from-railway-600 via-blue-600 to-cyan-600 hover:from-railway-500 hover:to-cyan-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2 transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSolving ? (
              <>
                <Cpu className="w-5 h-5 animate-spin text-amber-300" />
                <span>Simulating 24-Hr Timetable Conflict Matrix...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Run AI Automatic Block Optimizer</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: AI Solved Multi-Option Results & Gantt Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          {!aiOptions && (
            <div className="bg-navy-900 border border-railway-800 rounded-xl p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[440px]">
              <div className="w-16 h-16 rounded-2xl bg-railway-800/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-4 shadow-inner">
                <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white">AI Block Solver Ready</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Click <strong>"Run AI Automatic Block Optimizer"</strong> to simulate train headways across the Lucknow–Kanpur & UP network and generate conflict-free schedules.
              </p>
              <button
                onClick={handleRunAiSolver}
                className="mt-4 bg-railway-600 hover:bg-railway-500 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Generate Recommendations Now</span>
              </button>
            </div>
          )}

          {aiOptions && (
            <div className="space-y-4">
              {/* Top Banner with Solved Count */}
              <div className="bg-emerald-950/40 border border-emerald-800/80 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Optimization Completed:</strong> Evaluated 96 time bins. Found {aiOptions.length} conflict-free windows for {targetSection.sectionName}.
                  </span>
                </div>
                <span className="font-mono font-bold text-emerald-300 text-[11px]">Score: 98/100</span>
              </div>

              {/* Multi-Option Cards */}
              <div className="space-y-3">
                {aiOptions.map((opt, idx) => {
                  const isSelected = selectedAiOption?.optionId === opt.optionId;
                  return (
                    <div
                      key={opt.optionId}
                      onClick={() => setSelectedAiOption(opt)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-navy-850 border-cyan-500 shadow-xl ring-1 ring-cyan-500'
                          : 'bg-navy-900 border-railway-800 hover:border-railway-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-mono ${
                              opt.recommendationBadge === 'RECOMMENDED'
                                ? 'bg-amber-400 text-navy-950'
                                : opt.recommendationBadge === 'MEGA_BLOCK'
                                ? 'bg-purple-600 text-white'
                                : 'bg-cyan-600 text-white'
                            }`}>
                              ★ {opt.recommendationBadge}
                            </span>
                            <h4 className="text-xs font-bold text-white">{opt.title}</h4>
                          </div>

                          <div className="mt-2 flex items-baseline space-x-3">
                            <span className="text-xl font-black font-mono text-emerald-300 tracking-wider">
                              {opt.startTime} &rarr; {opt.endTime}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              ({opt.durationMinutes} mins / {opt.date})
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Optimization Score</div>
                          <div className="text-lg font-extrabold font-mono text-cyan-300">
                            {opt.optimizationScore} <span className="text-xs text-slate-400">/ 100</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{opt.reasonSummary}</p>

                      {/* Train Impact Details */}
                      <div className="mt-3 bg-navy-950/80 p-2.5 rounded-lg border border-railway-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                          <span>Train Precedence & Regulation Impact:</span>
                          <span className={opt.predictedDelayMinutesTotal === 0 ? 'text-emerald-400' : 'text-amber-400'}>
                            {opt.predictedDelayMinutesTotal} mins total delay
                          </span>
                        </div>

                        {opt.affectedTrains.map((trn, i) => (
                          <div key={i} className="text-[10px] font-mono flex items-center justify-between bg-navy-900 p-1.5 rounded border border-railway-800/60">
                            <span className="text-white font-bold">{trn.trainNumber} - {trn.trainName}</span>
                            <span className="text-cyan-300">{trn.regulationAction} ({trn.actionLocation})</span>
                          </div>
                        ))}
                      </div>

                      {/* Shadow Block Synergy Badge */}
                      {opt.shadowBlockOpportunities && opt.shadowBlockOpportunities.length > 0 && (
                        <div className="mt-2.5 bg-purple-950/40 border border-purple-800/60 p-2 rounded-lg text-xs flex items-center justify-between text-purple-200">
                          <div className="flex items-center space-x-1.5">
                            <Layers className="w-4 h-4 text-purple-300 shrink-0" />
                            <span>
                              <strong>Co-Allocated Shadow Block:</strong> {opt.shadowBlockOpportunities[0].suggestedWork}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-300 font-bold shrink-0">
                            +{opt.shadowBlockOpportunities[0].additionalEfficiencyGainPercent}% Gain
                          </span>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="mt-3 pt-2.5 border-t border-railway-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          Fuel Saved: <strong className="text-emerald-300 font-mono">~{opt.dieselEnergySavedLitres} L</strong>
                        </span>

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleApplyOption(opt);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 shadow transition transform hover:scale-[1.02]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Sanction & Issue Memo Order</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
