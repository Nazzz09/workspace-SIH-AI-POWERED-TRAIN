export type UserRole = 'CONTROLLER' | 'DOM' | 'ENGINEER' | 'STATION_MASTER' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  divisionId: DivisionId;
  email: string;
  designation: string;
  badgeNumber: string;
  location: string;
}

export type DivisionId = 
  | 'NR_LKO' 
  | 'NER_LJN' 
  | 'NCR_PRYJ' 
  | 'NR_MB' 
  | 'NER_GKP' 
  | 'NR_BSB'
  | 'NCR_CNB';

export interface Division {
  id: DivisionId;
  code: string;
  name: string;
  hindiName: string;
  zone: string;
  headquarters: string;
  totalSections: number;
  activeTrainsCount: number;
  assetHealthScore: number;
  controllerName: string;
  routeKm: number;
  electrifiedKm: number;
}

export interface Station {
  code: string;
  name: string;
  hindiName: string;
  lat: number;
  lng: number;
  division: DivisionId;
  totalPlatforms: number;
  totalLines: number;
  isJunction: boolean;
  category: 'NSG-1' | 'NSG-2' | 'NSG-3' | 'SG-1';
  connectedTo: string[];
}

export type LineDesignation = 'UP_LINE' | 'DN_LINE' | 'BOTH_LINES' | 'SINGLE_LINE' | 'LOOP_LINE_1' | 'YARD_LINE';

export interface TrackSection {
  id: string;
  divisionId: DivisionId;
  sectionName: string;
  corridorName: string;
  stationFrom: string;
  stationTo: string;
  distanceKm: number;
  totalTracks: number;
  lineType: LineDesignation;
  maxPermissibleSpeed: number; // km/h
  currentStatus: 'CLEAR' | 'BLOCKED' | 'CAUTION' | 'MAINTENANCE_SCHEDULED' | 'EMERGENCY_SPEED_RESTRICTION';
  oheVoltage: string;
  signallingType: string;
  assetHealthIndex: number; // 0-100
  lastMaintainedDate: string;
  nextDueMaintenanceDate: string;
  coordinates: [number, number][]; // [[lat, lng], [lat, lng]]
  currentTSR?: {
    speedKm: number;
    reason: string;
    imposedDate: string;
  };
  gradient?: string;
  activeBlockId?: string;
}

export type TrainPriority = 
  | 'P1_VANDE_BHARAT' 
  | 'P1_RAJDHANI_SHATABDI' 
  | 'P2_SUPERFAST_MAIL' 
  | 'P3_PASSENGER_MEMU' 
  | 'P4_FREIGHT';

export type TrainType = 
  | 'Vande Bharat' 
  | 'Rajdhani Express' 
  | 'Shatabdi Express' 
  | 'Superfast Mail' 
  | 'Express' 
  | 'MEMU Passenger' 
  | 'Freight BTPN' 
  | 'Freight Container (BLC)' 
  | 'Track Machine Special';

export interface TrainScheduleStop {
  stationCode: string;
  stationName: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualArrival?: string;
  actualDeparture?: string;
  platform: string;
}

export interface Train {
  id: string;
  trainNumber: string;
  trainName: string;
  trainType: TrainType;
  priority: TrainPriority;
  origin: string;
  destination: string;
  currentSectionId: string;
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  maxSpeed: number;
  scheduledDeparture: string;
  delayMinutes: number;
  direction: 'UP' | 'DN';
  status: 'RUNNING_ON_TIME' | 'SLIGHT_DELAY' | 'REGULATED' | 'HALTED_AT_STATION' | 'DIVERTED';
  rakeComposition: string;
  locoType: string;
  timetable: TrainScheduleStop[];
  nextStation: string;
  etaNextStation: string;
}

export type MaintenanceDepartment = 
  | 'CIVIL_PWAY' 
  | 'ELECTRICAL_TRD' 
  | 'SIGNAL_TELECOM_SNT' 
  | 'MECHANICAL_CW' 
  | 'BRIDGE_ENG';

export type UrgencyLevel = 
  | 'EMERGENCY_OVERRIDE' 
  | 'CRITICAL_URGENT' 
  | 'PLANNED_ROUTINE' 
  | 'OPPORTUNISTIC_SHADOW';

export type MachineType = 
  | 'BCM_BALLAST_CLEANER' 
  | 'CSM_DUOMATIC_TAMPER' 
  | 'DGS_STABILIZER' 
  | 'T28_TURNOUT_RELAYING' 
  | 'TOWER_WAGON_OHE' 
  | 'RAIL_GRINDING_RGM' 
  | 'MANUAL_GANG_MAINTENANCE' 
  | 'SIGNAL_TESTING_TROLLEY';

export interface ExecutionLog {
  id: string;
  timestamp: string;
  author: string;
  role: string;
  action: string;
  notes: string;
}

export interface AffectedTrainImpact {
  trainNumber: string;
  trainName: string;
  trainType: TrainType;
  priority: TrainPriority;
  scheduledPassTime: string;
  delayIncurredMinutes: number;
  regulationAction: 'PASS_NORMAL' | 'LOOP_REGULATION' | 'SINGLE_LINE_WORKING' | 'SPEED_RESTRICTION' | 'DIVERTED_VIA_LOOP';
  actionLocation?: string;
}

export interface ShadowBlockOpportunity {
  department: MaintenanceDepartment;
  suggestedWork: string;
  crewDetails: string;
  additionalEfficiencyGainPercent: number;
}

export interface AiBlockOption {
  optionId: string;
  title: string;
  strategyType: 'ZERO_DELAY_NIGHT' | 'SHADOW_MEGA_BLOCK' | 'MINIMAL_PASSENGER_REGULATION' | 'EMERGENCY_FAST_PATH';
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  predictedDelayMinutesTotal: number;
  affectedTrainsCount: number;
  affectedTrains: AffectedTrainImpact[];
  shadowBlockOpportunities?: ShadowBlockOpportunity[];
  optimizationScore: number; // 0 - 100
  dieselEnergySavedLitres: number;
  assetAvailabilityGainPercent: number;
  recommendationBadge: 'RECOMMENDED' | 'MAX_SAFETY' | 'FASTEST_EXECUTION' | 'MEGA_BLOCK';
  reasonSummary: string;
}

export interface MaintenanceRequest {
  id: string;
  memoNumber: string;
  title: string;
  sectionId: string;
  divisionId: DivisionId;
  department: MaintenanceDepartment;
  urgency: UrgencyLevel;
  machineType: MachineType;
  requiredDurationMinutes: number;
  lineDesignation: LineDesignation;
  workDescription: string;
  kmFrom: number;
  kmTo: number;
  cautionOrderRequired: boolean;
  temporarySpeedRestrictionKmph?: number;
  shadowBlockEligible: boolean;
  status: 'PENDING_AI_ANALYSIS' | 'PROPOSED_BY_AI' | 'APPROVED_BY_CONTROLLER' | 'IN_EXECUTION' | 'COMPLETED' | 'REJECTED' | 'EMERGENCY_ACTIVE';
  
  // Scheduled times if approved or proposed
  selectedOption?: AiBlockOption;
  scheduledDate?: string;
  scheduledStartTime?: string;
  scheduledEndTime?: string;

  requesterName: string;
  requesterDesignation: string;
  requesterPhone: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  executionLogs: ExecutionLog[];
  memoSanctionOrder?: SanctionMemoOrder;
}

export interface SanctionMemoOrder {
  memoNumber: string;
  sanctionedDate: string;
  sanctionedTime: string;
  sanctioningController: string;
  domIncharge: string;
  sectionName: string;
  lineGranted: string;
  blockStartTime: string;
  blockEndTime: string;
  cautionOrderType: string;
  speedRestrictionKmph: number;
  powerDisconnectionStatus: string;
  ohePermitToWorkIssued: boolean;
  stationMasterAcknowledgementCode: string;
  qrCodeDigest: string;
}

export interface ConflictAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  sectionName: string;
  blockId?: string;
  trainNumber?: string;
  trainName?: string;
  timestamp: string;
  description: string;
  autoResolved: boolean;
  resolutionAdvice: string;
}

export interface AnalyticsKpi {
  totalBlockHoursGrantedToday: number;
  totalBlockHoursTargetMonthly: number;
  delayHoursSavedMonthly: number;
  trainDelayReductionPercent: number;
  assetHealthScoreOverall: number;
  sectionCapacityUtilizationPercent: number;
  punctualityIndexPassenger: number;
  punctualityIndexFreight: number;
  safetyComplianceScore: number;
  shadowBlocksCombinedCount: number;
  emergencyOverridesThisWeek: number;
  bcmProductivityKmPerHour: number;
}
