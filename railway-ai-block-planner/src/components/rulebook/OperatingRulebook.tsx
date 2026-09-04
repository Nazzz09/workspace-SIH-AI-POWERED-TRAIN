'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Wrench, 
  FileText, 
  ChevronRight, 
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function OperatingRulebook() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const rulebookSections = [
    {
      category: 'GSR',
      title: 'G&SR 15.06: Traffic & Power Block Protocols',
      authority: 'General & Subsidiary Rules (Indian Railways)',
      summary: 'When a line is required to be blocked for engineering, electrical or signal maintenance, the Section Controller shall not grant the block until written or electronic memo confirmation has been exchanged with Station Masters at both ends of the section.',
      keyRules: [
        'Single Line Working (SLW) must be initiated with Paper Line Clear Ticket (PLCT) or Electronic Token if both lines are not available.',
        'Speed for pilot train entering block section under caution order is restricted to 25 km/h during day and 15 km/h during night/fog.',
        'All facing points in the block territory must be physically padlocked or clamped by Station Master staff before block commencement.',
      ]
    },
    {
      category: 'IRPWM',
      title: 'IRPWM Chapter 8: Mechanised Track Maintenance & BCM Standards',
      authority: 'Indian Railways Permanent Way Manual (2020 Edition)',
      summary: 'Guidelines for continuous deep screening machines (BCM), tie tamping machines (CSM/Duomatic), and turnout relaying cranes (T-28).',
      keyRules: [
        'Minimum block duration for BCM output: 3 hours continuous window to achieve effective screening rate of 1.2 to 1.5 track-km.',
        'Initial train speed over newly screened track without dynamic track stabilizer (DGS) is 20 km/h with gradual ramp-up to 45 km/h, 75 km/h, and 130 km/h after 72 hours.',
        'Shadow block must be utilized wherever possible to allow TRD and S&T staff to conduct parallel maintenance during track closures.',
      ]
    },
    {
      category: 'TRD',
      title: 'ACTM Vol-II: 25 kV AC Traction Power Disconnection & Permit To Work (PTW)',
      authority: 'AC Traction Manual (TRD Department)',
      summary: 'Protocols for isolating 25,000 Volt overhead equipment (OHE) feeders, discharging residual capacitive charge, and providing track earthing poles.',
      keyRules: [
        'No person or track machine shall approach within 2.0 meters of live 25 kV OHE conductor without an authorized PTW.',
        'Feeder circuit breakers must be racked out, tagged, and locked at the feeding traction sub-station (TSS) before issuing power block memo.',
        'Discharge and earthing rods must be affixed on either side of the work zone at a distance not exceeding 1,000 meters.',
      ]
    },
    {
      category: 'SNT',
      title: 'SEM Part-I: Disconnection Memo & Electronic Interlocking Safety',
      authority: 'Signal Engineering Manual (S&T Department)',
      summary: 'Mandatory issuance of Form S&T (T-351) before disconnecting track circuits, point detection circuits, or digital axle counters.',
      keyRules: [
        'Disconnection notice must be signed by Station Master before signal technician intervenes on relay rooms or point machines.',
        'Dual VDU Electronic Interlocking hot-standby changeover must be verified with all signals showing Red/Danger during calibration.',
        'Axle Counter track heads (MSDAC) must undergo wheel simulator testing before restoring normal line speed.',
      ]
    },
    {
      category: 'PRECEDENCE',
      title: 'Indian Railways Train Precedence & Punctuality Directives',
      authority: 'Railway Board Operations Directorate',
      summary: 'Hierarchical right-of-way rules governing train sequencing and block scheduling across high-density corridors.',
      keyRules: [
        'Priority 1: Vande Bharat Express, Rajdhani Express, Shatabdi Express and Tejas Express hold absolute right-of-way. No planned block may impart >5 mins delay on P1 trains.',
        'Priority 2: Superfast Mail/Express trains take precedence over ordinary passenger trains and freight rakes.',
        'Priority 3: Heavy haul freight rakes (BOXN, BTPN, BLC) may be regulated in passing loops for up to 60 minutes during shadow block execution.',
      ]
    },
  ];

  const filteredRules = rulebookSections.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.keyRules.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = activeCategory === 'ALL' || r.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="bg-navy-900 border border-railway-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-white">
              Indian Railways Operating & Engineering Rulebook Reference
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            G&SR, IRPWM, ACTM & Signal Engineering Manual Protocols governing Lucknow Division Track Block Operations
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search rules, codes, manuals..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-navy-950 border border-railway-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {[
          { id: 'ALL', label: 'All Manuals' },
          { id: 'GSR', label: 'G&SR (Traffic Block)' },
          { id: 'IRPWM', label: 'IRPWM (Track / Civil)' },
          { id: 'TRD', label: 'ACTM (OHE Power Block)' },
          { id: 'SNT', label: 'SEM (Signal & Telecom)' },
          { id: 'PRECEDENCE', label: 'Train Priority Directives' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              activeCategory === cat.id
                ? 'bg-railway-600 text-white border-cyan-400 shadow'
                : 'bg-navy-900 text-slate-400 border-railway-800 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule, idx) => (
          <div key={idx} className="bg-navy-900 border border-railway-800 rounded-xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-railway-950 text-amber-400 border border-amber-500/30">
                  {rule.authority}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2">{rule.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rule.summary}</p>

              <div className="mt-3 bg-navy-950/80 p-3 rounded-lg border border-railway-800/80 space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Mandatory Execution Guidelines:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {rule.keyRules.map((kr, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{kr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-railway-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center space-x-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>IR Safety Compliant</span>
              </span>
              <span>Ref: Lucknow Operating Circular 2026</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
