import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Download, 
  Code, 
  Copy, 
  Check, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Cpu, 
  Wrench, 
  Share2, 
  ExternalLink 
} from 'lucide-react';
import SEO from '../components/SEO';
import { BASE_URL } from '../utils/seoConfig';
import { generateProfessionalPDF } from '../utils/PDFService';

interface CourseMapping {
  courseCode: string;
  courseTitle: string;
  department: string;
  description: string;
  recommendedTools: { name: string; path: string; usage: string }[];
}

const COURSES: CourseMapping[] = [
  {
    courseCode: 'ME-402',
    courseTitle: 'Reliability Engineering & Life Testing',
    department: 'Mechanical & Materials Engineering',
    description: 'Covers statistical failure distributions, Weibull analysis, reliability demonstration testing, and MTBF estimation.',
    recommendedTools: [
      { name: 'Weibull Analysis Tool', path: '/tools/weibull/', usage: 'Parameter estimation (Eta, Beta) & failure rate plotting' },
      { name: 'MTBF / MTTF Calculator', path: '/tools/mtbf/', usage: 'Calculating MTBF with Chi-Square confidence bounds' },
      { name: 'Reliability Growth (Crow-AMSAA)', path: '/tools/growth/', usage: 'Tracking reliability growth during prototype testing' }
    ]
  },
  {
    courseCode: 'IE-305',
    courseTitle: 'Quality Control & Risk Management',
    department: 'Industrial & Systems Engineering',
    description: 'Focuses on Failure Mode and Effects Analysis (FMEA), Statistical Process Control, and root cause analysis.',
    recommendedTools: [
      { name: 'FMEA RPN Calculator', path: '/tools/fmea/', usage: 'Calculating RPN (Severity × Occurrence × Detection) and Action Priorities' },
      { name: 'Fishbone Diagram (Ishikawa)', path: '/tools/fishbone/', usage: 'Structuring 6M root cause analysis for manufacturing defects' },
      { name: 'OEE Calculator', path: '/tools/oee/', usage: 'Analyzing Availability, Performance, and Quality losses' }
    ]
  },
  {
    courseCode: 'EM-501',
    courseTitle: 'Systems Safety & Functional Safety',
    department: 'Engineering Management & Safety',
    description: 'Covers Safety Instrumented Systems (SIS), PFDavg, SIL verification per IEC 61508 / 61511, and Fault Tree Analysis.',
    recommendedTools: [
      { name: 'SIL Verification Tool', path: '/tools/sil/', usage: 'Calculating PFDavg and SIL compliance for SIF loops' },
      { name: 'Fault Tree Analysis (FTA)', path: '/tools/fta/', usage: 'Evaluating top event probabilities using minimal cut sets' },
      { name: 'K-out-of-N Redundancy', path: '/tools/k-out-of-n/', usage: 'Modeling voting architectures (2oo3, 1oo2)' }
    ]
  },
  {
    courseCode: 'ME-312',
    courseTitle: 'Machine Component Design',
    department: 'Mechanical Engineering',
    description: 'Teaches bearing life calculation, gear contact fatigue, lubricant degradation, and component replacement interval selection.',
    recommendedTools: [
      { name: 'L10 Bearing Life Calculator', path: '/tools/bearing-life/', usage: 'ISO 281 basic rating life calculations in hours & revolutions' },
      { name: 'Gearbox Reliability (AGMA)', path: '/tools/gearbox/', usage: 'AGMA contact stress and pitting fatigue analysis' },
      { name: 'Lubricant Life Optimizer', path: '/tools/lubricant-life/', usage: 'Estimating relubrication intervals based on temperature & speed' }
    ]
  }
];

const EMBED_SNIPPETS = [
  {
    id: 'weibull',
    name: 'Weibull Analysis Calculator',
    description: 'Embed the interactive 2-parameter Weibull probability plot and parameter calculator.',
    embedUrl: `${BASE_URL}/embed/weibull`
  },
  {
    id: 'mtbf',
    name: 'MTBF / MTTF Calculator',
    description: 'Embed the Mean Time Between Failures estimator with confidence bounds.',
    embedUrl: `${BASE_URL}/embed/mtbf`
  },
  {
    id: 'fmea',
    name: 'FMEA RPN Risk Calculator',
    description: 'Embed the interactive FMEA risk priority matrix worksheet.',
    embedUrl: `${BASE_URL}/embed/fmea`
  }
];

const ProfessorsToolkit: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGeneratingCheatSheet, setIsGeneratingCheatSheet] = useState(false);

  const canonicalUrl = `${BASE_URL}/professors/`;

  const handleCopyEmbed = (id: string, url: string) => {
    const snippet = `<iframe src="${url}" width="100%" height="650" frameborder="0" style="border: 1px solid #cbd5e1; border-radius: 16px; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" title="Reliability Tool Embed"></iframe>`;
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadCheatSheet = async () => {
    setIsGeneratingCheatSheet(true);
    try {
      await generateProfessionalPDF({
        toolName: 'Essential Reliability Engineering Formulas & Distributions Cheat Sheet',
        inputs: {
          'Weibull Reliability R(t)': 'exp(-(t/eta)^beta)',
          'Weibull Hazard h(t)': '(beta/eta) * (t/eta)^(beta-1)',
          'ISO 281 Bearing Life L10': '(C / P)^p (p=3 ball, 10/3 roller)',
          'System Availability A': 'MTBF / (MTBF + MTTR)',
          'FMEA Risk Priority (RPN)': 'Severity x Occurrence x Detection'
        },
        results: {
          'Target Audience': 'Engineering University Students & Educators',
          'License': 'Free Open Academic Reuse (CC BY 4.0)',
          'Published By': 'Reliability Tools (reliabilitytools.co.in)'
        }
      });
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('Could not generate PDF cheat sheet automatically. Printing browser summary.');
      window.print();
    } finally {
      setIsGeneratingCheatSheet(false);
    }
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalResource',
    name: "Professor's Toolkit: Free Reliability Engineering Teaching Resources",
    description: 'Free university syllabus integration guide, downloadable formula cheat sheets, and LMS Canvas/Blackboard embed snippets for reliability engineering professors and students.',
    url: canonicalUrl,
    educationalLevel: 'Higher Education / University',
    educationalUse: 'Classroom Instruction, Homework Assignments, Laboratory Labs'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-12">
      <SEO
        title="Free Reliability Engineering Teaching Resources | Reliability Tools"
        description="Free university syllabus integration guide, downloadable formula cheat sheets, and LMS Canvas/Blackboard embed snippets for engineering professors and students."
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-cyan-950 rounded-3xl p-8 md:p-14 text-white border border-cyan-500/30 shadow-2xl relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/20 border border-cyan-400/40 rounded-full text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-4">
          <GraduationCap className="w-4 h-4" /> Academic & Educator Resource Hub
        </div>

        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white mb-4">
          The Professor's Reliability Engineering Toolkit
        </h1>

        <p className="text-slate-300 text-base md:text-xl leading-relaxed font-medium">
          Empower your engineering students with free, high-precision industrial calculators, syllabus course mappings, formula cheat sheets, and direct Canvas/Blackboard LMS embeds.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleDownloadCheatSheet}
            disabled={isGeneratingCheatSheet}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-sm transition-all transform hover:-translate-y-0.5 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isGeneratingCheatSheet ? 'Generating PDF...' : 'Download Formula Cheat Sheet (PDF)'}
          </button>
          <a
            href="#lms-embeds"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold rounded-xl text-sm transition-all"
          >
            <Code className="w-4 h-4" /> LMS Embed Snippets
          </a>
        </div>
      </div>

      {/* Syllabus Integration Section */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Curriculum Mapping
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
            Syllabus Integration for University Courses
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Easily incorporate Reliability Tools into your homework assignments, lab exercises, and semester projects:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {COURSES.map((course) => (
            <div
              key={course.courseCode}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                      {course.department}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {course.courseCode}: {course.courseTitle}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {course.description}
                </p>

                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Recommended Course Calculators:
                  </span>
                  <ul className="space-y-2">
                    {course.recommendedTools.map((t, idx) => (
                      <li key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-100 dark:border-slate-800">
                        <div>
                          <Link to={t.path} className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                            {t.name} <ExternalLink className="w-3 h-3" />
                          </Link>
                          <span className="text-xs text-slate-500 dark:text-slate-400 block">{t.usage}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Downloadable Cheat Sheet Banner */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Academic Reference Guide
          </div>
          <h2 className="text-2xl md:text-4xl font-black">
            Reliability Engineering Formulas Cheat Sheet
          </h2>
          <p className="text-cyan-100 text-sm md:text-base leading-relaxed font-medium">
            Download a ready-to-print PDF containing complete mathematical formulas for Weibull distribution parameters, MTBF Chi-Square confidence bounds, ISO 281 bearing life equations, and availability models.
          </p>
        </div>

        <button
          onClick={handleDownloadCheatSheet}
          disabled={isGeneratingCheatSheet}
          className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-base rounded-2xl shadow-2xl transition-all transform hover:-translate-y-0.5 shrink-0 flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-5 h-5 text-cyan-400" />
          {isGeneratingCheatSheet ? 'Generating Cheat Sheet...' : 'Download Free PDF Cheat Sheet'}
        </button>
      </section>

      {/* LMS Embed Snippets Section */}
      <section id="lms-embeds" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1.5">
            <Code className="w-4 h-4" /> LMS Integration
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
            Embed Calculators in Canvas, Blackboard, or Moodle
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Copy the HTML snippet below and paste it directly into your course HTML editor so students can calculate results without leaving your learning portal:
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {EMBED_SNIPPETS.map((snippet) => (
            <div
              key={snippet.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {snippet.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {snippet.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-900 text-slate-200 p-3 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  <code>{`<iframe src="${snippet.embedUrl}" width="100%" height="650" frameborder="0"></iframe>`}</code>
                </div>

                <button
                  onClick={() => handleCopyEmbed(snippet.id, snippet.embedUrl)}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                >
                  {copiedId === snippet.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-cyan-500" />}
                  {copiedId === snippet.id ? 'Copied Embed Code!' : 'Copy LMS HTML Embed Snippet'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfessorsToolkit;
