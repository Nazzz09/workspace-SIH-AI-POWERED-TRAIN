'use client';

import React from 'react';
import { RailwayProvider, useRailway } from '@/context/RailwayContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import GisLeafletView from '@/components/map/GisLeafletView';
import CtcSchematicView from '@/components/map/CtcSchematicView';
import AiBlockPlannerTool from '@/components/planner/AiBlockPlannerTool';
import MaintenanceRequestsTable from '@/components/management/MaintenanceRequestsTable';
import MasterGanttVisualizer from '@/components/planner/MasterGanttVisualizer';
import DelayAnalyticsDashboard from '@/components/analytics/DelayAnalyticsDashboard';
import SanctionMemoDispatcher from '@/components/memo/SanctionMemoDispatcher';
import OperatingRulebook from '@/components/rulebook/OperatingRulebook';

// Modals
import AiBlockPlannerModal from '@/components/modals/AiBlockPlannerModal';
import BlockApprovalModal from '@/components/modals/BlockApprovalModal';
import EmergencyOverrideModal from '@/components/modals/EmergencyOverrideModal';
import BlockSanctionMemoModal from '@/components/modals/BlockSanctionMemoModal';

function MainAppContent() {
  const { activeTab, toastMessage } = useRailway();

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'map_gis':
        return <GisLeafletView />;
      case 'map_ctc':
        return <CtcSchematicView />;
      case 'ai_planner':
        return <AiBlockPlannerTool />;
      case 'requests':
        return <MaintenanceRequestsTable />;
      case 'gantt_schedule':
        return <MasterGanttVisualizer />;
      case 'analytics':
        return <DelayAnalyticsDashboard />;
      case 'memo_generator':
        return <SanctionMemoDispatcher />;
      case 'rulebook':
        return <OperatingRulebook />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090f1c] text-slate-100">
      {/* Top Fixed Control Bar */}
      <Navbar />

      {/* Body Layout: Sidebar + Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#060b16]/70">
          <div className="max-w-[1720px] mx-auto">
            {renderActiveTabContent()}
          </div>
        </main>
      </div>

      {/* Floating Global Modals */}
      <AiBlockPlannerModal />
      <BlockApprovalModal />
      <EmergencyOverrideModal />
      <BlockSanctionMemoModal />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-2.5 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/95 text-emerald-200 border-emerald-600 shadow-emerald-950/50'
            : toastMessage.type === 'error'
            ? 'bg-red-950/95 text-red-200 border-red-600 shadow-red-950/50'
            : toastMessage.type === 'warning'
            ? 'bg-amber-950/95 text-amber-200 border-amber-600 shadow-amber-950/50'
            : 'bg-navy-900/95 text-cyan-200 border-cyan-600 shadow-cyan-950/50'
        }`}>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}

export default function RailwayAppRoot() {
  return (
    <RailwayProvider>
      <MainAppContent />
    </RailwayProvider>
  );
}
