import React, { useState } from 'react';
import { Shield, Target, Zap, Users, Eye, Clock, TrendingUp, ChevronRight, Play, CheckCircle, X, GraduationCap, Trophy, Gamepad2 } from 'lucide-react';
import Scenario1 from './components/Scenario1';
import ScenarioSelector from './components/ScenarioSelector';
import EarlyAccessModal from './components/EarlyAccessModal';

function App() {
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'scenarios' | 'simulation'>('home');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isEarlyAccessModalOpen, setIsEarlyAccessModalOpen] = useState(false);

 const handleStartSimulation = () => {
    setCurrentPage('scenarios');
  };

  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setCurrentPage('simulation');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedScenario(null);
  };
  
  const handleLearnMoreClick = () => {
    setShowLearnMoreModal(true);
  };

  const handleCloseLearnMore = () => {
    setShowLearnMoreModal(false);
  };

// Handle backdrop click to close modal
const handleBackdropClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) {
    setShowLearnMoreModal(false);
     }
  };


  const handleBackToScenarios = () => {
    setCurrentPage('scenarios');
    setSelectedScenario(null);
  };

  if (currentPage === 'simulation') {
    return <Scenario1 onBack={handleBackToScenarios} scenarioId={selectedScenario} />;
  }

  if (currentPage === 'scenarios') {
    return <ScenarioSelector onSelectScenario={handleSelectScenario} onBack={handleBackToHome} />;
  }
  const handleOpenEarlyAccess = () => {
    setIsEarlyAccessModalOpen(true);
  };

  const handleCloseEarlyAccess = () => {
    setIsEarlyAccessModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/30 max-w-2xl w-full shadow-2xl shadow-purple-500/20 animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-8 pb-6">
              <button
                onClick={handleCloseLearnMore}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Learn More</h2>
                  <p className="text-purple-300">About PurpleForge</p>
                </div>
              </div>

              {/* Main Message */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30 mb-6">
                <p className="text-xl text-gray-200 leading-relaxed text-center">
                  "We bring educational opportunities with fun and a little bit of competition. Let our team bring you into exciting world of cybersecurity"
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-purple-500/20">
                  <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Educational</h3>
                  <p className="text-gray-400 text-sm">Learn through hands-on cybersecurity scenarios</p>
                </div>

                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-purple-500/20">
                  <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Gamepad2 className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Fun</h3>
                  <p className="text-gray-400 text-sm">Engaging simulations that make learning enjoyable</p>
                </div>

                <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-purple-500/20">
                  <div className="bg-yellow-500/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Trophy className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Competitive</h3>
                  <p className="text-gray-400 text-sm">Challenge yourself and compete with others</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => {
                    setShowLearnMoreModal(false);
                    handleStartSimulation();
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Your Journey</span>
                </button>
                <button
                  onClick={handleCloseLearnMore}
                  className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                >
                  <span>Maybe Later</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold text-white">PurpleForge</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">Features</a>
              <a href="#audience" className="text-gray-300 hover:text-purple-400 transition-colors">Audience</a>
           
              <button 
                onClick={handleOpenEarlyAccess}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Get Early Access
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="inline-flex items-center space-x-2 bg-purple-900/30 border border-purple-500/30 rounded-full px-4 py-2 text-sm">
                    <Zap className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-200">Revolutionary Purple Team Platform</span>
                  </div>
                  
                  {/* Your uploaded logo positioned to the right of the badge - made bigger */}
                  <a 
                    href="https://bolt.new/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src="/images/white_circle_360x360.png" 
                      alt="Built with Bolt.new" 
                      className="h-20 w-auto object-contain"
                    />
                  </a>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Red Meets Blue</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  PurpleForge dismantles security silos, creating a unified arena where offensive actions translate directly into defensive evolution. Move beyond theoretical reports into continuous, measurable improvement.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
               <button 
                  onClick={handleStartSimulation}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Simulation</span>
                </button>
                <button 
                  onClick={handleLearnMoreClick}  // Added this onClick handler
                  className="border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
                  >
                  <span>Learn More</span>
                  <ChevronRight className="h-5 w-5" />
                  </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                    <Target className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <div className="text-red-400 font-semibold">Red Team</div>
                    <div className="text-gray-400 text-sm">Offensive Operations</div>
                  </div>
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
                    <Shield className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-blue-400 font-semibold">Blue Team</div>
                    <div className="text-gray-400 text-sm">Defensive Response</div>
                  </div>
                  <div className="col-span-2 bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-purple-400 font-semibold">Purple Team Collaboration</div>
                    <div className="text-gray-400 text-sm">Unified Security Evolution</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools that transform security testing from isolated exercises into collaborative, measurable improvements
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Unified Simulation Arena</h3>
              <p className="text-gray-400">Real-time workspace where Red Teams launch attacks and Blue Teams respond in a shared environment.</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="bg-red-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Dynamic Threat Engine</h3>
              <p className="text-gray-400">Customizable, real-world threats based on MITRE ATT&CK® framework for comprehensive testing.</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Live Response Scoring</h3>
              <p className="text-gray-400">Real-time evaluation of Blue Team performance with metrics like TTD, TTC, and mitigation effectiveness.</p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="bg-green-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Actionable Feedback Loop</h3>
              <p className="text-gray-400">Automated Synergy Reports that translate findings into trackable security improvements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-4">Real-Time Security Intelligence</h2>
                <p className="text-xl text-gray-300">
                  Our Live Response Scoring System provides unprecedented visibility into your security posture, measuring what matters most.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">TTD</div>
                  <div className="text-gray-400">Time to Detect</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">TTC</div>
                  <div className="text-gray-400">Time to Contain</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">MES</div>
                  <div className="text-gray-400">Mitigation Effectiveness</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-2">RSI</div>
                  <div className="text-gray-400">Response Speed Index</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-purple-500/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Threat Detection Rate</span>
                  <span className="text-green-400 font-bold">94%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{width: '94%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Response Time</span>
                  <span className="text-blue-400 font-bold">2.3s</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Containment Success</span>
                  <span className="text-purple-400 font-bold">91%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full" style={{width: '91%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section id="audience" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built for Security Professionals</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              PurpleForge serves organizations at every level, from enterprise SOCs to educational institutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Security Operations Centers</h3>
              <p className="text-gray-400">Enhance SOC capabilities with realistic threat simulations and performance metrics.</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-red-600 to-red-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Penetration Testers</h3>
              <p className="text-gray-400">Collaborate with defensive teams to maximize the impact of security assessments.</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Educational Institutions</h3>
              <p className="text-gray-400">Train the next generation of cybersecurity professionals with hands-on experience.</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enterprise Organizations</h3>
              <p className="text-gray-400">Build truly resilient cyber defense capabilities across your organization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-12 border border-purple-500/20">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Forge Your Purple Team?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the security revolution. Transform your defensive capabilities with PurpleForge's collaborative command platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleOpenEarlyAccess}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Get Early Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-bold text-white">PurpleForge</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 PurpleForge. Forging the future of collaborative cybersecurity.
            </div>
          </div>
        </div>
      </footer>

      {/* Early Access Modal */}
      <EarlyAccessModal 
        isOpen={isEarlyAccessModalOpen} 
        onClose={handleCloseEarlyAccess} 
      />
    </div>
  );
}

export default App;