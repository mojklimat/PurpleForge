import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Square, ChevronLeft, AlertTriangle, Shield, Target, 
  Clock, Users, Activity, Eye, Settings, BarChart3, List, 
  ChevronDown, X, Filter, FileText
} from 'lucide-react';
import { useSimulation } from '../hooks/useSimulation';
import NotificationSystem from './NotificationSystem';
import LiveMetricsDashboard from './LiveMetricsDashboard';
import SimulationReport from './SimulationReport';
import { SimulationEvent } from '../types/simulation';

interface Scenario1Props {
  onBack: () => void;
  scenarioId: string | null;
}

const Scenario1: React.FC<Scenario1Props> = ({ onBack, scenarioId }) => {
  const {
    simulationState,
    notifications,
    isRunning,
    startSimulation,
    stopSimulation,
    completeStopSimulation,
    clearNotifications,
    removeNotification
  } = useSimulation(scenarioId || 'apt-simulation');

  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'systems'>('overview');
  const [showActiveThreats, setShowActiveThreats] = useState(false);
  const [showDetectedThreats, setShowDetectedThreats] = useState(false);
  const [showMitigatedThreats, setShowMitigatedThreats] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'attack' | 'detection' | 'mitigation'>('all');

  // REMOVED: Auto-show report when simulation completes
  // The report will now only show when manually triggered by the "View Report" button

  if (!simulationState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading simulation...</div>
      </div>
    );
  }

  const getFilteredEvents = (status?: string) => {
    let events = simulationState.events;
    
    if (status) {
      if (status === 'active') {
        // Only show attack events that are still active
        events = events.filter(e => e.type === 'attack' && e.status === 'active');
      } else if (status === 'detected') {
        // Show detection events or attack events that were detected
        events = events.filter(e => e.status === 'detected');
      } else if (status === 'mitigated') {
        // Show mitigation events or attack events that were mitigated
        events = events.filter(e => e.status === 'mitigated');
      }
    }
    
    if (eventFilter !== 'all') {
      events = events.filter(e => e.type === eventFilter);
    }
    
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const EventsList: React.FC<{ events: SimulationEvent[]; title: string }> = ({ events, title }) => (
    <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
      <h4 className="text-lg font-semibold text-white mb-4">{title}</h4>
      {events.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No events yet</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border-l-4 ${
                event.type === 'attack' ? 'bg-red-900/20 border-red-500' :
                event.type === 'detection' ? 'bg-blue-900/20 border-blue-500' :
                'bg-green-900/20 border-green-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {event.type === 'attack' && <Target className="h-4 w-4 text-red-400" />}
                    {event.type === 'detection' && <Shield className="h-4 w-4 text-blue-400" />}
                    {event.type === 'mitigation' && <Shield className="h-4 w-4 text-green-400" />}
                    <span className={`text-sm font-medium ${
                      event.type === 'attack' ? 'text-red-400' :
                      event.type === 'detection' ? 'text-blue-400' :
                      'text-green-400'
                    }`}>
                      {event.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mb-2">{event.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>{event.timestamp.toLocaleTimeString()}</span>
                    <span>{event.targetSystem}</span>
                    {event.mitreTechnique && <span>{event.mitreTechnique}</span>}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  event.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {event.severity.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
        onClear={clearNotifications}
      />

      {/* Simulation Report Modal - Only shows when manually triggered */}
      {showReport && (
        <SimulationReport
          simulationState={simulationState}
          onClose={() => setShowReport(false)}
        />
      )}

      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Back to Scenarios</span>
              </button>
              <div className="h-6 w-px bg-purple-500/30"></div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-purple-400" />
                <span className="text-lg font-bold text-white">{simulationState.name}</span>
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center space-x-4">
              {/* Report Button - Always available when there are events */}
              {simulationState.events.length > 0 && (
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>View Report</span>
                </button>
              )}

              <div className="flex items-center space-x-2">
                {!isRunning ? (
                  <button
                    onClick={startSimulation}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start</span>
                  </button>
                ) : (
                  <button
                    onClick={stopSimulation}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause</span>
                  </button>
                )}
                
                <button
                  onClick={completeStopSimulation}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Square className="h-4 w-4" />
                  <span>Stop</span>
                </button>
              </div>

              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                isRunning ? 'bg-green-500/20 text-green-400' : 
                simulationState.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isRunning ? 'bg-green-400 animate-pulse' : 
                  simulationState.status === 'completed' ? 'bg-gray-400' :
                  'bg-yellow-400'
                }`}></div>
                <span className="text-sm font-medium">
                  {isRunning ? 'LIVE' : 
                   simulationState.status === 'completed' ? 'COMPLETED' : 
                   'PAUSED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Completion Banner - Updated to encourage manual report viewing */}
        {simulationState.status === 'completed' && (
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Simulation Completed!</h3>
                  <p className="text-gray-300">
                    Your purple team exercise has finished. Click "View Report" to generate a comprehensive analysis.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReport(true)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2"
              >
                <FileText className="h-5 w-5" />
                <span>View Report</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Metrics Dashboard */}
        <LiveMetricsDashboard metrics={simulationState.metrics} isRunning={isRunning} />

        {/* Threat Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Active Threats */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500/20 p-2 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Active Threats</h3>
                  <p className="text-sm text-gray-400">Ongoing attacks</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-400">
                {simulationState.metrics.activeThreats}
              </div>
            </div>
            <button
              onClick={() => setShowActiveThreats(!showActiveThreats)}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Details</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showActiveThreats ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Detected Threats */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Detected</h3>
                  <p className="text-sm text-gray-400">Blue team alerts</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {simulationState.metrics.detectedThreats}
              </div>
            </div>
            <button
              onClick={() => setShowDetectedThreats(!showDetectedThreats)}
              className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Details</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showDetectedThreats ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Mitigated Threats */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Mitigated</h3>
                  <p className="text-sm text-gray-400">Successfully contained</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {simulationState.metrics.mitigatedThreats}
              </div>
            </div>
            <button
              onClick={() => setShowMitigatedThreats(!showMitigatedThreats)}
              className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Details</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showMitigatedThreats ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expandable Threat Details */}
        {showActiveThreats && (
          <div className="mb-6">
            <EventsList 
              events={getFilteredEvents('active')} 
              title="Active Threats" 
            />
          </div>
        )}

        {showDetectedThreats && (
          <div className="mb-6">
            <EventsList 
              events={getFilteredEvents('detected')} 
              title="Detected Threats" 
            />
          </div>
        )}

        {showMitigatedThreats && (
          <div className="mb-6">
            <EventsList 
              events={getFilteredEvents('mitigated')} 
              title="Mitigated Threats" 
            />
          </div>
        )}

        {/* Event Timeline */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Event Timeline</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value as any)}
                  className="bg-slate-700 text-white text-sm rounded px-3 py-1 border border-slate-600"
                >
                  <option value="all">All Events</option>
                  <option value="attack">Attacks</option>
                  <option value="detection">Detections</option>
                  <option value="mitigation">Mitigations</option>
                </select>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {getFilteredEvents().length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No events yet. Start the simulation to begin.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getFilteredEvents().map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === 'attack' ? 'bg-red-500' :
                        event.type === 'detection' ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}></div>
                      {index < getFilteredEvents().length - 1 && (
                        <div className="w-px h-8 bg-gray-600 mt-2"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{event.title}</h4>
                        <span className="text-xs text-gray-400">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{event.targetSystem}</span>
                        {event.mitreTechnique && <span>{event.mitreTechnique}</span>}
                        <span className={`px-2 py-1 rounded ${
                          event.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          event.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          event.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {event.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.status === 'active' ? 'bg-red-500/20 text-red-400' :
                          event.status === 'detected' ? 'bg-blue-500/20 text-blue-400' :
                          event.status === 'mitigated' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {event.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scenario1;