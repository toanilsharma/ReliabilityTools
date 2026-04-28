import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight, FileText, Linkedin, Sparkles, Clock, ShieldAlert, Ban, CheckCircle2 } from 'lucide-react';
import SEO from '../../components/SEO';

const Landing: React.FC = () => {
  const [name, setName] = useState('');
  const [discipline, setDiscipline] = useState<'mechanical' | 'electrical' | 'instrumentation' | 'general'>('mechanical');
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(2);
    }
  };

  const handleStartExam = () => {
    navigate('/skill-test/quiz', { state: { name: name.trim(), discipline } });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-2 md:p-4 relative overflow-hidden">
      <SEO 
        title="Test Your Reliability Skill Level | Reliability Tools" 
        description="Take our world-class reliability engineering quiz to test your knowledge. Earn a downloadable PDF certificate and share your expertise on LinkedIn." 
      />
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative transition-all duration-500">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-4 md:p-6 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CgkJPGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz4KCTwvc3ZnPg==')]"></div>
           <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-xl mb-3 shadow-lg border border-white/30 transform -rotate-6">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                Global Reliability Skill Assessment
              </h1>
              <p className="text-sm md:text-base text-cyan-100 mb-0 max-w-xl mx-auto font-medium">
                Are you a true reliability expert? Take our 20-question randomized challenge and prove it to the world.
              </p>
           </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 mb-6 text-left relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                 <h3 className="text-base font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-1.5">
                   <Sparkles className="w-4 h-4" /> Why take this assessment?
                 </h3>
                 <p className="text-slate-700 dark:text-slate-300 text-xs md:text-sm leading-relaxed mb-3">
                   Stand out to recruiters and peers! Upon completion, you will instantly receive a highly professional, <strong>high-resolution PDF Certificate of Achievement</strong>. Showcase your performance rank directly on your LinkedIn profile.
                 </p>
                 <div className="flex flex-wrap gap-2">
                   <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-[10px] md:text-xs font-bold rounded-full">
                     <FileText className="w-3 h-3" /> PDF Certificate
                   </span>
                   <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] dark:text-[#70b5f9] text-[10px] md:text-xs font-bold rounded-full">
                     <Linkedin className="w-3 h-3" /> 1-Click LinkedIn Share
                   </span>
                 </div>
              </div>

              <form onSubmit={handleNameSubmit} className="space-y-4 max-w-md mx-auto">
                <div className="text-left">
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    What name should appear on your certificate?
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Anil Sharma"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all font-semibold text-base"
                  />
                </div>
                
                <div className="text-left">
                  <label htmlFor="discipline" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Select your Engineering Discipline
                  </label>
                  <select
                    id="discipline"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all font-semibold text-base cursor-pointer"
                  >
                    <option value="mechanical">Mechanical Engineering</option>
                    <option value="electrical">Electrical Engineering</option>
                    <option value="instrumentation">Instrumentation & Control</option>
                    <option value="general">General / Reliability Engineer</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold text-base transition-all transform hover:-translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 text-center border-b border-slate-200 dark:border-slate-800 pb-3">
                Exam Rules & Guidelines
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
                <div className="flex gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg shrink-0 h-min">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">30-Second Limit</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-tight">30 seconds per question. Unanswered questions are marked incorrect.</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-lg shrink-0 h-min">
                    <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Secure Environment</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-tight">Right-clicking, text selection, and keyboard shortcuts are disabled.</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-lg shrink-0 h-min">
                    <Ban className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">No Backtracking</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-tight">Once you select an answer or time expires, you cannot return to previous questions.</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-lg shrink-0 h-min">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Certification</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-tight">20 randomized questions. A PDF certificate will be generated upon completion.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartExam}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-base md:text-lg transition-all transform hover:-translate-y-0.5 shadow-lg"
              >
                I Understand, Start Exam <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Landing;
