import React from 'react';
import { 
  Target, Shield, Database, Globe, Wifi, Server, 
  AlertTriangle, Clock, Users, ChevronRight, Play
} from 'lucide-react';

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  attackVectors: string[];
  targetSystems: string[];
  icon: React.ReactNode;
  color: string;
  implemented: boolean;
}

interface ScenarioSelectorProps {
  onSelectScenario: (scenarioId: string) => void;
  onBack: () => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ onSelectScenario, onBack }) => {
  const scenarios: Scenario[] = [
    {
      id: 'apt-simulation',
      title: 'Advanced Persistent Threat',
      description: 'Simulating multi-stage attack with lateral movement and data exfiltration. Test your team\'s ability to detect, respond to, and mitigate sophisticated threat actors.',
      difficulty: 'Advanced',
      duration: '45-60 min',
      attackVectors: ['Phishing', 'Lateral Movement', 'Privilege Escalation', 'Data Exfiltration'],
      targetSystems: ['Web Servers', 'Database', 'Domain Controller', 'Workstations'],
      icon: <Target className="h-8 w-8" />,
      color: 'from-red-600 to-red-700',
      implemented: true
    },
    {
      id: 'ransomware-attack',
      title: 'Ransomware Campaign',
      description: 'Comprehensive ransomware simulation including initial access, encryption deployment, and recovery procedures. Focus on incident response and business continuity.',
      difficulty: 'Expert',
      duration: '60-90 min',
      attackVectors: ['Email Phishing', 'Remote Desktop', 'File Encryption', 'Network Propagation'],
      targetSystems: ['File Servers', 'Workstations', 'Backup Systems', 'Network Shares'],
      icon: <AlertTriangle className="h-8 w-8" />,
      color: 'from-orange-600 to-red-600',
      implemented: false
    },
    {
      id: 'insider-threat',
      title: 'Malicious Insider',
      description: 'Simulate insider threat scenarios with privileged access abuse, data theft, and sabotage attempts. Test monitoring and behavioral analytics.',
      difficulty: 'Intermediate',
      duration: '30-45 min',
      attackVectors: ['Privilege Abuse', 'Data Theft', 'System Sabotage', 'Credential Misuse'],
      targetSystems: ['Database', 'File Servers', 'HR Systems', 'Financial Systems'],
      icon: <Users className="h-8 w-8" />,
      color: 'from-purple-600 to-pink-600',
      implemented: false
    },
    {
      id: 'web-application',
      title: 'Web Application Attack',
      description: 'Target web applications with SQL injection, XSS, and authentication bypass attempts. Perfect for testing application security controls.',
      difficulty: 'Intermediate',
      duration: '30-45 min',
      attackVectors: ['SQL Injection', 'Cross-Site Scripting', 'Authentication Bypass', 'Session Hijacking'],
      targetSystems: ['Web Applications', 'Database', 'API Endpoints', 'User Sessions'],
      icon: <Globe className="h-8 w-8" />,
      color: 'from-blue-600 to-cyan-600',
      implemented: false
    },
    {
      id: 'network-intrusion',
      title: 'Network Perimeter Breach',
      description: 'External network penetration with firewall bypass, network scanning, and service exploitation. Test network security controls.',
      difficulty: 'Advanced',
      duration: '45-60 min',
      attackVectors: ['Port Scanning', 'Service Exploitation', 'Firewall Bypass', 'Network Mapping'],
      targetSystems: ['Firewalls', 'Network Infrastructure', 'DMZ Services', 'Internal Networks'],
      icon: <Wifi className="h-8 w-8" />,
      color: 'from-green-600 to-teal-600',
      implemented: false
    },
    {
      id: 'cloud-security',
      title: 'Cloud Infrastructure Attack',
      description: 'Cloud-focused attack simulation targeting misconfigurations, identity management, and container security vulnerabilities.',
      difficulty: 'Expert',
      duration: '60-75 min',
      attackVectors: ['Cloud Misconfig', 'Identity Theft', 'Container Escape', 'API Abuse'],
      targetSystems: ['Cloud Services', 'Containers', 'Identity Providers', 'API Gateways'],
      icon: <Server className="h-8 w-8" />,
      color: 'from-indigo-600 to-purple-600',
      implemented: false
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering Campaign',
      description: 'Human-focused attack simulation with phishing, vishing, and physical security testing. Evaluate security awareness and training.',
      difficulty: 'Beginner',
      duration: '20-30 min',
      attackVectors: ['Phishing Emails', 'Voice Phishing', 'Physical Access', 'Pretexting'],
      targetSystems: ['Email Systems', 'Phone Systems', 'Physical Access', 'Employee Devices'],
      icon: <Users className="h-8 w-8" />,
      color: 'from-yellow-600 to-orange-600',
      implemented: false
    },
    {
      id: 'iot-botnet',
      title: 'IoT Botnet Formation',
      description: 'Internet of Things focused attack with device compromise, botnet formation, and DDoS preparation. Test IoT security controls.',
      difficulty: 'Advanced',
      duration: '45-60 min',
      attackVectors: ['Device Compromise', 'Botnet Formation', 'Command & Control', 'DDoS Preparation'],
      targetSystems: ['IoT Devices', 'Network Infrastructure', 'Command Servers', 'Target Services'],
      icon: <Wifi className="h-8 w-8" />,
      color: 'from-teal-600 to-blue-600',
      implemented: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Expert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleScenarioSelect = (scenario: Scenario) => {
    if (scenario.implemented) {
      onSelectScenario(scenario.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
                <span>Back to Home</span>
              </button>
              <div className="h-6 w-px bg-purple-500/30"></div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-purple-400" />
                <span className="text-lg font-bold text-white">Select Simulation Scenario</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Purple Team Exercise</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select from our comprehensive library of cybersecurity simulation scenarios. Each exercise is designed to test different aspects of your security posture and team capabilities.
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-purple-500/20 transition-all duration-300 ${
                scenario.implemented 
                  ? 'hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer transform hover:scale-[1.02]' 
                  : 'opacity-60'
              }`}
              onClick={() => handleScenarioSelect(scenario)}
            >
              {/* Coming Soon Badge */}
              {!scenario.implemented && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  COMING SOON
                </div>
              )}

              {/* Available Badge */}
              {scenario.implemented && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                  <Play className="h-3 w-3" />
                  <span>AVAILABLE</span>
                </div>
              )}

              <div className="flex items-start space-x-6">
                {/* Icon */}
                <div className={`bg-gradient-to-br ${scenario.color} p-4 rounded-2xl text-white flex-shrink-0`}>
                  {scenario.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-white">{scenario.title}</h3>
                  </div>

                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {scenario.description}
                  </p>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Difficulty</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(scenario.difficulty)}`}>
                        {scenario.difficulty}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Duration</div>
                      <div className="flex items-center space-x-1 text-white">
                        <Clock className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-medium">{scenario.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attack Vectors */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-2">Attack Vectors</div>
                    <div className="flex flex-wrap gap-2">
                      {scenario.attackVectors.slice(0, 3).map((vector, index) => (
                        <span
                          key={index}
                          className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded border border-red-500/30"
                        >
                          {vector}
                        </span>
                      ))}
                      {scenario.attackVectors.length > 3 && (
                        <span className="bg-slate-700 text-gray-400 text-xs px-2 py-1 rounded">
                          +{scenario.attackVectors.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Target Systems */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-2">Target Systems</div>
                    <div className="flex flex-wrap gap-2">
                      {scenario.targetSystems.slice(0, 3).map((system, index) => (
                        <span
                          key={index}
                          className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/30"
                        >
                          {system}
                        </span>
                      ))}
                      {scenario.targetSystems.length > 3 && (
                        <span className="bg-slate-700 text-gray-400 text-xs px-2 py-1 rounded">
                          +{scenario.targetSystems.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {scenario.implemented ? (
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2">
                      <Play className="h-5 w-5" />
                      <span>Start Simulation</span>
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full bg-slate-700 text-gray-400 font-semibold py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Clock className="h-5 w-5" />
                      <span>Coming Soon</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-purple-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Scenario?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our platform supports custom scenario creation. Contact our team to develop specialized exercises tailored to your organization's specific security requirements and threat landscape.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition-all">
              Request Custom Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelector;