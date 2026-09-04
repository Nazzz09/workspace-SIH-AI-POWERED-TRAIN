'use client';

import React from 'react';
import { useRailway } from '@/context/RailwayContext';
import { X, Sparkles } from 'lucide-react';
import AiBlockPlannerTool from '@/components/planner/AiBlockPlannerTool';

export default function AiBlockPlannerModal() {
  const { isAiPlannerOpen, setIsAiPlannerOpen } = useRailway();

  if (!isAiPlannerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div className="bg-navy-950 border border-railway-700 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-3 bg-navy-900 border-b border-railway-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-railway-800 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                AI Automatic Block Planning Engine (AI-ABPE)
              </h3>
              <p className="text-[10px] text-slate-400">
                Indian Railways Automated Decision Support System • Lucknow Division
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiPlannerOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          <AiBlockPlannerTool />
        </div>
      </div>
    </div>
  );
}
