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
            className="w-[1123px] h-[794px] bg-white relative flex flex-col" 
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Highly Professional Borders */}
            <div className="absolute inset-0 border-[30px] border-slate-100 flex items-center justify-center p-3 bg-slate-50">
               <div className="w-full h-full border-[8px] border-double border-slate-300 relative bg-white p-12 overflow-hidden flex flex-col shadow-inner">
                 
                 {/* Elegant Corner Flourishes */}
                 <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-600"></div>
                 <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-600"></div>
                 <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-600"></div>
                 <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-600"></div>

                 {/* Faint Watermark Logo */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <ShieldCheck className="w-[500px] h-[500px] text-slate-900" />
                 </div>

                 {/* Certificate Content */}
                 <div className="relative z-10 flex flex-col items-center flex-grow">
                    <div className="flex items-center justify-center gap-4 mb-6">
                       <Award className="w-12 h-12 text-amber-600" />
                       <div className="h-0.5 w-32 bg-amber-600/30"></div>
                       <Award className="w-12 h-12 text-amber-600" />
                    </div>

                    <h1 className="text-[56px] font-black tracking-[0.15em] text-slate-900 uppercase mb-3 text-center" style={{ fontFamily: 'Georgia, serif' }}>
                      Certificate of Achievement
                    </h1>
                    
                    <div className="h-1.5 w-64 bg-amber-600 mb-10"></div>
                    
                    <p className="text-xl tracking-[0.25em] text-slate-500 uppercase font-bold mb-8">
                      This is proudly presented to
                    </p>
                    
                    <h2 className="text-[72px] font-bold text-slate-900 mb-8 italic text-center w-full pb-4 border-b border-slate-200" style={{ fontFamily: 'Georgia, serif' }}>
                      {name}
                    </h2>
                    
                    <p className="text-2xl text-slate-700 text-center max-w-4xl leading-relaxed mb-6 font-medium">
                      For successfully demonstrating comprehensive and advanced engineering knowledge in the Global Reliability Engineering Skill Assessment, and officially achieving the rank of:
                    </p>
                    
                    <p className="text-4xl text-amber-700 font-bold mb-auto" style={{ fontFamily: 'Georgia, serif' }}>
                      {performanceComment}
                    </p>
                    
                    {/* Signatures & Footer */}
                    <div className="flex w-full justify-between items-end mt-12 px-8">
                      <div className="text-center">
                        <div className="border-b-2 border-slate-800 w-64 mb-3 text-3xl font-serif text-slate-800 pb-1">{score} / {total}</div>
                        <p className="text-sm uppercase tracking-widest font-black text-slate-500">Official Score</p>
                      </div>
                      
                      <div className="flex flex-col items-center mb-[-20px]">
                        <div className="relative flex items-center justify-center w-32 h-32 bg-amber-50 rounded-full border-4 border-amber-600 shadow-lg">
                           <ShieldCheck className="w-16 h-16 text-amber-700" />
                           <svg viewBox="0 0 100 100" className="absolute w-full h-full animate-[spin_30s_linear_infinite]">
                             <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                             <text className="text-[10px] font-bold tracking-widest fill-amber-800 uppercase">
                               <textPath href="#circlePath" startOffset="50%" textAnchor="middle"> • VERIFIED EXPERTISE • VERIFIED EXPERTISE </textPath>
                             </text>
                           </svg>
                        </div>
                        <div className="mt-6 font-black text-slate-800 tracking-[0.3em] text-sm">RELIABILITYTOOLS.CO.IN</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="border-b-2 border-slate-800 w-64 mb-3 text-2xl font-serif text-slate-800 pb-1">{currentDate}</div>
                        <p className="text-sm uppercase tracking-widest font-black text-slate-500">Date of Award</p>
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
            <div className="aspect-[1.414/1] bg-slate-50 relative border-[8px] md:border-[16px] border-slate-100 overflow-hidden flex items-center justify-center p-2">
               <div className="w-full h-full border-[3px] md:border-4 border-double border-slate-300 relative bg-white p-3 md:p-6 flex flex-col items-center">
                 <div className="absolute top-2 left-2 w-4 h-4 md:w-6 md:h-6 border-t border-l border-amber-600"></div>
                 <div className="absolute top-2 right-2 w-4 h-4 md:w-6 md:h-6 border-t border-r border-amber-600"></div>
                 <div className="absolute bottom-2 left-2 w-4 h-4 md:w-6 md:h-6 border-b border-l border-amber-600"></div>
                 <div className="absolute bottom-2 right-2 w-4 h-4 md:w-6 md:h-6 border-b border-r border-amber-600"></div>
                 
                 <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                    <ShieldCheck className="w-[150px] md:w-[250px] h-[150px] md:h-[250px] text-slate-900" />
                 </div>

                 <Award className="w-5 md:w-8 h-5 md:h-8 text-amber-600 mb-1.5 md:mb-3 z-10" />
                 
                 <h4 className="text-sm md:text-2xl font-black text-slate-800 uppercase tracking-widest z-10 text-center leading-tight" style={{ fontFamily: 'Georgia, serif' }}>Certificate of Achievement</h4>
                 <div className="h-0.5 w-12 md:w-24 bg-amber-600 my-1.5 md:my-3 z-10"></div>
                 <p className="text-[6px] md:text-[10px] text-slate-500 uppercase tracking-widest font-bold z-10 mb-1.5 md:mb-3">This is proudly presented to</p>
                 
                 <p className="text-xl md:text-4xl font-bold text-slate-900 border-b border-slate-200 pb-1.5 w-full text-center z-10 italic mb-2 md:mb-4 leading-none" style={{ fontFamily: 'Georgia, serif' }}>{name}</p>
                 
                 <p className="text-[8px] md:text-xs text-slate-700 text-center max-w-[85%] z-10 mb-2 md:mb-4 leading-tight">
                   For successfully demonstrating comprehensive engineering knowledge in the Global Reliability Skill Assessment.
                 </p>
                 <p className="text-xs md:text-xl text-amber-700 font-bold z-10" style={{ fontFamily: 'Georgia, serif' }}>{performanceComment}</p>
                 
                 <div className="flex justify-between w-full px-2 md:px-8 mt-auto absolute bottom-3 md:bottom-6 z-10">
                   <div className="text-center">
                      <div className="text-xs md:text-lg font-serif text-slate-800 border-b border-slate-800 w-12 md:w-20 pb-0.5 mb-0.5">{score} / {total}</div>
                      <div className="text-[5px] md:text-[7px] font-black uppercase text-slate-500 tracking-widest">Score</div>
                   </div>
                   <div className="text-center flex flex-col items-center justify-end">
                      <ShieldCheck className="w-6 md:w-10 h-6 md:h-10 text-amber-600 mb-0.5" />
                      <div className="text-[5px] md:text-[7px] font-black text-slate-800 tracking-widest">RELIABILITYTOOLS.CO.IN</div>
                   </div>
                   <div className="text-center">
                      <div className="text-[8px] md:text-sm font-serif text-slate-800 border-b border-slate-800 w-12 md:w-20 pb-0.5 mb-0.5">{currentDate}</div>
                      <div className="text-[5px] md:text-[7px] font-black uppercase text-slate-500 tracking-widest">Date</div>
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
