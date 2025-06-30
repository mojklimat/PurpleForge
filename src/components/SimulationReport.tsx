import React, { useState } from 'react';
import { 
  FileText, Download, Filter, Calendar, Clock, Shield, Target, 
  AlertTriangle, TrendingUp, BarChart3, X, CheckCircle, Eye,
  Users, Activity, Zap, Database, Lock, Share2
} from 'lucide-react';
import { SimulationState, SimulationEvent } from '../types/simulation';

interface SimulationReportProps {
  simulationState: SimulationState;
  onClose: () => void;
}

const SimulationReport: React.FC<SimulationReportProps> = ({ simulationState, onClose }) => {
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>(['low', 'medium', 'high', 'critical']);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>(['attack', 'detection', 'mitigation']);
  const [reportFormat, setReportFormat] = useState<'json' | 'xml' | 'pdf'>('json');
  const [classificationLevel, setClassificationLevel] = useState<'public' | 'internal' | 'confidential' | 'restricted' | 'secret'>('internal');

  const severityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-400', bgColor: 'bg-green-500/20' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
    { value: 'high', label: 'High', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
    { value: 'critical', label: 'Critical', color: 'text-red-400', bgColor: 'bg-red-500/20' }
  ];

  const eventTypeOptions = [
    { value: 'attack', label: 'Attacks', color: 'text-red-400', icon: <Target className="h-4 w-4" /> },
    { value: 'detection', label: 'Detections', color: 'text-blue-400', icon: <Eye className="h-4 w-4" /> },
    { value: 'mitigation', label: 'Mitigations', color: 'text-green-400', icon: <Shield className="h-4 w-4" /> }
  ];

  const classificationOptions = [
    { 
      value: 'public', 
      label: 'PUBLIC', 
      description: 'Information that can be shared publicly',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    { 
      value: 'internal', 
      label: 'INTERNAL USE ONLY', 
      description: 'Information for internal organizational use',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    { 
      value: 'confidential', 
      label: 'CONFIDENTIAL', 
      description: 'Sensitive information requiring protection',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    { 
      value: 'restricted', 
      label: 'RESTRICTED', 
      description: 'Highly sensitive organizational information',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30'
    },
    { 
      value: 'secret', 
      label: 'SECRET', 
      description: 'Classified information requiring highest protection',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    }
  ];

  // Filter events based on selected criteria
  const filteredEvents = simulationState.events.filter(event => {
    const severityMatch = selectedSeverities.includes(event.severity);
    const typeMatch = selectedEventTypes.includes(event.type);
    return severityMatch && typeMatch;
  });

  // Calculate filtered metrics
  const filteredMetrics = {
    totalEvents: filteredEvents.length,
    attackEvents: filteredEvents.filter(e => e.type === 'attack').length,
    detectionEvents: filteredEvents.filter(e => e.type === 'detection').length,
    mitigationEvents: filteredEvents.filter(e => e.type === 'mitigation').length,
    criticalEvents: filteredEvents.filter(e => e.severity === 'critical').length,
    highEvents: filteredEvents.filter(e => e.severity === 'high').length,
    mediumEvents: filteredEvents.filter(e => e.severity === 'medium').length,
    lowEvents: filteredEvents.filter(e => e.severity === 'low').length
  };

  // Get classification styling
  const getClassificationStyling = () => {
    const classification = classificationOptions.find(opt => opt.value === classificationLevel);
    return classification || classificationOptions[1]; // Default to internal
  };

  // Generate report data structure
  const generateReportData = () => {
    const duration = simulationState.endTime 
      ? Math.round((simulationState.endTime.getTime() - simulationState.startTime.getTime()) / 1000 / 60)
      : Math.round((new Date().getTime() - simulationState.startTime.getTime()) / 1000 / 60);

    const classificationInfo = getClassificationStyling();

    return {
      metadata: {
        reportId: `RPT-${Date.now()}`,
        generatedAt: new Date().toISOString(),
        simulationId: simulationState.id,
        simulationName: simulationState.name,
        startTime: simulationState.startTime.toISOString(),
        endTime: simulationState.endTime?.toISOString() || new Date().toISOString(),
        duration: `${duration} minutes`,
        status: simulationState.status,
        classification: {
          level: classificationLevel,
          label: classificationInfo.label,
          description: classificationInfo.description
        },
        reportFilters: {
          severities: selectedSeverities,
          eventTypes: selectedEventTypes
        }
      },
      executiveSummary: {
        totalThreats: simulationState.metrics.totalThreats,
        activeThreats: simulationState.metrics.activeThreats,
        detectedThreats: simulationState.metrics.detectedThreats,
        mitigatedThreats: simulationState.metrics.mitigatedThreats,
        detectionRate: Math.round(simulationState.metrics.detectionRate * 100) / 100,
        mitigationRate: Math.round(simulationState.metrics.mitigationRate * 100) / 100,
        averageDetectionTime: Math.round(simulationState.metrics.averageDetectionTime),
        averageResponseTime: Math.round(simulationState.metrics.averageResponseTime)
      },
      filteredMetrics,
      events: filteredEvents.map(event => ({
        id: event.id,
        timestamp: event.timestamp.toISOString(),
        type: event.type,
        severity: event.severity,
        status: event.status,
        title: event.title,
        description: event.description,
        attackVector: event.attackVector,
        targetSystem: event.targetSystem,
        sourceIP: event.sourceIP,
        destinationIP: event.destinationIP,
        mitreTechnique: event.mitreTechnique,
        redTeamAction: event.redTeamAction,
        blueTeamResponse: event.blueTeamResponse
      })),
      systemsStatus: simulationState.systems.map(system => ({
        id: system.id,
        name: system.name,
        type: system.type,
        status: system.status,
        compromiseLevel: system.compromiseLevel,
        activeThreats: system.activeThreats.length
      })),
      objectives: {
        redTeam: simulationState.redTeamObjectives,
        blueTeam: simulationState.blueTeamObjectives
      },
      recommendations: generateRecommendations(filteredEvents, simulationState.metrics)
    };
  };

  // Generate security recommendations based on events
  const generateRecommendations = (events: SimulationEvent[], metrics: any) => {
    const recommendations = [];
    
    if (metrics.detectionRate < 80) {
      recommendations.push({
        priority: 'High',
        category: 'Detection',
        title: 'Improve Threat Detection Capabilities',
        description: 'Detection rate is below 80%. Consider enhancing SIEM rules, deploying additional sensors, and improving threat intelligence integration.',
        impact: 'Critical'
      });
    }

    if (metrics.averageDetectionTime > 300) {
      recommendations.push({
        priority: 'Medium',
        category: 'Response Time',
        title: 'Reduce Detection Time',
        description: 'Average detection time exceeds 5 minutes. Implement automated detection rules and enhance monitoring coverage.',
        impact: 'High'
      });
    }

    if (metrics.mitigationRate < 90) {
      recommendations.push({
        priority: 'High',
        category: 'Mitigation',
        title: 'Enhance Incident Response Procedures',
        description: 'Mitigation rate is below 90%. Review and improve incident response playbooks and automation capabilities.',
        impact: 'High'
      });
    }

    const phishingEvents = events.filter(e => e.attackVector?.toLowerCase().includes('phishing'));
    if (phishingEvents.length > 3) {
      recommendations.push({
        priority: 'Medium',
        category: 'Training',
        title: 'Strengthen Security Awareness Training',
        description: 'Multiple phishing attempts detected. Implement regular security awareness training and phishing simulation exercises.',
        impact: 'Medium'
      });
    }

    const lateralMovement = events.filter(e => e.attackVector?.toLowerCase().includes('lateral'));
    if (lateralMovement.length > 0) {
      recommendations.push({
        priority: 'High',
        category: 'Network Security',
        title: 'Implement Network Segmentation',
        description: 'Lateral movement detected. Deploy network segmentation and zero-trust architecture to limit attack spread.',
        impact: 'Critical'
      });
    }

    return recommendations;
  };

  // Download report in selected format
  const downloadReport = () => {
    const reportData = generateReportData();
    let content = '';
    let filename = '';
    let mimeType = '';

    const classificationSuffix = classificationLevel.toUpperCase();

    switch (reportFormat) {
      case 'json':
        content = JSON.stringify(reportData, null, 2);
        filename = `simulation-report-${simulationState.id}-${classificationSuffix}.json`;
        mimeType = 'application/json';
        break;
      
      case 'xml':
        content = generateXMLReport(reportData);
        filename = `simulation-report-${simulationState.id}-${classificationSuffix}.xml`;
        mimeType = 'application/xml';
        break;
      
      case 'pdf':
        // For PDF, we'll generate HTML content that can be printed as PDF
        content = generateHTMLReport(reportData);
        filename = `simulation-report-${simulationState.id}-${classificationSuffix}.html`;
        mimeType = 'text/html';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Share report functionality
  const shareReport = async () => {
    const reportData = generateReportData();
    const shareText = `Purple Team Simulation Report - ${simulationState.name}
    
📊 Executive Summary:
• Total Threats: ${reportData.executiveSummary.totalThreats}
• Detection Rate: ${reportData.executiveSummary.detectionRate}%
• Mitigation Rate: ${reportData.executiveSummary.mitigationRate}%
• Average Detection Time: ${reportData.executiveSummary.averageDetectionTime}s

🔒 Classification: ${reportData.metadata.classification.label}
📅 Generated: ${new Date().toLocaleDateString()}

#CyberSecurity #PurpleTeam #ThreatSimulation`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Purple Team Report - ${simulationState.name}`,
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText);
    }
  };

  // Copy to clipboard fallback
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      alert('Report summary copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Report summary copied to clipboard!');
    });
  };

  // Generate XML format
  const generateXMLReport = (data: any) => {
    const escapeXml = (str: string) => {
      return str.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '<';
          case '>': return '>';
          case '&': return '&';
          case "'": return '&apos;';
          case '"': return '"';
          default: return c;
        }
      });
    };

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<SimulationReport>\n';
    xml += '  <Metadata>\n';
    xml += `    <ReportId>${data.metadata.reportId}</ReportId>\n`;
    xml += `    <GeneratedAt>${data.metadata.generatedAt}</GeneratedAt>\n`;
    xml += `    <SimulationName>${escapeXml(data.metadata.simulationName)}</SimulationName>\n`;
    xml += `    <Duration>${data.metadata.duration}</Duration>\n`;
    xml += '    <Classification>\n';
    xml += `      <Level>${data.metadata.classification.level}</Level>\n`;
    xml += `      <Label>${escapeXml(data.metadata.classification.label)}</Label>\n`;
    xml += `      <Description>${escapeXml(data.metadata.classification.description)}</Description>\n`;
    xml += '    </Classification>\n';
    xml += '  </Metadata>\n';
    
    xml += '  <ExecutiveSummary>\n';
    xml += `    <TotalThreats>${data.executiveSummary.totalThreats}</TotalThreats>\n`;
    xml += `    <DetectedThreats>${data.executiveSummary.detectedThreats}</DetectedThreats>\n`;
    xml += `    <MitigatedThreats>${data.executiveSummary.mitigatedThreats}</MitigatedThreats>\n`;
    xml += `    <DetectionRate>${data.executiveSummary.detectionRate}%</DetectionRate>\n`;
    xml += `    <MitigationRate>${data.executiveSummary.mitigationRate}%</MitigationRate>\n`;
    xml += '  </ExecutiveSummary>\n';
    
    xml += '  <Events>\n';
    data.events.forEach((event: any) => {
      xml += '    <Event>\n';
      xml += `      <Id>${event.id}</Id>\n`;
      xml += `      <Timestamp>${event.timestamp}</Timestamp>\n`;
      xml += `      <Type>${event.type}</Type>\n`;
      xml += `      <Severity>${event.severity}</Severity>\n`;
      xml += `      <Title>${escapeXml(event.title)}</Title>\n`;
      xml += `      <Description>${escapeXml(event.description)}</Description>\n`;
      xml += `      <TargetSystem>${escapeXml(event.targetSystem)}</TargetSystem>\n`;
      if (event.mitreTechnique) {
        xml += `      <MitreTechnique>${event.mitreTechnique}</MitreTechnique>\n`;
      }
      xml += '    </Event>\n';
    });
    xml += '  </Events>\n';
    
    xml += '</SimulationReport>';
    return xml;
  };

  // Generate HTML format (for PDF printing)
  const generateHTMLReport = (data: any) => {
    const classificationStyling = getClassificationStyling();
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Purple Team Simulation Report - ${data.metadata.classification.label}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .classification-banner { 
            background: ${classificationStyling.value === 'secret' ? '#dc2626' : 
                        classificationStyling.value === 'restricted' ? '#ea580c' :
                        classificationStyling.value === 'confidential' ? '#ca8a04' :
                        classificationStyling.value === 'internal' ? '#2563eb' : '#16a34a'}; 
            color: white; 
            text-align: center; 
            padding: 10px; 
            font-weight: bold; 
            font-size: 18px; 
            margin: -20px -20px 20px -20px;
            letter-spacing: 2px;
        }
        .classification-footer { 
            background: ${classificationStyling.value === 'secret' ? '#dc2626' : 
                        classificationStyling.value === 'restricted' ? '#ea580c' :
                        classificationStyling.value === 'confidential' ? '#ca8a04' :
                        classificationStyling.value === 'internal' ? '#2563eb' : '#16a34a'}; 
            color: white; 
            text-align: center; 
            padding: 10px; 
            font-weight: bold; 
            margin: 30px -20px -20px -20px;
            letter-spacing: 2px;
        }
        .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #6366f1; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .subtitle { color: #666; font-size: 16px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #6366f1; font-size: 20px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
        .metric-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; background: #f9fafb; }
        .metric-value { font-size: 24px; font-weight: bold; color: #6366f1; }
        .metric-label { color: #666; font-size: 14px; }
        .event-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .event-table th, .event-table td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        .event-table th { background: #f3f4f6; font-weight: bold; }
        .severity-critical { color: #dc2626; font-weight: bold; }
        .severity-high { color: #ea580c; font-weight: bold; }
        .severity-medium { color: #ca8a04; font-weight: bold; }
        .severity-low { color: #16a34a; font-weight: bold; }
        .recommendation { border-left: 4px solid #6366f1; padding: 15px; margin: 10px 0; background: #f8fafc; }
        .recommendation-title { font-weight: bold; color: #6366f1; margin-bottom: 5px; }
        .classification-info { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
        @media print { body { margin: 0; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="classification-banner">${data.metadata.classification.label}</div>
    
    <div class="header">
        <div class="title">Purple Team Simulation Report</div>
        <div class="subtitle">${data.metadata.simulationName}</div>
        <div class="subtitle">Generated: ${new Date(data.metadata.generatedAt).toLocaleString()}</div>
        <div class="subtitle">Duration: ${data.metadata.duration}</div>
    </div>

    <div class="classification-info">
        <strong>Classification Level:</strong> ${data.metadata.classification.label}<br>
        <strong>Description:</strong> ${data.metadata.classification.description}<br>
        <strong>Report ID:</strong> ${data.metadata.reportId}
    </div>

    <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="metric-grid">
            <div class="metric-card">
                <div class="metric-value">${data.executiveSummary.totalThreats}</div>
                <div class="metric-label">Total Threats</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${data.executiveSummary.detectedThreats}</div>
                <div class="metric-label">Detected Threats</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${data.executiveSummary.mitigatedThreats}</div>
                <div class="metric-label">Mitigated Threats</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${data.executiveSummary.detectionRate}%</div>
                <div class="metric-label">Detection Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${data.executiveSummary.mitigationRate}%</div>
                <div class="metric-label">Mitigation Rate</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">${data.executiveSummary.averageDetectionTime}s</div>
                <div class="metric-label">Avg Detection Time</div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Security Events (${data.events.length} events)</div>
        <table class="event-table">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Severity</th>
                    <th>Title</th>
                    <th>Target System</th>
                    <th>MITRE Technique</th>
                </tr>
            </thead>
            <tbody>
                ${data.events.map((event: any) => `
                    <tr>
                        <td>${new Date(event.timestamp).toLocaleTimeString()}</td>
                        <td>${event.type}</td>
                        <td class="severity-${event.severity}">${event.severity.toUpperCase()}</td>
                        <td>${event.title}</td>
                        <td>${event.targetSystem}</td>
                        <td>${event.mitreTechnique || 'N/A'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Security Recommendations</div>
        ${data.recommendations.map((rec: any) => `
            <div class="recommendation">
                <div class="recommendation-title">${rec.title} (${rec.priority} Priority)</div>
                <div>${rec.description}</div>
            </div>
        `).join('')}
    </div>

    <div class="classification-footer">${data.metadata.classification.label}</div>
</body>
</html>`;
  };

  const toggleSeverity = (severity: string) => {
    setSelectedSeverities(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  const toggleEventType = (eventType: string) => {
    setSelectedEventTypes(prev => 
      prev.includes(eventType) 
        ? prev.filter(t => t !== eventType)
        : [...prev, eventType]
    );
  };

  // Handle close with proper event handling
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentClassification = getClassificationStyling();

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/20 w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Classification Banner */}
        <div className={`${currentClassification.bgColor} ${currentClassification.borderColor} border-b text-center py-3`}>
          <div className={`${currentClassification.color} font-bold text-lg tracking-wider`}>
            {currentClassification.label}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-purple-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Simulation Report</h2>
              <p className="text-gray-400">{simulationState.name}</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={shareReport}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            
            <button
              onClick={downloadReport}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            
            <button
              onClick={handleClose}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Report Configuration */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Severity Filters */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Filter className="h-5 w-5 text-purple-400" />
                <span>Severity Filters</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {severityOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleSeverity(option.value)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedSeverities.includes(option.value)
                        ? `${option.bgColor} border-current ${option.color}`
                        : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                    {selectedSeverities.includes(option.value) && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Type Filters */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-400" />
                <span>Event Types</span>
              </h3>
              <div className="space-y-3">
                {eventTypeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => toggleEventType(option.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                      selectedEventTypes.includes(option.value)
                        ? `bg-slate-700 border-purple-500/30 ${option.color}`
                        : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {option.icon}
                      <span className="font-medium">{option.label}</span>
                    </div>
                    {selectedEventTypes.includes(option.value) && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Classification Level */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Lock className="h-5 w-5 text-purple-400" />
                <span>Classification Level</span>
              </h3>
              <div className="space-y-3">
                {classificationOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setClassificationLevel(option.value as any)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      classificationLevel === option.value
                        ? `${option.bgColor} ${option.borderColor} ${option.color}`
                        : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{option.label}</span>
                      {classificationLevel === option.value && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="text-xs opacity-80">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Report Summary */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-purple-400" />
              <span>Report Summary</span>
              <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${currentClassification.bgColor} ${currentClassification.color}`}>
                {currentClassification.label}
              </div>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{filteredMetrics.totalEvents}</div>
                <div className="text-gray-400">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{filteredMetrics.attackEvents}</div>
                <div className="text-gray-400">Attack Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">{filteredMetrics.detectionEvents}</div>
                <div className="text-gray-400">Detection Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{filteredMetrics.mitigationEvents}</div>
                <div className="text-gray-400">Mitigation Events</div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{filteredMetrics.criticalEvents}</div>
                <div className="text-red-300 text-sm">Critical</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{filteredMetrics.highEvents}</div>
                <div className="text-orange-300 text-sm">High</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{filteredMetrics.mediumEvents}</div>
                <div className="text-yellow-300 text-sm">Medium</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{filteredMetrics.lowEvents}</div>
                <div className="text-green-300 text-sm">Low</div>
              </div>
            </div>
          </div>

          {/* Simulation Metrics */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <span>Performance Metrics</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {Math.round(simulationState.metrics.detectionRate)}%
                </div>
                <div className="text-gray-400 text-sm">Detection Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {Math.round(simulationState.metrics.mitigationRate)}%
                </div>
                <div className="text-gray-400 text-sm">Mitigation Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {Math.round(simulationState.metrics.averageDetectionTime)}s
                </div>
                <div className="text-gray-400 text-sm">Avg Detection Time</div>
              </div>
            </div>
          </div>

          {/* Event Timeline Preview */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-400" />
              <span>Event Timeline Preview ({filteredEvents.length} events)</span>
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredEvents.slice(0, 10).map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    event.type === 'attack' ? 'bg-red-900/20 border-red-500' :
                    event.type === 'detection' ? 'bg-blue-900/20 border-blue-500' :
                    'bg-green-900/20 border-green-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {event.type === 'attack' && <Target className="h-4 w-4 text-red-400" />}
                        {event.type === 'detection' && <Eye className="h-4 w-4 text-blue-400" />}
                        {event.type === 'mitigation' && <Shield className="h-4 w-4 text-green-400" />}
                        <span className="text-white text-sm font-medium">{event.title}</span>
                      </div>
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
              {filteredEvents.length > 10 && (
                <div className="text-center text-gray-400 text-sm py-2">
                  ... and {filteredEvents.length - 10} more events
                </div>
              )}
            </div>
          </div>

          {/* Export Format Selection */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Download className="h-5 w-5 text-purple-400" />
              <span>Export Format</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <button
                onClick={() => setReportFormat('json')}
                className={`p-4 rounded-lg border transition-all text-left ${
                  reportFormat === 'json'
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                    : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:bg-slate-700'
                }`}
              >
                <div className="font-medium mb-1">JSON</div>
                <div className="text-xs opacity-80">Machine readable format</div>
              </button>
              <button
                onClick={() => setReportFormat('xml')}
                className={`p-4 rounded-lg border transition-all text-left ${
                  reportFormat === 'xml'
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                    : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:bg-slate-700'
                }`}
              >
                <div className="font-medium mb-1">XML</div>
                <div className="text-xs opacity-80">Structured data format</div>
              </button>
              <button
                onClick={() => setReportFormat('pdf')}
                className={`p-4 rounded-lg border transition-all text-left ${
                  reportFormat === 'pdf'
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                    : 'bg-slate-700/50 border-slate-600 text-gray-400 hover:bg-slate-700'
                }`}
              >
                <div className="font-medium mb-1">HTML/PDF</div>
                <div className="text-xs opacity-80">Print-ready format</div>
              </button>
            </div>
            <div className="text-gray-400 text-sm">
              Report includes {filteredEvents.length} filtered events, performance metrics, security recommendations, and classification markings.
            </div>
          </div>
        </div>

        {/* Classification Footer */}
        <div className={`${currentClassification.bgColor} ${currentClassification.borderColor} border-t text-center py-2`}>
          <div className={`${currentClassification.color} font-bold text-sm tracking-wider`}>
            {currentClassification.label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationReport;