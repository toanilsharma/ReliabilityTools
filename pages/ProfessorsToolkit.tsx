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
  ExternalLink,
  FlaskConical,
  Award
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

interface LabAssignment {
  id: string;
  courseCode: string;
  title: string;
  objective: string;
  toolPath: string;
  toolName: string;
  problemStatement: string;
  givenData: string;
  questions: string[];
}

const LAB_ASSIGNMENTS: LabAssignment[] = [
  {
    id: 'lab-weibull',
    courseCode: 'ME-402',
    title: 'Wind Turbine Main Bearing Fatigue Analysis',
    objective: 'Estimate Weibull parameters (η, β) and determine B10 life from accelerated life test data.',
    toolPath: '/tools/weibull/',
    toolName: 'Weibull Analysis Calculator',
    problemStatement: 'Ten high-capacity spherical roller bearings were run on an accelerated endurance test rig until spalling failure was detected via vibration monitoring.',
    givenData: 'Failure times in hours: 1240, 1850, 2190, 2750, 3120, 3680, 4210, 4950, 5600, 6800',
    questions: [
      'Fit a 2-parameter Weibull model using Median Rank Regression. What are the characteristic life (η) and slope (β)?',
      'Based on the slope β, is the failure mechanism infant mortality, random stress, or mechanical wear-out fatigue?',
      'Calculate the B10 life (time at which 10% of bearings are expected to fail) for warranty declaration.',
      'Estimate the cumulative reliability R(t) at 2,000 operating hours.'
    ]
  },
  {
    id: 'lab-sil',
    courseCode: 'EM-501',
    title: 'Process Separator High-Pressure Trip Loop SIL Verification',
    objective: 'Evaluate Safety Instrumented Function (SIF) PFDavg under 1oo1 and 2oo3 voting architectures per IEC 61508 / 61511.',
    toolPath: '/tools/sil/',
    toolName: 'SIL Verification Calculator',
    problemStatement: 'A high-pressure flare separator requires a dedicated Safety Instrumented System to prevent overpressure vessel rupture in a petrochemical unit.',
    givenData: 'Sensor λDU = 1.2×10⁻⁶/hr, Logic Solver λDU = 0.1×10⁻⁶/hr, Final Element λDU = 2.4×10⁻⁶/hr. Proof Test Interval TI = 8,760 hours (1 year), Mean Time to Restoration MTTR = 8 hours.',
    questions: [
      'Calculate the subsystem PFDavg and total loop PFDavg for a simplex 1oo1 architecture.',
      'What Safety Integrity Level (SIL 1, SIL 2, SIL 3) does the simplex loop achieve?',
      'Re-evaluate the sensor subsystem using a 2oo3 voting architecture with a 5% Common Cause Factor (β = 0.05). Does it upgrade the SIL rating?',
      'What happens to PFDavg if the proof test interval is shortened to 6 months (4,380 hours)?'
    ]
  },
  {
    id: 'lab-api570',
    courseCode: 'ME-312',
    title: 'Hydrocarbon Piping Ultrasonic Thickness & Remaining Life Survey',
    objective: 'Calculate short-term/long-term corrosion rates, minimum structural thickness per ASME B31.3, and API 570 inspection intervals.',
    toolPath: '/tools/api570/',
    toolName: 'API 570 Piping Inspection Calculator',
    problemStatement: 'An 8-inch Schedule 40 ASTM A106 Grade B hydrocarbon transfer line operating at 320 psig and 350°F is inspected via ultrasonic thickness gauging at a designated CML (Condition Monitoring Location).',
    givenData: 'Nominal wall = 0.322 in, Initial baseline (10 yrs ago) = 0.320 in, Previous inspection (5 yrs ago) = 0.285 in, Current actual thickness = 0.250 in, Allowable stress S = 20,000 psi, Joint efficiency E = 1.0, Piping OD = 8.625 in.',
    questions: [
      'Calculate the Long-Term (LT) and Short-Term (ST) corrosion rates in mils per year (mpy). Why might they differ?',
      'Calculate the ASME B31.3 minimum pressure design thickness t_min and add structural minimum thickness.',
      'Determine the remaining life (RL) of the piping circuit in years.',
      'Determine the maximum allowable inspection interval per API 570 Section 6 (half-life rule vs. maximum cap).'
    ]
  }
];

const ProfessorsToolkit: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLabId, setCopiedLabId] = useState<string | null>(null);
  const [isGeneratingCheatSheet, setIsGeneratingCheatSheet] = useState(false);

  const canonicalUrl = `${BASE_URL}/professors/`;

  const handleCopyEmbed = (id: string, url: string) => {
    const snippet = `<iframe src="${url}" width="100%" height="650" frameborder="0" style="border: 1px solid #cbd5e1; border-radius: 16px; shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" title="Reliability Tool Embed"></iframe>`;
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyLabAssignment = (lab: LabAssignment) => {
    const text = `Assignment: ${lab.title} (${lab.courseCode})
Objective: ${lab.objective}
Interactive Tool: ${BASE_URL}${lab.toolPath}

Problem Statement:
${lab.problemStatement}

Given Data:
${lab.givenData}

Student Tasks:
${lab.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Verify your calculations at: ${BASE_URL}${lab.toolPath}`;

    navigator.clipboard.writeText(text);
    setCopiedLabId(lab.id);
    setTimeout(() => setCopiedLabId(null), 2000);
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

      {/* Ready-to-Assign Problem Sets Section */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center justify-center gap-1.5">
            <FlaskConical className="w-4 h-4" /> Ready-to-Assign Labs
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white">
            University Problem Sets & Laboratory Assignments
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Complete, syllabus-ready industrial case studies with real operational datasets. Copy directly to Canvas, Blackboard, or homework handouts:
          </p>
        </div>

        <div className="space-y-6">
          {LAB_ASSIGNMENTS.map((lab) => (
            <div
              key={lab.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm hover:border-cyan-500/40 transition-all space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60 uppercase">
                      {lab.courseCode} Lab Assignment
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Standard Industrial Case Study
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {lab.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <strong>Objective:</strong> {lab.objective}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyLabAssignment(lab)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-200 dark:border-slate-700"
                    title="Copy formatted assignment text to clipboard"
                  >
                    {copiedLabId === lab.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-cyan-500" />}
                    <span>{copiedLabId === lab.id ? 'Copied Prompt!' : 'Copy Assignment Prompt'}</span>
                  </button>
                  <Link
                    to={lab.toolPath}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-cyan-500/20"
                  >
                    <span>Open Calculator</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-850/60 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Industrial Scenario:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {lab.problemStatement}
                  </p>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    Given Operational Data:
                  </span>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-words select-all">
                    {lab.givenData}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  Student Assignment Questions:
                </span>
                <ol className="grid sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside">
                  {lab.questions.map((q, qIdx) => (
                    <li key={qIdx} className="bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{q}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Workshop & Guest Lecture Banner */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-8 md:p-10 text-white border border-indigo-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" /> University Partnerships
          </div>
          <h3 className="text-2xl font-black">
            Invite Reliability Tools for an Engineering Guest Lecture
          </h3>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            We provide interactive virtual seminars and customized case-study data files for university courses and ASME, IEEE, SRE, and IISE student chapters worldwide at zero cost.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 shrink-0"
        >
          Request Class Workshop / Seminar
        </Link>
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
