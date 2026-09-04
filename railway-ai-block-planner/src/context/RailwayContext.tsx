'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Division, 
  DivisionId, 
  TrackSection, 
  Train, 
  MaintenanceRequest, 
  ConflictAlert, 
  AnalyticsKpi, 
  User, 
  UserRole,
  AiBlockOption,
  SanctionMemoOrder,
  MaintenanceDepartment
} from '@/types';
import { 
  DIVISIONS, 
  TRACK_SECTIONS, 
  TRAINS, 
  MAINTENANCE_REQUESTS_INITIAL, 
  INITIAL_CONFLICT_ALERTS, 
  INITIAL_ANALYTICS, 
  CURRENT_USER 
} from '@/lib/constants';
import { runAiBlockOptimization, PlannerSimulationInput } from '@/lib/ai-planner-engine';

interface RailwayContextType {
  // Navigation & View
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDivisionId: DivisionId;
  setSelectedDivisionId: (id: DivisionId) => void;
  currentDivision: Division;

  // User & Role
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  switchRole: (role: UserRole) => void;

  // Data
  divisions: Division[];
  sections: TrackSection[];
  trains: Train[];
  maintenanceRequests: MaintenanceRequest[];
  conflictAlerts: ConflictAlert[];
  analytics: AnalyticsKpi;

  // Selection state for deep inspector sidebars/modals
  selectedSection: TrackSection | null;
  setSelectedSection: (sec: TrackSection | null) => void;
  selectedTrain: Train | null;
  setSelectedTrain: (trn: Train | null) => void;
  selectedRequest: MaintenanceRequest | null;
  setSelectedRequest: (req: MaintenanceRequest | null) => void;

  // Modals
  isAiPlannerOpen: boolean;
  setIsAiPlannerOpen: (open: boolean) => void;
  isApprovalModalOpen: boolean;
  setIsApprovalModalOpen: (open: boolean) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isMemoModalOpen: boolean;
  setIsMemoModalOpen: (open: boolean) => void;
  activeSanctionMemo: SanctionMemoOrder | null;
  setActiveSanctionMemo: (memo: SanctionMemoOrder | null) => void;

  // Actions
  generateAiBlockOptions: (input: PlannerSimulationInput) => AiBlockOption[];
  submitNewMaintenanceRequest: (reqData: Partial<MaintenanceRequest>) => MaintenanceRequest;
  approveBlockSchedule: (requestId: string, chosenOption: AiBlockOption, notes?: string) => void;
  rejectBlockSchedule: (requestId: string, reason: string) => void;
  triggerEmergencyOverride: (sectionId: string, reason: string, durationMins: number, department: MaintenanceDepartment) => MaintenanceRequest;
  markBlockExecutionComplete: (requestId: string) => void;
  resolveConflictAlert: (alertId: string) => void;

  // Simulation & Time Scrubber
  simulationTime: string; // "HH:MM"
  isSimulationRunning: boolean;
  setIsSimulationRunning: (running: boolean) => void;
  setSimulationTime: (time: string) => void;
  soundAlertsEnabled: boolean;
  setSoundAlertsEnabled: (enabled: boolean) => void;

  // Feedback Toast
  toastMessage: { text: string; type: 'success' | 'warning' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

const RailwayContext = createContext<RailwayContextType | undefined>(undefined);

export function RailwayProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDivisionId, setSelectedDivisionId] = useState<DivisionId>('NR_LKO');
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);

  const [divisions] = useState<Division[]>(DIVISIONS);
  const [sections, setSections] = useState<TrackSection[]>(TRACK_SECTIONS);
  const [trains, setTrains] = useState<Train[]>(TRAINS);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(MAINTENANCE_REQUESTS_INITIAL);
  const [conflictAlerts, setConflictAlerts] = useState<ConflictAlert[]>(INITIAL_CONFLICT_ALERTS);
  const [analytics, setAnalytics] = useState<AnalyticsKpi>(INITIAL_ANALYTICS);

  const [selectedSection, setSelectedSection] = useState<TrackSection | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [activeSanctionMemo, setActiveSanctionMemo] = useState<SanctionMemoOrder | null>(null);

  const [simulationTime, setSimulationTime] = useState<string>('09:30');
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(true);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => prev?.text === text ? null : prev);
    }, 4500);
  }, []);

  const currentDivision = divisions.find(d => d.id === selectedDivisionId) || divisions[0];

  const switchRole = (role: UserRole) => {
    let name = 'Devendra Kumar Verma';
    let designation = 'Sr. Divisional Operations Manager (Sr. DOM)';
    if (role === 'CONTROLLER') {
      designation = 'Section Controller / Chief Controller (Lucknow Control)';
    } else if (role === 'DOM') {
      designation = 'Divisional Operations Manager (DOM / Co-ord)';
    } else if (role === 'ENGINEER') {
      name = 'Er. Rajeshwar Nath';
      designation = 'Sr. Section Engineer (P-Way / Civil Track)';
    } else if (role === 'STATION_MASTER') {
      name = 'S. K. Bajpai';
      designation = 'Station Master (Lucknow Charbagh / Unnao Jn)';
    } else {
      name = 'Guest Visitor';
      designation = 'Indian Railways Operations Observer (Read-Only)';
    }

    setCurrentUser(prev => ({
      ...prev,
      role,
      name,
      designation,
    }));

    showToast(`Switched view to ${designation}`, 'info');
  };

  // Generate AI Optimization
  const generateAiBlockOptions = useCallback((input: PlannerSimulationInput): AiBlockOption[] => {
    return runAiBlockOptimization(input);
  }, []);

  // Submit New Maintenance Request
  const submitNewMaintenanceRequest = useCallback((reqData: Partial<MaintenanceRequest>): MaintenanceRequest => {
    const sec = sections.find(s => s.id === reqData.sectionId) || sections[0];
    const generatedOptions = runAiBlockOptimization({
      sectionId: sec.id,
      department: reqData.department || 'CIVIL_PWAY',
      durationMinutes: reqData.requiredDurationMinutes || 180,
      urgency: reqData.urgency || 'PLANNED_ROUTINE',
      lineDesignation: reqData.lineDesignation || 'DN_LINE',
      kmFrom: reqData.kmFrom || 10,
      kmTo: reqData.kmTo || 15,
      preferredDate: reqData.scheduledDate,
      machineType: reqData.machineType,
    });

    const newReq: MaintenanceRequest = {
      id: `REQ-${sec.divisionId.split('_')[1]}-2026-${Math.floor(100 + Math.random() * 900)}`,
      memoNumber: `${sec.divisionId.split('_')[0]}/${sec.divisionId.split('_')[1]}/DOM/BLK-2026/${Math.floor(1000 + Math.random() * 9000)}`,
      title: reqData.title || `Track Maintenance on ${sec.sectionName}`,
      sectionId: sec.id,
      divisionId: sec.divisionId,
      department: reqData.department || 'CIVIL_PWAY',
      urgency: reqData.urgency || 'PLANNED_ROUTINE',
      machineType: reqData.machineType || 'BCM_BALLAST_CLEANER',
      requiredDurationMinutes: reqData.requiredDurationMinutes || 180,
      lineDesignation: reqData.lineDesignation || 'DN_LINE',
      workDescription: reqData.workDescription || 'Routine maintenance and track safety enhancement.',
      kmFrom: reqData.kmFrom || 10,
      kmTo: reqData.kmTo || 15,
      cautionOrderRequired: reqData.cautionOrderRequired ?? true,
      temporarySpeedRestrictionKmph: reqData.temporarySpeedRestrictionKmph || 45,
      shadowBlockEligible: reqData.shadowBlockEligible ?? true,
      status: 'PROPOSED_BY_AI',
      selectedOption: generatedOptions[0],
      requesterName: currentUser.name,
      requesterDesignation: currentUser.designation,
      requesterPhone: '+91 97948 20000',
      createdAt: new Date().toISOString(),
      executionLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: `${currentUser.name} (${currentUser.role})`,
          role: currentUser.role,
          action: 'SUBMITTED',
          notes: `Requisition created for ${reqData.requiredDurationMinutes || 180} mins maintenance on ${sec.sectionName}.`,
        },
        {
          id: `LOG-${Date.now() + 1}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          author: 'AI Automatic Block Optimizer',
          role: 'AI_SYSTEM',
          action: 'AI_PROPOSED',
          notes: `Generated ${generatedOptions.length} conflict-free candidate windows. Top choice: ${generatedOptions[0]?.title} (${generatedOptions[0]?.startTime} - ${generatedOptions[0]?.endTime}).`,
        },
      ],
    };

    setMaintenanceRequests(prev => [newReq, ...prev]);

    // Check if high conflict warning needed
    if (newReq.urgency === 'CRITICAL_URGENT') {
      const newAlert: ConflictAlert = {
        id: `CONF-${Date.now()}`,
        severity: 'WARNING',
        title: `Urgent Requisition on ${sec.sectionName}`,
        sectionName: sec.sectionName,
        blockId: newReq.id,
        timestamp: 'Just now',
        description: `Urgent block requested for ${newReq.requiredDurationMinutes} mins. Review AI schedule immediately.`,
        autoResolved: false,
        resolutionAdvice: 'One-click sanction recommended Option A to minimize peak hour traffic delays.',
      };
      setConflictAlerts(prev => [newAlert, ...prev]);
    }

    showToast(`Block Requisition ${newReq.memoNumber} submitted and optimized by AI!`, 'success');
    return newReq;
  }, [currentUser, sections, showToast]);

  // Approve Block Schedule
  const approveBlockSchedule = useCallback((requestId: string, chosenOption: AiBlockOption, notes?: string) => {
    let approvedSectionId = '';
    let memoResult: SanctionMemoOrder | null = null;

    setMaintenanceRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        approvedSectionId = req.sectionId;
        const targetSec = sections.find(s => s.id === req.sectionId);
        const memoNumber = `SANCTION-${req.memoNumber.replace(/\//g, '-')}`;

        memoResult = {
          memoNumber,
          sanctionedDate: chosenOption.date || new Date().toISOString().split('T')[0],
          sanctionedTime: new Date().toTimeString().substring(0, 5),
          sanctioningController: `${currentUser.name} (${currentUser.designation})`,
          domIncharge: 'Sr. Divisional Operations Manager / Lucknow Control',
          sectionName: `${targetSec?.sectionName || 'Corridor Section'} (${req.lineDesignation})`,
          lineGranted: `${req.lineDesignation} - ${req.department} Block`,
          blockStartTime: chosenOption.startTime,
          blockEndTime: chosenOption.endTime,
          cautionOrderType: req.cautionOrderRequired ? `Form T/409 TSR ${req.temporarySpeedRestrictionKmph || 45} km/h` : 'No Speed Restriction (Normal Run)',
          speedRestrictionKmph: req.temporarySpeedRestrictionKmph || 45,
          powerDisconnectionStatus: req.department === 'ELECTRICAL_TRD' ? '25 kV Traction Power Feed Isolated & Grounded' : 'Normal Power Feed / TRD Standby',
          ohePermitToWorkIssued: true,
          stationMasterAcknowledgementCode: `SM-ACK-${Math.floor(1000 + Math.random() * 9000)}`,
          qrCodeDigest: `IR-BLOCK-${requestId}-${chosenOption.startTime}-${chosenOption.endTime}-VERIFIED`,
        };

        return {
          ...req,
          status: 'APPROVED_BY_CONTROLLER',
          selectedOption: chosenOption,
          scheduledDate: chosenOption.date,
          scheduledStartTime: chosenOption.startTime,
          scheduledEndTime: chosenOption.endTime,
          approvedBy: currentUser.name,
          approvedAt: new Date().toISOString(),
          memoSanctionOrder: memoResult,
          executionLogs: [
            ...req.executionLogs,
            {
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              author: `${currentUser.name} (${currentUser.role})`,
              role: currentUser.role,
              action: 'SANCTIONED_APPROVED',
              notes: notes || `Sanctioned AI Block Schedule (${chosenOption.startTime} - ${chosenOption.endTime}). Optimization Score: ${chosenOption.optimizationScore}/100. Expected Passenger Delay: ${chosenOption.predictedDelayMinutesTotal} mins.`,
            },
          ],
        };
      }
      return req;
    }));

    if (approvedSectionId) {
      setSections(prev => prev.map(s => {
        if (s.id === approvedSectionId) {
          return {
            ...s,
            currentStatus: 'MAINTENANCE_SCHEDULED',
            activeBlockId: requestId,
          };
        }
        return s;
      }));
    }

    // Update KPIs
    setAnalytics(prev => ({
      ...prev,
      totalBlockHoursGrantedToday: +(prev.totalBlockHoursGrantedToday + (chosenOption.durationMinutes / 60)).toFixed(1),
      delayHoursSavedMonthly: +(prev.delayHoursSavedMonthly + (chosenOption.dieselEnergySavedLitres / 100)).toFixed(1),
      trainDelayReductionPercent: Math.min(65.0, +(prev.trainDelayReductionPercent + 0.6).toFixed(1)),
      assetHealthScoreOverall: Math.min(99.0, +(prev.assetHealthScoreOverall + 0.4).toFixed(1)),
      shadowBlocksCombinedCount: chosenOption.shadowBlockOpportunities && chosenOption.shadowBlockOpportunities.length > 0
        ? prev.shadowBlocksCombinedCount + 1
        : prev.shadowBlocksCombinedCount,
    }));

    // Auto-resolve corresponding conflict alerts if any
    setConflictAlerts(prev => prev.map(alert => {
      if (alert.blockId === requestId) {
        return {
          ...alert,
          autoResolved: true,
          resolutionAdvice: `Resolved: Approved on non-conflicting slot ${chosenOption.startTime} - ${chosenOption.endTime}.`,
        };
      }
      return alert;
    }));

    if (memoResult) {
      setActiveSanctionMemo(memoResult);
    }

    showToast(`Block Sanction Order issued for ${chosenOption.startTime} - ${chosenOption.endTime}!`, 'success');
  }, [currentUser, sections, showToast]);

  // Reject Block Schedule
  const rejectBlockSchedule = useCallback((requestId: string, reason: string) => {
    setMaintenanceRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'REJECTED',
          rejectionReason: reason,
          executionLogs: [
            ...req.executionLogs,
            {
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              author: `${currentUser.name} (${currentUser.role})`,
              role: currentUser.role,
              action: 'REJECTED',
              notes: `Request rejected. Reason: ${reason}`,
            },
          ],
        };
      }
      return req;
    }));

    showToast(`Request ${requestId} rejected by Controller.`, 'warning');
  }, [currentUser, showToast]);

  // Trigger Emergency Override
  const triggerEmergencyOverride = useCallback((sectionId: string, reason: string, durationMins: number, department: MaintenanceDepartment): MaintenanceRequest => {
    const sec = sections.find(s => s.id === sectionId) || sections[0];
    const now = new Date();
    const startStr = now.toTimeString().substring(0, 5);
    const endMinutes = now.getHours() * 60 + now.getMinutes() + durationMins;
    const endStr = `${String(Math.floor(endMinutes / 60) % 24).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    const emergencyOption: AiBlockOption = {
      optionId: `OPT-EMERGENCY-${Date.now()}`,
      title: 'EMERGENCY IMMEDIATE INTERVENTION (Override Granted)',
      strategyType: 'EMERGENCY_FAST_PATH',
      startTime: startStr,
      endTime: endStr,
      durationMinutes: durationMins,
      date: now.toISOString().split('T')[0],
      predictedDelayMinutesTotal: 25,
      affectedTrainsCount: 3,
      affectedTrains: [
        {
          trainNumber: '12004',
          trainName: 'Lucknow Shatabdi',
          trainType: 'Shatabdi Express',
          priority: 'P1_RAJDHANI_SHATABDI',
          scheduledPassTime: 'Immediate',
          delayIncurredMinutes: 12,
          regulationAction: 'SINGLE_LINE_WORKING',
          actionLocation: 'Cross-over to adjacent line with pilot clearance',
        },
      ],
      optimizationScore: 90,
      dieselEnergySavedLitres: 120,
      assetAvailabilityGainPercent: 35.0,
      recommendationBadge: 'MAX_SAFETY',
      reasonSummary: `Emergency line block executed to avert track/OHE safety catastrophe. Single Line Working engaged.`,
    };

    const memoSanction: SanctionMemoOrder = {
      memoNumber: `EMERGENCY-SANCTION-${sec.divisionId}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sanctionedDate: now.toISOString().split('T')[0],
      sanctionedTime: startStr,
      sanctioningController: `${currentUser.name} (EMERGENCY DISPATCH)`,
      domIncharge: 'Divisional Safety Officer & Sr. DOM',
      sectionName: `${sec.sectionName} (EMERGENCY OVERRIDE)`,
      lineGranted: 'EMERGENCY FULL LINE ISOLATION',
      blockStartTime: startStr,
      blockEndTime: endStr,
      cautionOrderType: 'Emergency Stop / 20 km/h Pilot Protection',
      speedRestrictionKmph: 20,
      powerDisconnectionStatus: 'EMERGENCY TRACTION POWER DISCONNECTED',
      ohePermitToWorkIssued: true,
      stationMasterAcknowledgementCode: `EM-SM-${Math.floor(1000 + Math.random() * 9000)}`,
      qrCodeDigest: `IR-EMERGENCY-OVERRIDE-${sec.id}-${startStr}-CRITICAL`,
    };

    const newEmergencyReq: MaintenanceRequest = {
      id: `REQ-EMERGENCY-${Math.floor(100 + Math.random() * 900)}`,
      memoNumber: `NR/LKO/EMERGENCY/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      title: `EMERGENCY OVERRIDE: ${reason}`,
      sectionId: sec.id,
      divisionId: sec.divisionId,
      department: department || 'CIVIL_PWAY',
      urgency: 'EMERGENCY_OVERRIDE',
      machineType: 'MANUAL_GANG_MAINTENANCE',
      requiredDurationMinutes: durationMins,
      lineDesignation: 'BOTH_LINES',
      workDescription: `CRITICAL EMERGENCY INTERVENTION: ${reason}. Track blocked immediately for life-safety and derailment prevention.`,
      kmFrom: 20,
      kmTo: 22,
      cautionOrderRequired: true,
      temporarySpeedRestrictionKmph: 20,
      shadowBlockEligible: false,
      status: 'EMERGENCY_ACTIVE',
      selectedOption: emergencyOption,
      scheduledDate: now.toISOString().split('T')[0],
      scheduledStartTime: startStr,
      scheduledEndTime: endStr,
      requesterName: currentUser.name,
      requesterDesignation: currentUser.designation,
      requesterPhone: '+91 97948 20000',
      createdAt: now.toISOString(),
      approvedBy: currentUser.name,
      approvedAt: now.toISOString(),
      memoSanctionOrder: memoSanction,
      executionLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toISOString().replace('T', ' ').substring(0, 16),
          author: `${currentUser.name} (${currentUser.role})`,
          role: currentUser.role,
          action: 'EMERGENCY_OVERRIDE_SANCTIONED',
          notes: `Controller pushed EMERGENCY OVERRIDE for ${sec.sectionName}. All approaching signals set to DANGER (Red). Single-line working activated.`,
        },
      ],
    };

    setMaintenanceRequests(prev => [newEmergencyReq, ...prev]);

    // Set track section to BLOCKED
    setSections(prev => prev.map(s => {
      if (s.id === sec.id) {
        return {
          ...s,
          currentStatus: 'BLOCKED',
          activeBlockId: newEmergencyReq.id,
          currentTSR: {
            speedKm: 20,
            reason: `EMERGENCY OVERRIDE: ${reason}`,
            imposedDate: now.toISOString().split('T')[0],
          },
        };
      }
      return s;
    }));

    // Update Analytics
    setAnalytics(prev => ({
      ...prev,
      emergencyOverridesThisWeek: prev.emergencyOverridesThisWeek + 1,
      totalBlockHoursGrantedToday: +(prev.totalBlockHoursGrantedToday + (durationMins / 60)).toFixed(1),
    }));

    // Create Critical Conflict Alert
    const critAlert: ConflictAlert = {
      id: `CONF-EMERGENCY-${Date.now()}`,
      severity: 'CRITICAL',
      title: `🚨 EMERGENCY TRACK BLOCK ACTIVE on ${sec.sectionName}`,
      sectionName: sec.sectionName,
      blockId: newEmergencyReq.id,
      timestamp: 'Immediate',
      description: `Emergency block imposed for "${reason}". Trains in rear are being regulated at previous stations.`,
      autoResolved: false,
      resolutionAdvice: 'Ensure Station Master has verified physical clamping of points and pilot order issued.',
    };
    setConflictAlerts(prev => [critAlert, ...prev]);

    setActiveSanctionMemo(memoSanction);
    showToast(`🚨 EMERGENCY OVERRIDE IMPOSED on ${sec.sectionName}!`, 'error');

    return newEmergencyReq;
  }, [currentUser, sections, showToast]);

  // Mark Block Complete
  const markBlockExecutionComplete = useCallback((requestId: string) => {
    let completedSectionId = '';

    setMaintenanceRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        completedSectionId = req.sectionId;
        return {
          ...req,
          status: 'COMPLETED',
          executionLogs: [
            ...req.executionLogs,
            {
              id: `LOG-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              author: `${currentUser.name} (${currentUser.role})`,
              role: currentUser.role,
              action: 'COMPLETED_RESTORED',
              notes: 'Line clearance & track fitness memo received from Site Engineer. Track restored for normal train operations.',
            },
          ],
        };
      }
      return req;
    }));

    if (completedSectionId) {
      setSections(prev => prev.map(s => {
        if (s.id === completedSectionId) {
          return {
            ...s,
            currentStatus: 'CLEAR',
            activeBlockId: undefined,
            assetHealthIndex: Math.min(100, +(s.assetHealthIndex + 8.5).toFixed(1)),
            lastMaintainedDate: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      }));
    }

    setAnalytics(prev => ({
      ...prev,
      assetHealthScoreOverall: Math.min(99.4, +(prev.assetHealthScoreOverall + 0.8).toFixed(1)),
    }));

    showToast(`Track Maintenance Block completed! Section returned to CLEAR status.`, 'success');
  }, [currentUser, showToast]);

  // Resolve Conflict Alert
  const resolveConflictAlert = useCallback((alertId: string) => {
    setConflictAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          autoResolved: true,
          resolutionAdvice: 'Resolved manually by Section Controller.',
        };
      }
      return a;
    }));
    showToast('Alert resolved and marked in controller log.', 'info');
  }, [showToast]);

  // Simulation loop for train movements
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      // Advance clock by 1 minute
      setSimulationTime(prevTime => {
        const [h, m] = prevTime.split(':').map(Number);
        const nextMin = (m + 1) % 60;
        const nextHour = nextMin === 0 ? (h + 1) % 24 : h;
        return `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`;
      });

      // Subtle train position movement along coordinates
      setTrains(prevTrains => prevTrains.map(trn => {
        const deltaLat = (Math.random() - 0.5) * 0.002;
        const deltaLng = (Math.random() - 0.5) * 0.002;
        const speedJitter = Math.floor((Math.random() - 0.5) * 4);
        const newSpeed = Math.max(0, Math.min(trn.maxSpeed, trn.speedKmH + speedJitter));

        return {
          ...trn,
          currentLat: +(trn.currentLat + deltaLat).toFixed(4),
          currentLng: +(trn.currentLng + deltaLng).toFixed(4),
          speedKmH: newSpeed,
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  return (
    <RailwayContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDivisionId,
        setSelectedDivisionId,
        currentDivision,
        currentUser,
        setCurrentUser,
        switchRole,
        divisions,
        sections,
        trains,
        maintenanceRequests,
        conflictAlerts,
        analytics,
        selectedSection,
        setSelectedSection,
        selectedTrain,
        setSelectedTrain,
        selectedRequest,
        setSelectedRequest,
        isAiPlannerOpen,
        setIsAiPlannerOpen,
        isApprovalModalOpen,
        setIsApprovalModalOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isMemoModalOpen,
        setIsMemoModalOpen,
        activeSanctionMemo,
        setActiveSanctionMemo,
        generateAiBlockOptions,
        submitNewMaintenanceRequest,
        approveBlockSchedule,
        rejectBlockSchedule,
        triggerEmergencyOverride,
        markBlockExecutionComplete,
        resolveConflictAlert,
        simulationTime,
        isSimulationRunning,
        setIsSimulationRunning,
        setSimulationTime,
        soundAlertsEnabled,
        setSoundAlertsEnabled,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </RailwayContext.Provider>
  );
}

export function useRailway() {
  const context = useContext(RailwayContext);
  if (!context) {
    throw new Error('useRailway must be used within a RailwayProvider');
  }
  return context;
}
