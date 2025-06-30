import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SimulationState, 
  SimulationEvent, 
  ThreatMetrics, 
  NotificationData,
  SystemStatus,
  RedTeamAction,
  BlueTeamResponse
} from '../types/simulation';

export const useSimulation = (scenarioId: string) => {
  const [simulationState, setSimulationState] = useState<SimulationState | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventIdCounter = useRef(1);
  const attackChainRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Initialize simulation
  const initializeSimulation = useCallback(() => {
    const initialState: SimulationState = {
      id: `sim-${Date.now()}`,
      name: `APT Simulation - ${new Date().toLocaleDateString()}`,
      status: 'preparing',
      startTime: new Date(),
      duration: 60,
      events: [],
      metrics: {
        totalThreats: 0,
        activeThreats: 0,
        detectedThreats: 0,
        mitigatedThreats: 0,
        averageDetectionTime: 0,
        averageResponseTime: 0,
        detectionRate: 0,
        mitigationRate: 0
      },
      systems: [
        {
          id: 'web-server-01',
          name: 'Web Server 01',
          type: 'server',
          status: 'healthy',
          compromiseLevel: 0,
          lastActivity: new Date(),
          activeThreats: []
        },
        {
          id: 'db-server-01',
          name: 'Database Server',
          type: 'database',
          status: 'healthy',
          compromiseLevel: 0,
          lastActivity: new Date(),
          activeThreats: []
        },
        {
          id: 'workstation-01',
          name: 'Admin Workstation',
          type: 'workstation',
          status: 'healthy',
          compromiseLevel: 0,
          lastActivity: new Date(),
          activeThreats: []
        },
        {
          id: 'domain-controller',
          name: 'Domain Controller',
          type: 'server',
          status: 'healthy',
          compromiseLevel: 0,
          lastActivity: new Date(),
          activeThreats: []
        },
        {
          id: 'email-server',
          name: 'Email Server',
          type: 'server',
          status: 'healthy',
          compromiseLevel: 0,
          lastActivity: new Date(),
          activeThreats: []
        },
        {
          id: 'file-server',
          name: 'File Server',
          type: 'server',
          status: 'healthy',
          compromiseLevel: 0,
          lastActivity: new Date(),
          activeThreats: []
        },
        {
          id: 'backup-server',
          name: 'Backup Server',
          type: 'server',
          status: 'healthy',
          compromiseLevel: 0,
          lastActivity: new Date(),
          activeThreats: []
        },
        {
          id: 'vpn-gateway',
          name: 'VPN Gateway',
          type: 'network',
          status: 'healthy',
          compromiseLevel: 0,
          lastActivity: new Date(),
          activeThreats: []
        }
      ],
      redTeamObjectives: [
        {
          id: 'obj-1',
          title: 'Initial Access',
          description: 'Gain initial foothold in the network',
          status: 'pending',
          points: 100,
          requirements: ['Compromise at least one system']
        },
        {
          id: 'obj-2',
          title: 'Lateral Movement',
          description: 'Move laterally through the network',
          status: 'pending',
          points: 200,
          requirements: ['Compromise multiple systems']
        }
      ],
      blueTeamObjectives: [
        {
          id: 'obj-blue-1',
          title: 'Threat Detection',
          description: 'Detect and alert on malicious activities',
          status: 'pending',
          points: 150,
          requirements: ['Detect 80% of attacks within 5 minutes']
        }
      ],
      currentPhase: {
        id: 'phase-1',
        name: 'Initial Reconnaissance',
        description: 'Red team performs initial reconnaissance',
        duration: 15,
        objectives: ['obj-1'],
        allowedTechniques: ['T1595', 'T1590', 'T1589']
      }
    };

    setSimulationState(initialState);
  }, [scenarioId]);

  // Expanded attack scenarios with many more diverse attacks
  const attackScenarios = [
    {
      name: 'Advanced Spear Phishing Campaign',
      phases: [
        {
          title: 'OSINT Reconnaissance',
          description: 'Red team gathering employee information from social media and public sources',
          attackVector: 'Open Source Intelligence',
          mitreTechnique: 'T1589.002',
          severity: 'low' as const,
          targetSystem: 'External Infrastructure',
          delay: 0,
          detectionProbability: 0.2
        },
        {
          title: 'Targeted Phishing Email',
          description: 'Highly personalized phishing email sent to C-level executives',
          attackVector: 'Spear Phishing Link',
          mitreTechnique: 'T1566.002',
          severity: 'high' as const,
          targetSystem: 'Email Server',
          delay: 12000,
          detectionProbability: 0.75
        },
        {
          title: 'Credential Harvesting',
          description: 'Fake login page capturing executive credentials',
          attackVector: 'Credential Harvesting',
          mitreTechnique: 'T1056.003',
          severity: 'critical' as const,
          targetSystem: 'Web Application',
          delay: 25000,
          detectionProbability: 0.85
        }
      ]
    },
    {
      name: 'Ransomware Deployment',
      phases: [
        {
          title: 'Initial Compromise',
          description: 'Malicious macro-enabled document executed by user',
          attackVector: 'Malicious File',
          mitreTechnique: 'T1204.002',
          severity: 'high' as const,
          targetSystem: 'Admin Workstation',
          delay: 0,
          detectionProbability: 0.88
        },
        {
          title: 'Ransomware Encryption',
          description: 'Files being encrypted across network shares',
          attackVector: 'Data Encrypted for Impact',
          mitreTechnique: 'T1486',
          severity: 'critical' as const,
          targetSystem: 'File Server',
          delay: 18000,
          detectionProbability: 0.98
        },
        {
          title: 'Ransom Note Deployment',
          description: 'Ransom notes deployed across compromised systems',
          attackVector: 'Defacement',
          mitreTechnique: 'T1491.001',
          severity: 'critical' as const,
          targetSystem: 'Multiple Systems',
          delay: 30000,
          detectionProbability: 1.0
        }
      ]
    },
    {
      name: 'Supply Chain Attack',
      phases: [
        {
          title: 'Third-Party Software Compromise',
          description: 'Malicious update pushed through compromised software vendor',
          attackVector: 'Supply Chain Compromise',
          mitreTechnique: 'T1195.002',
          severity: 'critical' as const,
          targetSystem: 'Software Distribution',
          delay: 0,
          detectionProbability: 0.65
        },
        {
          title: 'Backdoor Installation',
          description: 'Persistent backdoor installed via compromised update',
          attackVector: 'Server Software Component',
          mitreTechnique: 'T1505.003',
          severity: 'critical' as const,
          targetSystem: 'Web Server',
          delay: 20000,
          detectionProbability: 0.7
        }
      ]
    },
    {
      name: 'Insider Threat Activity',
      phases: [
        {
          title: 'Privilege Abuse',
          description: 'Authorized user accessing files outside normal scope',
          attackVector: 'Valid Accounts',
          mitreTechnique: 'T1078.002',
          severity: 'medium' as const,
          targetSystem: 'File Server',
          delay: 0,
          detectionProbability: 0.6
        },
        {
          title: 'Data Staging',
          description: 'Large amounts of sensitive data being copied to external drive',
          attackVector: 'Data Staged',
          mitreTechnique: 'T1074.001',
          severity: 'high' as const,
          targetSystem: 'Workstation',
          delay: 15000,
          detectionProbability: 0.85
        }
      ]
    },
    {
      name: 'Advanced Persistent Threat',
      phases: [
        {
          title: 'Watering Hole Attack',
          description: 'Legitimate website compromised to serve malware to visitors',
          attackVector: 'Drive-by Compromise',
          mitreTechnique: 'T1189',
          severity: 'high' as const,
          targetSystem: 'Web Browser',
          delay: 0,
          detectionProbability: 0.7
        },
        {
          title: 'Living off the Land',
          description: 'PowerShell used for reconnaissance and lateral movement',
          attackVector: 'PowerShell',
          mitreTechnique: 'T1059.001',
          severity: 'medium' as const,
          targetSystem: 'Domain Controller',
          delay: 22000,
          detectionProbability: 0.8
        },
        {
          title: 'Golden Ticket Attack',
          description: 'Forged Kerberos tickets used for domain persistence',
          attackVector: 'Golden Ticket',
          mitreTechnique: 'T1558.001',
          severity: 'critical' as const,
          targetSystem: 'Domain Controller',
          delay: 35000,
          detectionProbability: 0.9
        }
      ]
    },
    {
      name: 'Cloud Infrastructure Attack',
      phases: [
        {
          title: 'Cloud Enumeration',
          description: 'Automated scanning of cloud resources and permissions',
          attackVector: 'Cloud Service Discovery',
          mitreTechnique: 'T1526',
          severity: 'medium' as const,
          targetSystem: 'Cloud Services',
          delay: 0,
          detectionProbability: 0.75
        },
        {
          title: 'IAM Privilege Escalation',
          description: 'Exploiting misconfigured IAM policies for privilege escalation',
          attackVector: 'Cloud Administration Command',
          mitreTechnique: 'T1580',
          severity: 'high' as const,
          targetSystem: 'Cloud Services',
          delay: 18000,
          detectionProbability: 0.85
        }
      ]
    },
    {
      name: 'Network Lateral Movement',
      phases: [
        {
          title: 'Network Discovery',
          description: 'Automated port scanning across internal network segments',
          attackVector: 'Network Service Scanning',
          mitreTechnique: 'T1046',
          severity: 'medium' as const,
          targetSystem: 'Internal Network',
          delay: 0,
          detectionProbability: 0.9
        },
        {
          title: 'SMB Exploitation',
          description: 'Exploiting SMB vulnerabilities for lateral movement',
          attackVector: 'Exploitation of Remote Services',
          mitreTechnique: 'T1210',
          severity: 'high' as const,
          targetSystem: 'File Server',
          delay: 16000,
          detectionProbability: 0.85
        },
        {
          title: 'Pass-the-Hash Attack',
          description: 'Using stolen password hashes for authentication',
          attackVector: 'Pass the Hash',
          mitreTechnique: 'T1550.002',
          severity: 'high' as const,
          targetSystem: 'Multiple Systems',
          delay: 28000,
          detectionProbability: 0.88
        }
      ]
    },
    {
      name: 'Database Compromise',
      phases: [
        {
          title: 'SQL Injection Attack',
          description: 'Malicious SQL queries attempting to extract sensitive data',
          attackVector: 'Exploit Public-Facing Application',
          mitreTechnique: 'T1190',
          severity: 'high' as const,
          targetSystem: 'Database Server',
          delay: 0,
          detectionProbability: 0.92
        },
        {
          title: 'Database Enumeration',
          description: 'Systematic enumeration of database schemas and tables',
          attackVector: 'Data from Information Repositories',
          mitreTechnique: 'T1213.002',
          severity: 'medium' as const,
          targetSystem: 'Database Server',
          delay: 14000,
          detectionProbability: 0.8
        }
      ]
    },
    {
      name: 'Email Security Breach',
      phases: [
        {
          title: 'Email Account Takeover',
          description: 'Compromised email account used for internal phishing',
          attackVector: 'Email Account',
          mitreTechnique: 'T1078.003',
          severity: 'high' as const,
          targetSystem: 'Email Server',
          delay: 0,
          detectionProbability: 0.75
        },
        {
          title: 'Business Email Compromise',
          description: 'Fraudulent wire transfer request sent from compromised executive account',
          attackVector: 'Phishing',
          mitreTechnique: 'T1566.001',
          severity: 'critical' as const,
          targetSystem: 'Email Server',
          delay: 20000,
          detectionProbability: 0.7
        }
      ]
    },
    {
      name: 'Cryptocurrency Mining Attack',
      phases: [
        {
          title: 'Cryptojacking Deployment',
          description: 'Unauthorized cryptocurrency mining software installed',
          attackVector: 'Resource Hijacking',
          mitreTechnique: 'T1496',
          severity: 'medium' as const,
          targetSystem: 'Web Server',
          delay: 0,
          detectionProbability: 0.85
        }
      ]
    },
    {
      name: 'VPN Infrastructure Attack',
      phases: [
        {
          title: 'VPN Credential Stuffing',
          description: 'Automated login attempts using leaked credential databases',
          attackVector: 'Brute Force',
          mitreTechnique: 'T1110.004',
          severity: 'high' as const,
          targetSystem: 'VPN Gateway',
          delay: 0,
          detectionProbability: 0.9
        },
        {
          title: 'VPN Tunnel Hijacking',
          description: 'Successful compromise of VPN session for remote access',
          attackVector: 'Remote Services',
          mitreTechnique: 'T1021.005',
          severity: 'critical' as const,
          targetSystem: 'VPN Gateway',
          delay: 25000,
          detectionProbability: 0.95
        }
      ]
    },
    {
      name: 'Backup System Compromise',
      phases: [
        {
          title: 'Backup Enumeration',
          description: 'Scanning for accessible backup files and repositories',
          attackVector: 'Data from Network Shared Drive',
          mitreTechnique: 'T1039',
          severity: 'medium' as const,
          targetSystem: 'Backup Server',
          delay: 0,
          detectionProbability: 0.7
        },
        {
          title: 'Backup Deletion',
          description: 'Critical backup files being deleted to prevent recovery',
          attackVector: 'Inhibit System Recovery',
          mitreTechnique: 'T1490',
          severity: 'critical' as const,
          targetSystem: 'Backup Server',
          delay: 18000,
          detectionProbability: 0.98
        }
      ]
    },
    {
      name: 'Mobile Device Attack',
      phases: [
        {
          title: 'Mobile Malware Installation',
          description: 'Malicious app installed on corporate mobile device',
          attackVector: 'Drive-by Compromise',
          mitreTechnique: 'T1189',
          severity: 'medium' as const,
          targetSystem: 'Mobile Device',
          delay: 0,
          detectionProbability: 0.6
        },
        {
          title: 'Corporate Data Access',
          description: 'Malware accessing corporate email and documents on mobile device',
          attackVector: 'Data from Local System',
          mitreTechnique: 'T1005',
          severity: 'high' as const,
          targetSystem: 'Mobile Device',
          delay: 15000,
          detectionProbability: 0.8
        }
      ]
    },
    {
      name: 'IoT Device Compromise',
      phases: [
        {
          title: 'IoT Device Scanning',
          description: 'Scanning for vulnerable IoT devices on corporate network',
          attackVector: 'Network Service Scanning',
          mitreTechnique: 'T1046',
          severity: 'low' as const,
          targetSystem: 'IoT Devices',
          delay: 0,
          detectionProbability: 0.5
        },
        {
          title: 'IoT Botnet Formation',
          description: 'Compromised IoT devices being recruited into botnet',
          attackVector: 'Exploitation for Client Execution',
          mitreTechnique: 'T1203',
          severity: 'medium' as const,
          targetSystem: 'IoT Devices',
          delay: 20000,
          detectionProbability: 0.75
        }
      ]
    },
    {
      name: 'DNS Hijacking Attack',
      phases: [
        {
          title: 'DNS Cache Poisoning',
          description: 'Malicious DNS responses injected to redirect traffic',
          attackVector: 'Domain Generation Algorithms',
          mitreTechnique: 'T1568.002',
          severity: 'high' as const,
          targetSystem: 'DNS Server',
          delay: 0,
          detectionProbability: 0.85
        },
        {
          title: 'Traffic Redirection',
          description: 'Corporate traffic being redirected to malicious servers',
          attackVector: 'Traffic Signaling',
          mitreTechnique: 'T1205.001',
          severity: 'critical' as const,
          targetSystem: 'Network Infrastructure',
          delay: 12000,
          detectionProbability: 0.9
        }
      ]
    },
    {
      name: 'Zero-Day Exploitation',
      phases: [
        {
          title: 'Zero-Day Discovery',
          description: 'Previously unknown vulnerability being exploited',
          attackVector: 'Exploitation for Client Execution',
          mitreTechnique: 'T1203',
          severity: 'critical' as const,
          targetSystem: 'Web Application',
          delay: 0,
          detectionProbability: 0.4
        },
        {
          title: 'Payload Deployment',
          description: 'Advanced persistent threat payload deployed via zero-day',
          attackVector: 'User Execution',
          mitreTechnique: 'T1204.002',
          severity: 'critical' as const,
          targetSystem: 'Multiple Systems',
          delay: 15000,
          detectionProbability: 0.7
        }
      ]
    },
    {
      name: 'Social Engineering Campaign',
      phases: [
        {
          title: 'Pretexting Phone Call',
          description: 'Attacker impersonating IT support to gather credentials',
          attackVector: 'Phishing for Information',
          mitreTechnique: 'T1598.004',
          severity: 'medium' as const,
          targetSystem: 'Human Factor',
          delay: 0,
          detectionProbability: 0.3
        },
        {
          title: 'Physical Badge Cloning',
          description: 'Employee access badge cloned for unauthorized physical access',
          attackVector: 'Hardware Additions',
          mitreTechnique: 'T1200',
          severity: 'high' as const,
          targetSystem: 'Physical Security',
          delay: 30000,
          detectionProbability: 0.8
        }
      ]
    },
    {
      name: 'API Security Breach',
      phases: [
        {
          title: 'API Enumeration',
          description: 'Automated scanning of API endpoints for vulnerabilities',
          attackVector: 'Network Service Scanning',
          mitreTechnique: 'T1046',
          severity: 'medium' as const,
          targetSystem: 'API Gateway',
          delay: 0,
          detectionProbability: 0.8
        },
        {
          title: 'API Key Theft',
          description: 'Sensitive API keys extracted from exposed configuration',
          attackVector: 'Unsecured Credentials',
          mitreTechnique: 'T1552.001',
          severity: 'high' as const,
          targetSystem: 'API Gateway',
          delay: 16000,
          detectionProbability: 0.85
        }
      ]
    },
    {
      name: 'Container Escape Attack',
      phases: [
        {
          title: 'Container Vulnerability Scan',
          description: 'Scanning containerized applications for escape vulnerabilities',
          attackVector: 'Exploitation for Privilege Escalation',
          mitreTechnique: 'T1068',
          severity: 'medium' as const,
          targetSystem: 'Container Platform',
          delay: 0,
          detectionProbability: 0.75
        },
        {
          title: 'Container Breakout',
          description: 'Successful escape from container to host system',
          attackVector: 'Escape to Host',
          mitreTechnique: 'T1611',
          severity: 'critical' as const,
          targetSystem: 'Container Platform',
          delay: 22000,
          detectionProbability: 0.9
        }
      ]
    }
  ];

  // Generate attack event
  const generateAttackEvent = useCallback((phase: any, scenarioName: string): SimulationEvent => {
    const eventId = `event-${eventIdCounter.current++}`;
    const sourceIPs = [
      '203.0.113.45', '198.51.100.23', '192.0.2.156', '203.0.113.78', 
      '185.220.101.42', '89.248.171.34', '45.142.214.123', '194.147.85.67',
      '91.240.118.92', '178.128.83.165', '159.89.214.31', '167.172.44.89'
    ];
    const tools = [
      'Metasploit', 'Cobalt Strike', 'PowerShell Empire', 'Custom Malware', 
      'Mimikatz', 'BloodHound', 'Nmap', 'Burp Suite', 'Responder', 'Impacket',
      'Rubeus', 'SharpHound', 'CrackMapExec', 'Evil-WinRM', 'Chisel', 'Ligolo'
    ];

    return {
      id: eventId,
      timestamp: new Date(),
      type: 'attack',
      severity: phase.severity,
      status: 'active',
      title: `${scenarioName}: ${phase.title}`,
      description: phase.description,
      attackVector: phase.attackVector,
      targetSystem: phase.targetSystem,
      sourceIP: sourceIPs[Math.floor(Math.random() * sourceIPs.length)],
      destinationIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      mitreTechnique: phase.mitreTechnique,
      redTeamAction: {
        id: `red-${eventId}`,
        technique: phase.mitreTechnique,
        tool: tools[Math.floor(Math.random() * tools.length)],
        target: phase.targetSystem,
        success: Math.random() > 0.25,
        detectionProbability: phase.detectionProbability,
        impact: phase.severity,
        nextActions: [
          'Establish Persistence', 'Escalate Privileges', 'Lateral Movement', 
          'Data Exfiltration', 'Deploy Backdoor', 'Credential Harvesting',
          'Network Reconnaissance', 'Defense Evasion'
        ]
      }
    };
  }, []);

  // Generate blue team response
  const generateBlueTeamResponse = useCallback((attackEvent: SimulationEvent): SimulationEvent => {
    const detectionMethods = [
      'SIEM Correlation Engine', 'EDR Behavioral Analysis', 'Network Traffic Monitoring',
      'User Behavior Analytics', 'Threat Intelligence Feed', 'Anomaly Detection System',
      'Signature-based Detection', 'Machine Learning Model', 'Honeypot Alert',
      'DNS Monitoring', 'Email Security Gateway', 'Web Application Firewall',
      'Deception Technology', 'File Integrity Monitoring', 'Process Monitoring',
      'Memory Analysis', 'Network Segmentation Alert', 'Zero Trust Architecture',
      'Threat Hunting Platform', 'Security Orchestration', 'Incident Response Platform'
    ];

    const analysts = [
      'Alice Johnson (Senior SOC Analyst)', 'Bob Smith (Incident Response Lead)',
      'Carol Davis (Threat Hunter)', 'David Wilson (Security Engineer)',
      'Emma Brown (SOC Manager)', 'Frank Miller (Forensics Specialist)',
      'Grace Lee (Malware Analyst)', 'Henry Chen (Network Security Analyst)',
      'Isabella Rodriguez (Cyber Threat Intelligence)', 'Jack Thompson (Security Architect)',
      'Kate Williams (Digital Forensics)', 'Liam O\'Connor (Penetration Tester)',
      'Maya Patel (Security Operations)', 'Nathan Kim (Incident Commander)'
    ];

    const containmentActions = [
      'Automatically isolated affected endpoint', 'Blocked malicious IP at perimeter firewall',
      'Disabled compromised user account', 'Updated security signatures',
      'Deployed additional monitoring agents', 'Initiated automated incident response',
      'Collected forensic artifacts', 'Notified security team via SOAR platform',
      'Applied security patches', 'Quarantined suspicious files',
      'Reset user credentials', 'Updated threat intelligence feeds',
      'Activated network segmentation', 'Deployed honeypots in affected area',
      'Initiated threat hunting procedures', 'Escalated to incident response team',
      'Implemented additional access controls', 'Enhanced monitoring on critical assets',
      'Coordinated with external threat intelligence', 'Activated backup systems'
    ];
    
    const getResponseTime = (severity: string) => {
      switch (severity) {
        case 'critical': return Math.floor(Math.random() * 45) + 10;
        case 'high': return Math.floor(Math.random() * 90) + 20;
        case 'medium': return Math.floor(Math.random() * 150) + 30;
        case 'low': return Math.floor(Math.random() * 240) + 45;
        default: return Math.floor(Math.random() * 90) + 20;
      }
    };

    const responseEvent: SimulationEvent = {
      ...attackEvent,
      id: `response-${attackEvent.id}`,
      type: 'detection',
      status: 'detected',
      title: `🔍 DETECTED: ${attackEvent.title}`,
      description: `SOC automated detection: ${attackEvent.description}`,
      blueTeamResponse: {
        id: `blue-${attackEvent.id}`,
        detectionMethod: detectionMethods[Math.floor(Math.random() * detectionMethods.length)],
        responseTime: getResponseTime(attackEvent.severity),
        analyst: analysts[Math.floor(Math.random() * analysts.length)],
        containmentActions: containmentActions.slice(0, Math.floor(Math.random() * 4) + 2),
        effectiveness: Math.floor(Math.random() * 25) + 75,
        falsePositive: Math.random() < 0.02
      }
    };

    return responseEvent;
  }, []);

  // Generate mitigation event and update original attack status
  const generateMitigationEvent = useCallback((attackEvent: SimulationEvent): SimulationEvent => {
    const mitigationActions = [
      'Threat successfully contained and neutralized by automated response',
      'Malicious processes terminated and system restored to clean state',
      'Network access revoked and security policies updated',
      'Affected systems isolated and restored from verified clean backups',
      'Security patches applied and vulnerability remediated',
      'Enhanced monitoring deployed and threat signatures updated',
      'Incident fully documented and lessons learned captured',
      'User security awareness training scheduled for affected department',
      'Security controls strengthened based on attack vector',
      'Threat intelligence updated with new indicators of compromise',
      'Multi-factor authentication enforced on compromised accounts',
      'Network segmentation rules updated to prevent lateral movement',
      'Endpoint detection and response capabilities enhanced',
      'Threat hunting rules deployed to detect similar attacks',
      'Security incident response playbook updated with new procedures',
      'Vulnerability assessment scheduled for affected systems',
      'Security awareness campaign launched organization-wide',
      'Third-party security vendor engaged for additional analysis'
    ];

    const mitigationTools = [
      'SOAR Playbook', 'EDR Auto-Response', 'SIEM Correlation', 'Firewall Rules',
      'Endpoint Isolation', 'Patch Management', 'Backup Restoration', 'Account Lockout',
      'DNS Blocking', 'Email Quarantine', 'Network Segmentation', 'Threat Intelligence',
      'Deception Technology', 'Zero Trust Controls', 'Incident Response Platform',
      'Security Orchestration', 'Automated Remediation', 'Threat Hunting Platform'
    ];

    return {
      ...attackEvent,
      id: `mitigation-${attackEvent.id}`,
      type: 'mitigation',
      status: 'mitigated',
      title: `✅ MITIGATED: ${attackEvent.title}`,
      description: `${mitigationActions[Math.floor(Math.random() * mitigationActions.length)]} using ${mitigationTools[Math.floor(Math.random() * mitigationTools.length)]}.`,
      timestamp: new Date()
    };
  }, []);

  // Execute attack scenario
  const executeAttackScenario = useCallback(() => {
    const scenario = attackScenarios[Math.floor(Math.random() * attackScenarios.length)];
    const scenarioId = `scenario-${Date.now()}`;
    
    scenario.phases.forEach((phase, index) => {
      const timeout = setTimeout(() => {
        // Check if simulation is still running before generating events
        setSimulationState(currentState => {
          if (!currentState || currentState.status !== 'running') {
            return currentState; // Don't generate events if not running
          }

          const attackEvent = generateAttackEvent(phase, scenario.name);
          const newEvents = [...currentState.events, attackEvent];
          
          // Add notification only if simulation is still running
          addNotification(attackEvent);

          return {
            ...currentState,
            events: newEvents,
            metrics: updateMetrics(newEvents)
          };
        });

        // Blue team detection with varying probabilities
        if (Math.random() < phase.detectionProbability) {
          const detectionDelay = Math.floor(Math.random() * 15000) + 2000;
          
          const detectionTimeout = setTimeout(() => {
            setSimulationState(state => {
              if (!state || state.status !== 'running') {
                return state; // Don't generate responses if not running
              }

              // Find the original attack event
              const originalAttackEvent = state.events.find(e => 
                e.type === 'attack' && 
                e.title.includes(phase.title) && 
                e.status === 'active'
              );

              if (!originalAttackEvent) return state;

              const responseEvent = generateBlueTeamResponse(originalAttackEvent);
              
              // Update the original attack event status to 'detected'
              const updatedEvents = state.events.map(event => 
                event.id === originalAttackEvent.id 
                  ? { ...event, status: 'detected' as const }
                  : event
              );
              
              // Add the detection event
              const finalEvents = [...updatedEvents, responseEvent];
              
              // Add notification only if simulation is still running
              addNotification(responseEvent);

              return {
                ...state,
                events: finalEvents,
                metrics: updateMetrics(finalEvents)
              };
            });

            // Mitigation success rate varies by severity
            const mitigationRate = phase.severity === 'critical' ? 0.98 :
                                  phase.severity === 'high' ? 0.95 :
                                  phase.severity === 'medium' ? 0.92 : 0.88;
            
            if (Math.random() < mitigationRate) {
              const mitigationDelay = Math.floor(Math.random() * 35000) + 10000;
              
              const mitigationTimeout = setTimeout(() => {
                setSimulationState(state => {
                  if (!state || state.status !== 'running') {
                    return state; // Don't generate mitigations if not running
                  }
                  
                  // Find the original attack event that was detected
                  const originalAttackEvent = state.events.find(e => 
                    e.type === 'attack' && 
                    e.title.includes(phase.title) && 
                    e.status === 'detected'
                  );

                  if (!originalAttackEvent) return state;

                  const mitigationEvent = generateMitigationEvent(originalAttackEvent);
                  
                  // Update the original attack event status to 'mitigated'
                  const updatedEvents = state.events.map(event => 
                    event.id === originalAttackEvent.id 
                      ? { ...event, status: 'mitigated' as const }
                      : event
                  );
                  
                  // Add the mitigation event
                  const finalEvents = [...updatedEvents, mitigationEvent];
                  
                  // Add notification only if simulation is still running
                  addNotification(mitigationEvent);
                  
                  return {
                    ...state,
                    events: finalEvents,
                    metrics: updateMetrics(finalEvents)
                  };
                });
              }, mitigationDelay);

              attackChainRef.current.set(`${scenarioId}-mitigation-${index}`, mitigationTimeout);
            }
          }, detectionDelay);

          attackChainRef.current.set(`${scenarioId}-detection-${index}`, detectionTimeout);
        }
      }, phase.delay);

      attackChainRef.current.set(`${scenarioId}-${index}`, timeout);
    });
  }, [generateAttackEvent, generateBlueTeamResponse, generateMitigationEvent]);

  // Add notification - only if simulation is running
  const addNotification = useCallback((event: SimulationEvent) => {
    setSimulationState(currentState => {
      // Only add notifications if simulation is running
      if (!currentState || currentState.status !== 'running') {
        return currentState;
      }

      const getNotificationTitle = (event: SimulationEvent) => {
        if (event.type === 'attack') {
          return `🚨 RED TEAM: ${event.title}`;
        } else if (event.type === 'detection') {
          return `🛡️ BLUE TEAM: Detection Alert`;
        } else {
          return `✅ BLUE TEAM: Threat Mitigated`;
        }
      };

      const notification: NotificationData = {
        id: `notif-${event.id}`,
        type: event.type === 'attack' ? 'red-attack' : 
              event.type === 'detection' ? 'blue-detection' : 'blue-mitigation',
        severity: event.severity === 'critical' ? 'error' :
                  event.severity === 'high' ? 'warning' :
                  event.severity === 'medium' ? 'info' : 'info',
        title: getNotificationTitle(event),
        message: event.description,
        timestamp: event.timestamp,
        autoHide: true,
        duration: event.type === 'attack' ? 8000 : 
                  event.type === 'detection' ? 6000 : 7000,
        eventId: event.id
      };

      setNotifications(prev => [notification, ...prev.slice(0, 12)]);
      return currentState;
    });
  }, []);

  // Update metrics with proper counting logic
  const updateMetrics = useCallback((events: SimulationEvent[]): ThreatMetrics => {
    // Only count attack events for threat metrics
    const attackEvents = events.filter(e => e.type === 'attack');
    
    // Count attacks by their current status
    const activeAttacks = attackEvents.filter(e => e.status === 'active');
    const detectedAttacks = attackEvents.filter(e => e.status === 'detected');
    const mitigatedAttacks = attackEvents.filter(e => e.status === 'mitigated');

    // Get response times from blue team responses
    const detectionTimes = events
      .filter(e => e.blueTeamResponse)
      .map(e => e.blueTeamResponse!.responseTime);

    const responseTimes = detectionTimes.map(time => time + Math.floor(Math.random() * 120) + 20);

    return {
      totalThreats: attackEvents.length,
      activeThreats: activeAttacks.length,
      detectedThreats: detectedAttacks.length,
      mitigatedThreats: mitigatedAttacks.length,
      averageDetectionTime: detectionTimes.length > 0 
        ? detectionTimes.reduce((a, b) => a + b, 0) / detectionTimes.length 
        : 0,
      averageResponseTime: responseTimes.length > 0 
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
        : 0,
      detectionRate: attackEvents.length > 0 
        ? ((detectedAttacks.length + mitigatedAttacks.length) / attackEvents.length) * 100 
        : 0,
      mitigationRate: (detectedAttacks.length + mitigatedAttacks.length) > 0 
        ? (mitigatedAttacks.length / (detectedAttacks.length + mitigatedAttacks.length)) * 100 
        : 0
    };
  }, []);

  // Enhanced simulation loop with more frequent and diverse attacks
  const runSimulationStep = useCallback(() => {
    if (!simulationState || simulationState.status !== 'running') return;

    // 60% chance to trigger an attack scenario each step (increased from 40%)
    if (Math.random() < 0.6) {
      executeAttackScenario();
    }
  }, [simulationState, executeAttackScenario]);

  // Start simulation
  const startSimulation = useCallback(() => {
    if (!simulationState) return;
    
    setSimulationState(prev => prev ? { ...prev, status: 'running' } : prev);
    setIsRunning(true);
    
    // Reduced interval for more frequent events (from 5000 to 3500)
    intervalRef.current = setInterval(runSimulationStep, 3500);
    
    // Trigger multiple immediate attacks to show activity right away
    setTimeout(() => executeAttackScenario(), 1000);
    setTimeout(() => executeAttackScenario(), 3000);
    setTimeout(() => executeAttackScenario(), 6000);
  }, [simulationState, runSimulationStep, executeAttackScenario]);

  // Stop simulation (pause)
  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Clear all pending attack chains to stop new events
    attackChainRef.current.forEach(timeout => clearTimeout(timeout));
    attackChainRef.current.clear();
    
    setIsRunning(false);
    setSimulationState(prev => prev ? { ...prev, status: 'paused' } : prev);
  }, []);

  // Complete stop simulation (end simulation)
  const completeStopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Clear all pending attack chains to stop new events
    attackChainRef.current.forEach(timeout => clearTimeout(timeout));
    attackChainRef.current.clear();
    
    setIsRunning(false);
    setSimulationState(prev => prev ? { ...prev, status: 'completed' } : prev);
  }, []);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeSimulation();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      attackChainRef.current.forEach(timeout => clearTimeout(timeout));
      attackChainRef.current.clear();
    };
  }, [initializeSimulation]);

  // Auto-remove notifications
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoHide && notification.duration) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
      }
    });
  }, [notifications, removeNotification]);

  return {
    simulationState,
    notifications,
    isRunning,
    startSimulation,
    stopSimulation,
    completeStopSimulation,
    clearNotifications,
    removeNotification,
    initializeSimulation
  };
};
