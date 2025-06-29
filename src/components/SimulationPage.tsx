import React, { useState, useEffect } from 'react';
import { 
  Shield, Target, Users, Play, Pause, RotateCcw, Settings, 
  Activity, Clock, AlertTriangle, CheckCircle, XCircle,
  TrendingUp, Eye, Zap, ArrowLeft, Terminal, Network,
  FileText, BarChart3, Timer, Wifi, WifiOff, X, Save,
  Sliders, Globe, Database, Lock, Download, Mail, Share2,
  Calendar, User, Building, MapPin
} from 'lucide-react';

interface SimulationPageProps {
  onBack: () => void;
}

interface Metric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface ThreatEvent {
  id: string;
  timestamp: string;
  type: 'attack' | 'detection' | 'response' | 'mitigation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: 'red' | 'blue';
}

interface ConfigSettings {
  threatIntensity: number;
  networkComplexity: number;
  detectionSensitivity: number;
  responseTime: number;
  attackVectors: string[];
  targetSystems: string[];
}

interface ReportSettings {
  title: string;
  author: string;
  organization: string;
  location: string;
  includeMetrics: boolean;
  includeTimeline: boolean;
  includeRecommendations: boolean;
  includeExecutiveSummary: boolean;
  format: 'pdf' | 'docx' | 'html';
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

const SimulationPage: React.FC<SimulationPageProps> = ({ onBack }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [activeThreats, setActiveThreats] = useState(3);
  const [detectedThreats, setDetectedThreats] = useState(2);
  const [mitigatedThreats, setMitigatedThreats] = useState(1);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [configSettings, setConfigSettings] = useState<ConfigSettings>({
    threatIntensity: 75,
    networkComplexity: 60,
    detectionSensitivity: 80,
    responseTime: 45,
    attackVectors: ['Phishing', 'Lateral Movement', 'Privilege Escalation'],
    targetSystems: ['Web Servers', 'Database', 'Domain Controller']
  });

  const [reportSettings, setReportSettings] = useState<ReportSettings>({
    title: 'Purple Team Exercise Report',
    author: 'Security Team',
    organization: 'PurpleForge',
    location: 'Cybersecurity Lab',
    includeMetrics: true,
    includeTimeline: true,
    includeRecommendations: true,
    includeExecutiveSummary: true,
    format: 'pdf',
    classification: 'internal'
  });

  const [metrics] = useState<Metric[]>([
    { label: 'TTD', value: '2.3s', trend: 'down', color: 'text-green-400' },
    { label: 'TTC', value: '45s', trend: 'down', color: 'text-blue-400' },
    { label: 'Success Rate', value: '87%', trend: 'up', color: 'text-purple-400' },
    { label: 'Coverage', value: '94%', trend: 'stable', color: 'text-yellow-400' }
  ]);

  const [events, setEvents] = useState<ThreatEvent[]>([
    {
      id: '1',
      timestamp: '14:32:15',
      type: 'attack',
      severity: 'high',
      description: 'Lateral movement detected in network segment 192.168.1.0/24',
      source: 'red'
    },
    {
      id: '2',
      timestamp: '14:32:18',
      type: 'detection',
      severity: 'high',
      description: 'Anomalous network traffic flagged by IDS',
      source: 'blue'
    },
    {
      id: '3',
      timestamp: '14:32:45',
      type: 'response',
      severity: 'medium',
      description: 'Automated containment initiated for affected hosts',
      source: 'blue'
    },
    {
      id: '4',
      timestamp: '14:33:12',
      type: 'mitigation',
      severity: 'low',
      description: 'Threat successfully contained and neutralized',
      source: 'blue'
    }
  ]);

  const availableAttackVectors = [
    'Phishing', 'Lateral Movement', 'Privilege Escalation', 'Data Exfiltration',
    'Ransomware', 'SQL Injection', 'Cross-Site Scripting', 'Buffer Overflow',
    'Social Engineering', 'Zero-Day Exploit'
  ];

  const availableTargetSystems = [
    'Web Servers', 'Database', 'Domain Controller', 'Email Server',
    'File Server', 'Workstations', 'Network Infrastructure', 'Cloud Services',
    'IoT Devices', 'Mobile Devices'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSimulationTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto-hide success notification after 3 seconds
  useEffect(() => {
    if (showSuccessNotification) {
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessNotification]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSimulationTime(0);
    setActiveThreats(0);
    setDetectedThreats(0);
    setMitigatedThreats(0);
  };

  const handleSaveScenario = () => {
    // Here you would typically save the scenario to a backend or local storage
    console.log('Scenario saved with current settings');
    setShowSuccessNotification(true);
  };

  const handleConfigSave = () => {
    setShowConfigModal(false);
    // Here you would typically save the configuration to a backend or local storage
    console.log('Configuration saved:', configSettings);
  };

  const handleSliderChange = (key: keyof ConfigSettings, value: number) => {
    setConfigSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayToggle = (key: 'attackVectors' | 'targetSystems', item: string) => {
    setConfigSettings(prev => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter(i => i !== item)
        : [...prev[key], item]
    }));
  };

  const handleReportGenerate = () => {
    setShowReportModal(false);
    // Here you would typically generate and download the report
    console.log('Generating report with settings:', reportSettings);
    // Simulate report generation
    alert(`Report "${reportSettings.title}" is being generated in ${reportSettings.format.toUpperCase()} format. You will receive it shortly.`);
  };

  const handleReportSettingChange = (key: keyof ReportSettings, value: any) => {
    setReportSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'attack': return <Target className="h-4 w-4 text-red-400" />;
      case 'detection': return <Eye className="h-4 w-4 text-blue-400" />;
      case 'response': return <Shield className="h-4 w-4 text-purple-400" />;
      case 'mitigation': return <CheckCircle className="h-4 w-4 text-green-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'public': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'internal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'confidential': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'restricted': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 rounded-lg shadow-lg border border-green-400/30 flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-100" />
            <div>
              <div className="font-semibold">Success!</div>
              <div className="text-sm text-green-100">Scenario saved</div>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="text-green-100 hover:text-white transition-colors ml-4"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </button>
              <div className="h-6 w-px bg-purple-500/30"></div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-purple-400" />
                <span className="text-lg font-bold text-white">PurpleForge Simulation</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg px-3 py-2">
                <Timer className="h-4 w-4 text-purple-400" />
                <span className="text-white font-mono text-lg">{formatTime(simulationTime)}</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                isRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              }`}>
                {isRunning ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                <span className="text-sm font-medium">
                  {isRunning ? 'LIVE' : 'PAUSED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Purple Team Exercise: Advanced Persistent Threat</h1>
              <p className="text-gray-400">Simulating multi-stage attack with lateral movement and data exfiltration</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleStartPause}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span>{isRunning ? 'Pause' : 'Start'}</span>
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600 text-white transition-all"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Reset</span>
              </button>
              
              <button 
                onClick={() => setShowConfigModal(true)}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold border border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-all"
              >
                <Settings className="h-5 w-5" />
                <span>Configure</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-8">
            {/* Threat Overview */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Activity className="h-6 w-6 text-purple-400" />
                <span>Threat Landscape</span>
              </h2>
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-3">
                    <AlertTriangle className="h-8 w-8 text-red-400 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold text-red-400">{activeThreats}</div>
                  <div className="text-sm text-gray-400">Active Threats</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-3">
                    <Eye className="h-8 w-8 text-blue-400 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400">{detectedThreats}</div>
                  <div className="text-sm text-gray-400">Detected</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-3">
                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
                  </div>
                  <div className="text-2xl font-bold text-green-400">{mitigatedThreats}</div>
                  <div className="text-sm text-gray-400">Mitigated</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-purple-400" />
                <span>Performance Metrics</span>
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl font-bold ${metric.color} mb-1`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{metric.label}</div>
                    <div className="flex items-center justify-center space-x-1">
                      <TrendingUp className={`h-3 w-3 ${
                        metric.trend === 'up' ? 'text-green-400' : 
                        metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500">
                        {metric.trend === 'up' ? 'Improving' : 
                         metric.trend === 'down' ? 'Degrading' : 'Stable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Visualization */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Network className="h-6 w-6 text-purple-400" />
                <span>Network Topology</span>
              </h2>
              
              <div className="bg-slate-900/50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-8 w-full max-w-md">
                  <div className="text-center">
                    <div className="bg-blue-500/20 border-2 border-blue-500/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                    <div className="text-sm text-blue-400 font-medium">Firewall</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-500/20 border-2 border-green-500/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <Network className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="text-sm text-green-400 font-medium">Switch</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-purple-500/20 border-2 border-purple-500/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                      <Terminal className="h-8 w-8 text-purple-400" />
                    </div>
                    <div className="text-sm text-purple-400 font-medium">Server</div>
                  </div>
                  
                  <div className="col-span-3 text-center mt-4">
                    <div className="bg-red-500/20 border-2 border-red-500/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 animate-pulse">
                      <Target className="h-8 w-8 text-red-400" />
                    </div>
                    <div className="text-sm text-red-400 font-medium">Compromised Host</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Team Status */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Users className="h-6 w-6 text-purple-400" />
                <span>Team Status</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-red-400" />
                    <div>
                      <div className="text-red-400 font-medium">Red Team</div>
                      <div className="text-xs text-gray-400">Offensive Operations</div>
                    </div>
                  </div>
                  <div className="text-green-400 text-sm font-medium">ACTIVE</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="text-blue-400 font-medium">Blue Team</div>
                      <div className="text-xs text-gray-400">Defensive Response</div>
                    </div>
                  </div>
                  <div className="text-green-400 text-sm font-medium">ACTIVE</div>
                </div>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Clock className="h-6 w-6 text-purple-400" />
                <span>Event Timeline</span>
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.map((event) => (
                  <div key={event.id} className={`p-3 rounded-lg border ${getSeverityColor(event.severity)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-gray-400">{event.timestamp}</span>
                          <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(event.severity)}`}>
                            {event.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Zap className="h-6 w-6 text-purple-400" />
                <span>Quick Actions</span>
              </h2>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-all text-left"
                >
                  <FileText className="h-5 w-5 text-purple-400" />
                  <span className="text-white">Generate Report</span>
                </button>
                
                <button 
                  onClick={() => setShowConfigModal(true)}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-all text-left"
                >
                  <Settings className="h-5 w-5 text-blue-400" />
                  <span className="text-white">Adjust Parameters</span>
                </button>
                
                <button 
                  onClick={handleSaveScenario}
                  className="w-full flex items-center space-x-3 p-3 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-all text-left"
                >
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">Save Scenario</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600/20 p-2 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Simulation Configuration</h2>
                  <p className="text-gray-400">Customize your purple team exercise parameters</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Simulation Parameters */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <Sliders className="h-5 w-5 text-purple-400" />
                  <span>Simulation Parameters</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Threat Intensity: {configSettings.threatIntensity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={configSettings.threatIntensity}
                        onChange={(e) => handleSliderChange('threatIntensity', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Network Complexity: {configSettings.networkComplexity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={configSettings.networkComplexity}
                        onChange={(e) => handleSliderChange('networkComplexity', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Simple</span>
                        <span>Complex</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Detection Sensitivity: {configSettings.detectionSensitivity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={configSettings.detectionSensitivity}
                        onChange={(e) => handleSliderChange('detectionSensitivity', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Response Time Delay: {configSettings.responseTime}s
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="120"
                        value={configSettings.responseTime}
                        onChange={(e) => handleSliderChange('responseTime', parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Instant</span>
                        <span>2 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attack Vectors */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <Target className="h-5 w-5 text-red-400" />
                  <span>Attack Vectors</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {availableAttackVectors.map((vector) => (
                    <button
                      key={vector}
                      onClick={() => handleArrayToggle('attackVectors', vector)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        configSettings.attackVectors.includes(vector)
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:bg-slate-700 hover:text-gray-300'
                      }`}
                    >
                      {vector}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Systems */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  <span>Target Systems</span>
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {availableTargetSystems.map((system) => (
                    <button
                      key={system}
                      onClick={() => handleArrayToggle('targetSystems', system)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        configSettings.targetSystems.includes(system)
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                          : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:bg-slate-700 hover:text-gray-300'
                      }`}
                    >
                      {system}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t border-purple-500/20">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-6 py-3 rounded-lg font-semibold border border-gray-500 text-gray-400 hover:bg-gray-500/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfigSave}
                className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/30 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600/20 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Generate Simulation Report</h2>
                  <p className="text-gray-400">Configure and export your purple team exercise results</p>
                </div>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Report Details */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <span>Report Details</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Report Title
                      </label>
                      <input
                        type="text"
                        value={reportSettings.title}
                        onChange={(e) => handleReportSettingChange('title', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                        placeholder="Enter report title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Author
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={reportSettings.author}
                          onChange={(e) => handleReportSettingChange('author', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                          placeholder="Enter author name"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Organization
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={reportSettings.organization}
                          onChange={(e) => handleReportSettingChange('organization', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                          placeholder="Enter organization name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={reportSettings.location}
                          onChange={(e) => handleReportSettingChange('location', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                          placeholder="Enter location"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Report Content</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 p-4 bg-slate-700/30 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={reportSettings.includeExecutiveSummary}
                      onChange={(e) => handleReportSettingChange('includeExecutiveSummary', e.target.checked)}
                      className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-white font-medium">Executive Summary</div>
                      <div className="text-sm text-gray-400">High-level overview and key findings</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 bg-slate-700/30 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={reportSettings.includeMetrics}
                      onChange={(e) => handleReportSettingChange('includeMetrics', e.target.checked)}
                      className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-white font-medium">Performance Metrics</div>
                      <div className="text-sm text-gray-400">TTD, TTC, success rates, and KPIs</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 bg-slate-700/30 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={reportSettings.includeTimeline}
                      onChange={(e) => handleReportSettingChange('includeTimeline', e.target.checked)}
                      className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-white font-medium">Event Timeline</div>
                      <div className="text-sm text-gray-400">Chronological sequence of events</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 bg-slate-700/30 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={reportSettings.includeRecommendations}
                      onChange={(e) => handleReportSettingChange('includeRecommendations', e.target.checked)}
                      className="w-5 h-5 text-purple-600 bg-slate-700 border-slate-500 rounded focus:ring-purple-500"
                    />
                    <div>
                      <div className="text-white font-medium">Recommendations</div>
                      <div className="text-sm text-gray-400">Actionable improvement suggestions</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Export Options */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                  <Download className="h-5 w-5 text-blue-400" />
                  <span>Export Options</span>
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Format
                    </label>
                    <div className="space-y-2">
                      {['pdf', 'docx', 'html'].map((format) => (
                        <label key={format} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="format"
                            value={format}
                            checked={reportSettings.format === format}
                            onChange={(e) => handleReportSettingChange('format', e.target.value)}
                            className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-500 focus:ring-purple-500"
                          />
                          <span className="text-white font-medium">{format.toUpperCase()}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Classification Level
                    </label>
                    <select
                      value={reportSettings.classification}
                      onChange={(e) => handleReportSettingChange('classification', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    >
                      <option value="public">Public</option>
                      <option value="internal">Internal</option>
                      <option value="confidential">Confidential</option>
                      <option value="restricted">Restricted</option>
                    </select>
                    <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getClassificationColor(reportSettings.classification)}`}>
                      <Lock className="h-3 w-3 mr-1" />
                      {reportSettings.classification.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Preview */}
              <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-600">
                <h4 className="text-lg font-semibold text-white mb-4">Report Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Title:</span>
                    <span className="text-white">{reportSettings.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Author:</span>
                    <span className="text-white">{reportSettings.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Organization:</span>
                    <span className="text-white">{reportSettings.organization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white">{reportSettings.format.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Classification:</span>
                    <span className="text-white">{reportSettings.classification.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sections:</span>
                    <span className="text-white">
                      {[
                        reportSettings.includeExecutiveSummary && 'Executive Summary',
                        reportSettings.includeMetrics && 'Metrics',
                        reportSettings.includeTimeline && 'Timeline',
                        reportSettings.includeRecommendations && 'Recommendations'
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-purple-500/20">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-all">
                  <Mail className="h-4 w-4" />
                  <span>Email Report</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium border border-green-500 text-green-400 hover:bg-green-500/10 transition-all">
                  <Share2 className="h-4 w-4" />
                  <span>Share Link</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-6 py-3 rounded-lg font-semibold border border-gray-500 text-gray-400 hover:bg-gray-500/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportGenerate}
                  className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPage;