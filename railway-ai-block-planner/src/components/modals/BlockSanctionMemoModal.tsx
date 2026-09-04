'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import { 
  FileCheck2, 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Train as TrainIcon 
} from 'lucide-react';

export default function BlockSanctionMemoModal() {
  const { 
    isMemoModalOpen, 
    setIsMemoModalOpen, 
    activeSanctionMemo, 
    currentDivision,
    showToast 
  } = useRailway();

  if (!isMemoModalOpen || !activeSanctionMemo) return null;

  const handlePrint = () => {
    window.print();
    showToast('Printed official Form T/409 Sanction Order Memo.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="bg-slate-900 border border-railway-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8 text-slate-900">
        {/* Modal Top Bar */}
        <div className="p-3 bg-navy-950 border-b border-railway-800 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold font-mono">
              OFFICIAL SANCTION ORDER • FORM T/409 (IR-PWM)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-railway-700 hover:bg-railway-600 text-white text-xs px-3 py-1 rounded-lg flex items-center space-x-1 font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setIsMemoModalOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Official Printable Indian Railways Document */}
        <div className="p-8 bg-white text-slate-900 font-sans space-y-6 text-xs print:p-0 print:m-0">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-7 h-7 rounded bg-blue-900 text-amber-300 font-bold flex items-center justify-center text-xs">
                IR
              </div>
              <h2 className="text-sm font-black tracking-wider uppercase text-blue-950">
                भारतीय रेल • INDIAN RAILWAYS
              </h2>
            </div>
            <div className="text-xs font-bold text-slate-800 uppercase">
              {currentDivision.zone} • {currentDivision.name}
            </div>
            <div className="text-[11px] font-mono text-slate-600">
              Divisional Control Office, DRM Building, Hazratganj, Lucknow (U.P.)
            </div>
            <div className="mt-2 inline-block bg-slate-100 border border-slate-400 px-3 py-0.5 rounded text-[11px] font-black uppercase tracking-widest text-blue-900">
              FORM T/409: SANCTION ORDER FOR TRACK / TRAFFIC / POWER BLOCK
            </div>
          </div>

          {/* Memo Meta Table */}
          <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded bg-slate-50 font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block">Sanction Memo No:</span>
              <strong className="text-blue-950 font-bold text-xs">{activeSanctionMemo.memoNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Sanctioned Date & Time:</span>
              <strong className="text-slate-900 font-bold">
                {activeSanctionMemo.sanctionedDate} @ {activeSanctionMemo.sanctionedTime} hrs
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Sanctioning Controller:</span>
              <strong className="text-slate-900">{activeSanctionMemo.sanctioningController}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Divisional Operations In-charge:</span>
              <strong className="text-slate-900">{activeSanctionMemo.domIncharge}</strong>
            </div>
          </div>

          {/* Block Specifics Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase border-b border-slate-300 pb-1">
              1. Block Allocation & Operational Limits
            </h4>
            <div className="border border-slate-300 rounded overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-100 font-semibold">
                    <td className="p-2 w-1/3 text-slate-600">Track Section Granted:</td>
                    <td className="p-2 text-slate-900 font-bold">{activeSanctionMemo.sectionName}</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-600">Type of Block:</td>
                    <td className="p-2 text-slate-900 font-medium">{activeSanctionMemo.lineGranted}</td>
                  </tr>
                  <tr className="bg-slate-100 font-semibold">
                    <td className="p-2 text-slate-600">Sanctioned Time Window:</td>
                    <td className="p-2 text-emerald-800 font-mono font-black text-xs">
                      {activeSanctionMemo.blockStartTime} hrs &rarr; {activeSanctionMemo.blockEndTime} hrs
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-600">Caution Order & Speed Limit:</td>
                    <td className="p-2 text-red-700 font-bold font-mono">
                      {activeSanctionMemo.cautionOrderType} (Speed Limit: {activeSanctionMemo.speedRestrictionKmph} km/h)
                    </td>
                  </tr>
                  <tr className="bg-slate-100">
                    <td className="p-2 text-slate-600">25 kV Traction Power Isolation:</td>
                    <td className="p-2 text-slate-900 font-mono">{activeSanctionMemo.powerDisconnectionStatus}</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-slate-600">OHE Permit-To-Work (PTW):</td>
                    <td className="p-2 text-emerald-700 font-bold">
                      {activeSanctionMemo.ohePermitToWorkIssued ? '✓ ISSUED & CONFIRMED' : 'STANDBY'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* S&T & Station Master Telegraph Acknowledgment */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase border-b border-slate-300 pb-1">
              2. Station Master & Signalling Protocol
            </h4>
            <div className="p-3 bg-amber-50 border border-amber-300 rounded text-[11px] text-amber-900 space-y-1">
              <div>
                <strong>Operating Rule Compliance:</strong> Absolute adherence to General & Subsidiary Rules (G&SR) Chapter XV and Indian Railways Permanent Way Manual (IRPWM) Section 807.
              </div>
              <div className="flex justify-between pt-1 text-[10px] font-mono">
                <span>SM Telegraph Ack Code: <strong>{activeSanctionMemo.stationMasterAcknowledgementCode}</strong></span>
                <span>Signal Aspects: <strong>Controlled to Red/Danger</strong></span>
              </div>
            </div>
          </div>

          {/* Digital Signature & QR Verification */}
          <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-slate-100 border border-slate-400 rounded flex items-center justify-center text-slate-800">
                <QrCode className="w-10 h-10" />
              </div>
              <div className="text-[10px] font-mono text-slate-600">
                <div>Digital Verification Digest:</div>
                <div className="font-bold text-slate-900 truncate max-w-[220px]">{activeSanctionMemo.qrCodeDigest}</div>
                <div className="text-emerald-700 font-bold mt-0.5">✓ E-Signed & Validated via AI-ABPE</div>
              </div>
            </div>

            <div className="text-right text-[11px]">
              <div className="font-bold text-blue-950 uppercase">{activeSanctionMemo.sanctioningController}</div>
              <div className="text-slate-600 font-mono">Section Controller / Sr. DOM</div>
              <div className="text-[10px] text-slate-500">Northern & North Eastern Railway, Lucknow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
