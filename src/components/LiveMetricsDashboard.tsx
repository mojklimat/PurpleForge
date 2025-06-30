import React from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, Shield, Target, AlertTriangle } from 'lucide-react';
import { ThreatMetrics } from '../types/simulation';

interface LiveMetricsDashboardProps {
  metrics: ThreatMetrics;
  isRunning: boolean;
}

const LiveMetricsDashboard: React.FC<LiveMetricsDashboardProps> = ({ metrics, isRunning }) => {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Threats */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-gray-400">Total Threats</span>
          </div>
          {isRunning && (
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          {metrics.totalThreats}
        </div>
        <div className="text-xs text-gray-500">
          Since simulation start
        </div>
      </div>

      {/* Active Threats */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-red-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-red-400" />
            <span className="text-sm text-gray-400">Active</span>
          </div>
          {metrics.activeThreats > 0 && (
            <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
          )}
        </div>
        <div className="text-2xl font-bold text-red-400 mb-1">
          {metrics.activeThreats}
        </div>
        <div className="text-xs text-gray-500">
          Ongoing attacks
        </div>
      </div>

      {/* Detected Threats */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-blue-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-400">Detected</span>
          </div>
          <div className={`text-xs font-medium ${getStatusColor(metrics.detectionRate, { good: 80, warning: 60 })}`}>
            {Math.round(metrics.detectionRate)}%
          </div>
        </div>
        <div className="text-2xl font-bold text-blue-400 mb-1">
          {metrics.detectedThreats}
        </div>
        <div className="text-xs text-gray-500">
          Blue team alerts
        </div>
      </div>

      {/* Mitigated Threats */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-green-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-sm text-gray-400">Mitigated</span>
          </div>
          <div className={`text-xs font-medium ${getStatusColor(metrics.mitigationRate, { good: 90, warning: 70 })}`}>
            {Math.round(metrics.mitigationRate)}%
          </div>
        </div>
        <div className="text-2xl font-bold text-green-400 mb-1">
          {metrics.mitigatedThreats}
        </div>
        <div className="text-xs text-gray-500">
          Successfully contained
        </div>
      </div>

      {/* Average Detection Time */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-yellow-500/20 lg:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            <span className="text-sm text-gray-400">Avg Detection Time</span>
          </div>
          <div className="flex items-center space-x-1">
            {metrics.averageDetectionTime < 60 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
        </div>
        <div className="text-2xl font-bold text-yellow-400 mb-1">
          {formatTime(metrics.averageDetectionTime)}
        </div>
        <div className="text-xs text-gray-500">
          Time to detect threats
        </div>
      </div>

      {/* Average Response Time */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-cyan-500/20 lg:col-span-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-cyan-400" />
            <span className="text-sm text-gray-400">Avg Response Time</span>
          </div>
          <div className="flex items-center space-x-1">
            {metrics.averageResponseTime < 120 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
          </div>
        </div>
        <div className="text-2xl font-bold text-cyan-400 mb-1">
          {formatTime(metrics.averageResponseTime)}
        </div>
        <div className="text-xs text-gray-500">
          Time to respond to threats
        </div>
      </div>
    </div>
  );
};

export default LiveMetricsDashboard;