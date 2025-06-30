// Core data types for the purple team simulation

export interface SimulationEvent {
  id: string;
  timestamp: Date;
  type: 'attack' | 'detection' | 'mitigation' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'detected' | 'mitigated' | 'resolved';
  title: string;
  description: string;
  attackVector?: string;
  targetSystem: string;
  sourceIP?: string;
  destinationIP?: string;
  mitreTechnique?: string;
  redTeamAction?: RedTeamAction;
  blueTeamResponse?: BlueTeamResponse;
  metadata?: Record<string, any>;
}

export interface RedTeamAction {
  id: string;
  technique: string;
  tool: string;
  target: string;
  payload?: string;
  success: boolean;
  detectionProbability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  nextActions?: string[];
}

export interface BlueTeamResponse {
  id: string;
  detectionMethod: string;
  responseTime: number; // in seconds
  analyst: string;
  containmentActions: string[];
  effectiveness: number; // 0-100
  falsePositive: boolean;
}

export interface ThreatMetrics {
  totalThreats: number;
  activeThreats: number;
  detectedThreats: number;
  mitigatedThreats: number;
  averageDetectionTime: number;
  averageResponseTime: number;
  detectionRate: number; // percentage
  mitigationRate: number; // percentage
}

export interface SystemStatus {
  id: string;
  name: string;
  type: 'server' | 'workstation' | 'network' | 'database' | 'application';
  status: 'healthy' | 'compromised' | 'suspicious' | 'offline';
  compromiseLevel: number; // 0-100
  lastActivity: Date;
  activeThreats: string[]; // event IDs
}

export interface SimulationState {
  id: string;
  name: string;
  status: 'preparing' | 'running' | 'paused' | 'completed';
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  events: SimulationEvent[];
  metrics: ThreatMetrics;
  systems: SystemStatus[];
  redTeamObjectives: Objective[];
  blueTeamObjectives: Objective[];
  currentPhase: SimulationPhase;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  points: number;
  timeLimit?: number;
  requirements: string[];
}

export interface SimulationPhase {
  id: string;
  name: string;
  description: string;
  duration: number;
  objectives: string[]; // objective IDs
  allowedTechniques: string[];
}

export interface NotificationData {
  id: string;
  type: 'red-attack' | 'blue-detection' | 'blue-mitigation' | 'system-alert';
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  autoHide: boolean;
  duration?: number;
  eventId?: string;
}

// Attack patterns and techniques
export interface AttackPattern {
  id: string;
  name: string;
  category: string;
  mitreTechnique: string;
  description: string;
  prerequisites: string[];
  detectionMethods: string[];
  mitigationStrategies: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  stealthLevel: number; // 1-10
  impactLevel: number; // 1-10
  targetSystems: string[];
  tools: string[];
}

// Real-time updates
export interface LiveUpdate {
  type: 'event' | 'metrics' | 'system' | 'notification';
  data: any;
  timestamp: Date;
}
