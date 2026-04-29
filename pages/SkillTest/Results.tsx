import React, { useRef, useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { Download, Linkedin, Home, RefreshCw, Award, BadgeCheck, Twitter, Facebook, Share2, ShieldCheck, Mail } from 'lucide-react';
import SEO from '../../components/SEO';

const Results: React.FC = () => {
  const location = useLocation();
  const { name, score, total } = location.state || {};
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!name || score === undefined) {
    return <Navigate to="/skill-test" replace />;
  }

  const percentage = (score / total) * 100;
  
  let performanceComment = '';
  let colorClass = '';
  
  if (score >= 18) {
    performanceComment = 'World-Class Reliability Expert';
    colorClass = 'text-emerald-600 dark:text-emerald-400';
  } else if (score >= 14) {
    performanceComment = 'Advanced Reliability Professional';
    colorClass = 'text-blue-600 dark:text-blue-400';
  } else if (score >= 10) {
    performanceComment = 'Intermediate Reliability Engineer';
    colorClass = 'text-amber-600 dark:text-amber-400';
  } else {
    performanceComment = 'Novice Reliability Enthusiast';
    colorClass = 'text-slate-600 dark:text-slate-400';
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      // Dynamically import to prevent chunk loading issues and Vite pre-bundling hangs
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]);
      const html2canvas = html2canvasModule.default;
      const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // higher resolution
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${name.replace(/\s+/g, '_')}_Reliability_Certificate.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareUrl = `https://reliabilitytools.co.in/skill-test`;
  const shareText = `I just scored ${score}/${total} on the Global Reliability Engineering Skill Assessment at ReliabilityTools.co.in and achieved the rank of "${performanceComment}"! Test your skills and earn a professional certificate.`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 relative overflow-hidden">
      <SEO title="Your Reliability Test Results" description="View and download your professional reliability test certificate." />
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            Assessment Complete!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base">
            Congratulations! You successfully answered {Math.round(percentage)}% of the world-class reliability questions tailored to your discipline. Download your certificate and share your achievement with your professional network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start mb-8">
          
          {/* Left Column: Score & Actions */}
          <div className="flex flex-col gap-6">
            
            {/* Score Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 bg-white dark:bg-slate-900 rounded-full shadow-2xl mb-4 relative border-4 border-slate-50 dark:border-slate-800">
                <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    className={colorClass} 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * percentage) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white absolute">{score}<span className="text-sm md:text-base font-bold text-slate-400">/{total}</span></span>
              </div>
              
              <p className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Performance Rank</p>
              <h2 className={`text-xl md:text-2xl font-black ${colorClass} mb-6`}>{performanceComment}</h2>
              
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-xl shadow-cyan-600/20 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                {isDownloading ? 'Generating PDF...' : 'Download Official Certificate'}
              </button>
            </div>

            {/* Share Links Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
              <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Share your achievement & Challenge others</p>
              <div className="grid grid-cols-2 gap-3 w-full">
                <a 
                  href={`https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}%0A%0A${encodedUrl}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg font-bold transition-colors shadow-md text-sm"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-bold transition-colors shadow-md dark:bg-white dark:text-black dark:hover:bg-gray-200 text-sm"
                >
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#0C58C3] text-white rounded-lg font-bold transition-colors shadow-md text-sm"
                >
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
                <a 
                  href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} 
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg font-bold transition-colors shadow-md text-sm"
                >
                  <Share2 className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
            
          </div>

         {/* Invisible container for html2canvas to render full size certificate accurately */}
        <div className="absolute left-[-9999px] top-[-9999px]">
          <div 
            ref={certificateRef} 
            className="bg-white relative" 
            style={{ fontFamily: "'Inter', sans-serif", width: '1123px', height: '794px' }}
          >
            {/* Outer border frame */}
            <div style={{ position: 'absolute', inset: 0, border: '28px solid #f1f5f9', background: '#f8fafc' }}>
              {/* Inner double border */}
              <div style={{ 
                width: '100%', height: '100%', 
                border: '6px double #cbd5e1', 
                background: '#ffffff',
                display: 'flex', flexDirection: 'column',
                position: 'relative',
                boxSizing: 'border-box'
              }}>
                 
                 {/* Corner Flourishes */}
                 <div style={{ position: 'absolute', top: '12px', left: '12px', width: '40px', height: '40px', borderTop: '2px solid #d97706', borderLeft: '2px solid #d97706' }}></div>
                 <div style={{ position: 'absolute', top: '12px', right: '12px', width: '40px', height: '40px', borderTop: '2px solid #d97706', borderRight: '2px solid #d97706' }}></div>
                 <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '40px', height: '40px', borderBottom: '2px solid #d97706', borderLeft: '2px solid #d97706' }}></div>
                 <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '40px', height: '40px', borderBottom: '2px solid #d97706', borderRight: '2px solid #d97706' }}></div>

                 {/* Faint Watermark */}
                 <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.07, pointerEvents: 'none' }}>
                    <ShieldCheck style={{ width: '400px', height: '400px', color: '#0f172a' }} />
                 </div>

                 {/* Certificate Content - uses padding and flexbox, NO absolute positioning */}
                 <div style={{ 
                   position: 'relative', zIndex: 10, 
                   display: 'flex', flexDirection: 'column', alignItems: 'center',
                   padding: '36px 48px 28px 48px',
                   flex: 1
                 }}>
                    {/* Award icons row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                       <Award style={{ width: '40px', height: '40px', color: '#d97706' }} />
                       <div style={{ height: '2px', width: '100px', background: 'rgba(217,119,6,0.3)' }}></div>
                       <Award style={{ width: '40px', height: '40px', color: '#d97706' }} />
                    </div>

                    <h1 style={{ 
                      fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 900, 
                      letterSpacing: '0.12em', color: '#0f172a', textTransform: 'uppercase',
                      margin: '0 0 8px 0', textAlign: 'center', lineHeight: 1.15
                    }}>
                      Certificate of Achievement
                    </h1>
                    
                    <div style={{ height: '0', width: '220px', borderTop: '6px solid #d97706', marginBottom: '20px', display: 'block' }}></div>
                    
                    <p style={{ 
                      fontSize: '14px', letterSpacing: '0.2em', color: '#64748b', 
                      textTransform: 'uppercase', fontWeight: 700, margin: '0 0 16px 0'
                    }}>
                      This is proudly presented to
                    </p>
                    
                    <h2 style={{ 
                      fontFamily: 'Georgia, serif', fontSize: '52px', fontWeight: 700, 
                      color: '#0f172a', fontStyle: 'italic', textAlign: 'center', 
                      width: '100%', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px',
                      margin: '0 0 16px 0', lineHeight: 1.2
                    }}>
                      {name}
                    </h2>
                    
                    <p style={{ 
                      fontSize: '16px', color: '#334155', textAlign: 'center', 
                      maxWidth: '700px', lineHeight: 1.6, fontWeight: 500,
                      margin: '0 0 14px 0'
                    }}>
                      For successfully demonstrating comprehensive and advanced engineering knowledge in the Global Reliability Engineering Skill Assessment, and officially achieving the rank of:
                    </p>
                    
                    <p style={{ 
                      fontFamily: 'Georgia, serif', fontSize: '28px', color: '#b45309', 
                      fontWeight: 700, margin: '0'
                    }}>
                      {performanceComment}
                    </p>
                    
                    {/* Spacer to push footer to bottom */}
                    <div style={{ flex: 1, minHeight: '20px' }}></div>
                    
                    {/* Footer - Score / Seal / Date */}
                    <div style={{ 
                      display: 'flex', width: '100%', justifyContent: 'space-between', 
                      alignItems: 'flex-end', padding: '0 24px'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          borderBottom: '2px solid #1e293b', width: '180px', marginBottom: '6px', 
                          fontSize: '22px', fontFamily: 'Georgia, serif', color: '#1e293b', paddingBottom: '4px'
                        }}>{score} / {total}</div>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 900, color: '#64748b', margin: 0 }}>Official Score</p>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '90px', height: '90px', background: '#fffbeb', borderRadius: '50%',
                          border: '3px solid #d97706', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                           <ShieldCheck style={{ width: '44px', height: '44px', color: '#b45309' }} />
                        </div>
                        <div style={{ marginTop: '8px', fontWeight: 900, color: '#1e293b', letterSpacing: '0.2em', fontSize: '9px' }}>RELIABILITYTOOLS.CO.IN</div>
                      </div>
                      
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          borderBottom: '2px solid #1e293b', width: '180px', marginBottom: '6px', 
                          fontSize: '16px', fontFamily: 'Georgia, serif', color: '#1e293b', paddingBottom: '4px'
                        }}>{currentDate}</div>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 900, color: '#64748b', margin: 0 }}>Date of Award</p>
                      </div>
                    </div>

                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Certificate Preview (scaled for UI) */}
        <div className="flex flex-col w-full">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 text-center lg:text-left">Certificate Preview</h3>
          <div className="bg-white rounded-2xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800 pointer-events-none select-none w-full transform hover:scale-[1.01] transition-transform duration-500 h-max">
            <div className="aspect-[1.414/1] bg-slate-50 relative border-[6px] md:border-[12px] border-slate-100 overflow-hidden p-0.5">
               <div className="w-full h-full border-[2px] md:border-[3px] border-double border-slate-300 relative bg-white flex flex-col items-center" style={{ padding: 'clamp(6px, 1.5vw, 16px) clamp(8px, 2vw, 20px)' }}>
                 {/* Corner Flourishes */}
                 <div className="absolute top-1.5 left-1.5 w-3 h-3 md:w-5 md:h-5 border-t border-l border-amber-600"></div>
                 <div className="absolute top-1.5 right-1.5 w-3 h-3 md:w-5 md:h-5 border-t border-r border-amber-600"></div>
                 <div className="absolute bottom-1.5 left-1.5 w-3 h-3 md:w-5 md:h-5 border-b border-l border-amber-600"></div>
                 <div className="absolute bottom-1.5 right-1.5 w-3 h-3 md:w-5 md:h-5 border-b border-r border-amber-600"></div>
                 
                 {/* Watermark */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
                    <ShieldCheck className="w-[100px] md:w-[180px] h-[100px] md:h-[180px] text-slate-900" />
                 </div>

                 {/* Award Icon */}
                 <Award className="w-3 md:w-5 h-3 md:h-5 text-amber-600 z-10 shrink-0" style={{ marginBottom: 'clamp(2px, 0.4vw, 6px)' }} />
                 
                 {/* Title */}
                 <h4 className="font-black text-slate-800 uppercase tracking-widest z-10 text-center leading-none shrink-0" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(7px, 1.5vw, 18px)', marginBottom: 'clamp(2px, 0.3vw, 4px)' }}>Certificate of Achievement</h4>
                 <div className="bg-amber-600 z-10 shrink-0" style={{ height: 'clamp(1px, 0.2vw, 2px)', width: 'clamp(24px, 6vw, 72px)', marginBottom: 'clamp(3px, 0.5vw, 8px)' }}></div>
                 
                 {/* Presented To */}
                 <p className="text-slate-500 uppercase tracking-widest font-bold z-10 shrink-0" style={{ fontSize: 'clamp(3px, 0.6vw, 8px)', marginBottom: 'clamp(2px, 0.5vw, 8px)' }}>This is proudly presented to</p>
                 
                 {/* Name */}
                 <p className="font-bold text-slate-900 border-b border-slate-200 w-4/5 text-center z-10 italic shrink-0" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(10px, 2.5vw, 30px)', paddingBottom: 'clamp(1px, 0.3vw, 4px)', marginBottom: 'clamp(3px, 0.6vw, 10px)', lineHeight: 1.2 }}>{name}</p>
                 
                 {/* Description */}
                 <p className="text-slate-700 text-center z-10 shrink-0" style={{ fontSize: 'clamp(4px, 0.7vw, 9px)', maxWidth: '80%', lineHeight: 1.35, marginBottom: 'clamp(2px, 0.5vw, 8px)' }}>
                   For successfully demonstrating comprehensive engineering knowledge in the Global Reliability Skill Assessment.
                 </p>
                 
                 {/* Performance Rank */}
                 <p className="text-amber-700 font-bold z-10 shrink-0" style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(6px, 1.2vw, 15px)' }}>{performanceComment}</p>
                 
                 {/* Spacer */}
                 <div className="flex-1 min-h-[4px]"></div>
                 
                 {/* Footer - fully in flow, NOT absolute */}
                 <div className="flex justify-between w-full z-10 shrink-0 items-end" style={{ padding: '0 clamp(4px, 1vw, 16px)' }}>
                   <div className="text-center">
                      <div className="font-serif text-slate-800 border-b border-slate-800" style={{ fontSize: 'clamp(5px, 1vw, 12px)', width: 'clamp(28px, 6vw, 64px)', paddingBottom: '1px', marginBottom: '1px' }}>{score} / {total}</div>
                      <div className="font-black uppercase text-slate-500 tracking-widest" style={{ fontSize: 'clamp(3px, 0.4vw, 6px)' }}>Score</div>
                   </div>
                   <div className="text-center flex flex-col items-center justify-end">
                      <ShieldCheck className="text-amber-600" style={{ width: 'clamp(12px, 2.2vw, 28px)', height: 'clamp(12px, 2.2vw, 28px)', marginBottom: '1px' }} />
                      <div className="font-black text-slate-800 tracking-widest" style={{ fontSize: 'clamp(3px, 0.4vw, 6px)' }}>RELIABILITYTOOLS.CO.IN</div>
                   </div>
                   <div className="text-center">
                      <div className="font-serif text-slate-800 border-b border-slate-800" style={{ fontSize: 'clamp(4px, 0.7vw, 9px)', width: 'clamp(28px, 6vw, 64px)', paddingBottom: '1px', marginBottom: '1px' }}>{currentDate}</div>
                      <div className="font-black uppercase text-slate-500 tracking-widest" style={{ fontSize: 'clamp(3px, 0.4vw, 6px)' }}>Date</div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        </div> {/* End of Grid */}

        <div className="text-center border-t border-slate-200 dark:border-slate-800 pt-8 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-colors">
            <Home className="w-5 h-5" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
