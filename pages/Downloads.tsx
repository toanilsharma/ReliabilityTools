
import React from 'react';
import { FileSpreadsheet, Download, Shield, FileText, Activity, Layers, PenTool, Database, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

interface Template {
  id: string;
  title: string;
  standard?: string;
  description: string;
  icon: React.ReactNode;
  filename: string;
  headers: string[];
  exampleRow: string[];
}

const TEMPLATES: Template[] = [
  {
    id: 'fmea',
    title: 'Process FMEA (PFMEA)',
    standard: 'AIAG & VDA Compliant',
    description: 'Advanced Failure Modes & Effects Analysis template. Includes columns for Severity, Occurrence, Detection, RPN, and distinct Control Plans.',
    icon: <Shield className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />,
    filename: 'FMEA_ISO_Standard_Template.csv',
    headers: [
      'Process Step / Function',
      'Potential Failure Mode',
      'Potential Effect of Failure',
      'Severity (S) [1-10]',
      'Potential Cause of Failure',
      'Occurrence (O) [1-10]',
      'Current Process Controls (Prevention)',
      'Current Process Controls (Detection)',
      'Detection (D) [1-10]',
      'RPN (SxOxD)',
      'Recommended Action',
      'Responsibility',
      'Target Date'
    ],
    exampleRow: [
      'Cooling Water Circulation',
      'Centrifugal Pump Seizure',
      'System Overheat / Production Stop',
      '8',
      'Bearing lubrication starvation',
      '4',
      'Auto-greaser installed',
      'Vibration Analysis (Monthly)',
      '3',
      '96',
      'Install continuous online vibration monitoring',
      'Reliability Eng',
      '2024-12-31'
    ]
  },
  {
    id: 'fracas',
    title: 'FRACAS / MTBF Log',
    standard: 'ISO 14224 Taxonomy',
    description: 'Failure Reporting, Analysis, and Corrective Action System log. Standardized hierarchy (Asset > Maintainable Item > Failure Mode).',
    icon: <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    filename: 'FRACAS_ISO14224_Log.csv',
    headers: [
      'Event ID',
      'Asset Tag',
      'Asset Description',
      'Maintainable Item',
      'Failure Date/Time',
      'Restore Date/Time',
      'Downtime (Hrs)',
      'Failure Mode (Code)',
      'Failure Mechanism',
      'Impact Category (Safety/Env/Prod)',
      'Downtime Type (Planned/Unplanned)',
      'Work Order #'
    ],
    exampleRow: [
      'EVT-2024-089',
      'P-101-A',
      'Main Feedwater Pump',
      'Mechanical Seal',
      '2024-03-15 14:00',
      '2024-03-15 18:30',
      '4.5',
      'LEA (Leakage)',
      'Face wear due to abrasive fluid',
      'Production',
      'Unplanned',
      'WO-998877'
    ]
  },
  {
    id: 'rca',
    title: 'RCA (5 Whys + Evidence)',
    standard: 'IEC 62740',
    description: 'Professional Root Cause Analysis template including "Evidence" verification columns to prevent assumptions.',
    icon: <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
    filename: 'RCA_Professional_Template.csv',
    headers: [
      'Incident ID',
      'Problem Statement',
      'Why 1 (Direct Cause)',
      'Evidence W1',
      'Why 2',
      'Evidence W2',
      'Why 3',
      'Evidence W3',
      'Why 4 (Root Cause)',
      'Why 5 (Systemic Cause)',
      'Corrective Action',
      'Action Type (Interim/Permanent)',
      'Owner'
    ],
    exampleRow: [
      'INC-2024-001',
      'Conveyor motor tripped on overload',
      'High current draw',
      'Drive log data',
      'Gearbox jammed',
      'Visual inspection',
      'Bearing collapsed',
      'Metal fragments found',
      'Fatigue failure',
      'Lack of lubrication PM schedule',
      'Implement auto-lube and revise PM frequency',
      'Permanent',
      'Maintenance Mgr'
    ]
  },
  {
    id: 'criticality',
    title: 'Asset Criticality Matrix',
    description: 'Risk-based ranking tool to prioritize assets. Weights Safety, Environment, and Production risks separately.',
    icon: <Layers className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    filename: 'Asset_Criticality_Risk_Matrix.csv',
    headers: [
      'Asset Tag',
      'System',
      'Safety Risk (1-5)',
      'Env Risk (1-5)',
      'Production Risk (1-5)',
      'Quality Risk (1-5)',
      'MTBF (History)',
      'Total Criticality Score',
      'Classification (A/B/C)',
      'Strategy (PdM/PM/RTF)'
    ],
    exampleRow: [
      'CMP-200',
      'Plant Air System',
      '3',
      '1',
      '5',
      '2',
      '8760',
      '35',
      'A - Critical',
      'Predictive (Vibration + Ultrasound)'
    ]
  },
  {
    id: 'pm_plan',
    title: 'RCM Job Plan',
    standard: 'SAE JA1011',
    description: 'Preventive Maintenance Job Plan builder. Focuses on failure modes, craft skills, and estimated hours.',
    icon: <PenTool className="w-8 h-8 text-green-600 dark:text-green-400" />,
    filename: 'PM_Job_Plan_Template.csv',
    headers: [
      'Asset Class',
      'Task ID',
      'Task Description (Action Verb)',
      'Failure Mode Addressed',
      'Frequency (Days)',
      'Machine State (Running/Stopped)',
      'Craft (Mech/Elec)',
      'Est. Hours',
      'Parts Required',
      'Permit Required'
    ],
    exampleRow: [
      'Centrifugal Fan',
      'PM-FAN-01',
      'Inspect drive belts for tension and wear',
      'Belt slippage / breakage',
      '90',
      'Stopped',
      'Millwright',
      '0.5',
      'None',
      'Lockout/Tagout'
    ]
  },
  {
    id: 'spares',
    title: 'MRO Spares Optimization',
    description: 'Inventory management template with ABC classification, Reorder Points (ROP), and Economic Order Quantity (EOQ) fields.',
    icon: <FileSpreadsheet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
    filename: 'MRO_Spares_Optimization.csv',
    headers: [
      'Part Number',
      'Description',
      'Asset Link',
      'ABC Class',
      'Unit Cost ($)',
      'Lead Time (Days)',
      'Annual Usage',
      'Criticality (High/Low)',
      'Safety Stock',
      'Reorder Point (ROP)',
      'Min Order Qty'
    ],
    exampleRow: [
      'BRG-6309-C3',
      'Deep Groove Ball Bearing',
      'Motors > 50HP',
      'A',
      '45.00',
      '14',
      '12',
      'High',
      '4',
      '8',
      '5'
    ]
  }
];

const Downloads: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Reliability Engineering Templates & Downloads",
    "description": "Professional ISO/IEC/AIAG compliant CSV templates for FMEA, FRACAS, RCA, and RCM analysis.",
    "publisher": {
      "@type": "Organization",
      "name": "Reliability Tools"
    }
  };

  const handleDownload = (template: Template) => {
    const csvContent = [
      template.headers.join(','),
      template.exampleRow.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', template.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-12">
      <SEO schema={schema} />

      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Engineering Templates
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4 leading-relaxed">
            World-class templates compliant with <span className="font-bold text-slate-900 dark:text-white">ISO 14224</span>, <span className="font-bold text-slate-900 dark:text-white">AIAG FMEA</span>, and <span className="font-bold text-slate-900 dark:text-white">SAE JA1011</span> standards. 
            Clean data structures for professional reliability analysis.
            </p>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEMPLATES.map((template) => (
          <div 
            key={template.id} 
            className="group bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/20 transition-colors">
                {template.icon}
              </div>
              {template.standard && (
                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md border border-green-100 dark:border-green-900/50">
                    <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-[10px] font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">
                        {template.standard}
                    </span>
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {template.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-sm flex-grow">
              {template.description}
            </p>
            
            <button 
              onClick={() => handleDownload(template)}
              className="w-full py-3 px-4 bg-slate-900 dark:bg-white hover:bg-cyan-600 dark:hover:bg-cyan-400 text-white dark:text-slate-900 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg group-active:scale-95"
            >
              <Download className="w-5 h-5" /> Download .CSV
            </button>
          </div>
        ))}
      </div>

      {/* Standards Info Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">ISO 14224 Compliant</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                Our templates use standard equipment boundaries and failure mode taxonomies to ensure your data is compatible with international OREDA databases.
            </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Universal Compatibility</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                Files are generated in standard UTF-8 CSV format. They import directly into SAP, Maximo, Oracle eAM, and Microsoft Excel without formatting issues.
            </p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Audit Ready</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                Fields like "Responsibility", "Target Date", and "Evidence" are mandatory in our templates to ensure your maintenance records pass ISO 55000 audits.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
