/**
 * Programmatic SEO Data for Industry-Specific Landing Pages
 */

export interface IndustryPainPoint {
  title: string;
  description: string;
}

export interface IndustryData {
  slug: string;
  name: string;
  tagline: string;
  hero_description: string;
  pain_points: IndustryPainPoint[];
  recommended_tool_slugs: string[];
}

export const INDUSTRIES: IndustryData[] = [
  {
    slug: 'cement',
    name: 'Cement & Building Materials',
    tagline: 'Defeat clinker dust, kiln thermal shock, and heavy crusher shock loads.',
    hero_description: 'Optimize maintenance reliability in harsh cement manufacturing environments. Mitigate high dust abrasion, kiln thermal stress, and heavy conveyor equipment downtime using validated engineering calculators.',
    pain_points: [
      {
        title: 'Abrasive Dust & Bearing Starvation',
        description: 'Clinker and raw mill particulates ingress into bearing housings, causing accelerated raceway spalling and premature bearing fatigue.'
      },
      {
        title: 'Unplanned Kiln Outages',
        description: 'Kiln drive shutdowns cause severe thermal distortion of shell plates and cost over $50,000 per hour in unabsorbed facility overhead.'
      },
      {
        title: 'Ball Mill & Crusher Shock Loading',
        description: 'Heavy shock loads on drive gearboxes require strict AGMA safety factor verification and continuous oil contamination monitoring.'
      }
    ],
    recommended_tool_slugs: ['bearing-life', 'downtime-cost', 'lubricant-life', 'gearbox', 'weibull', 'mtbf']
  },
  {
    slug: 'steel',
    name: 'Steel & Primary Metals',
    tagline: 'Maximize uptime across blast furnaces, continuous casters, and hot rolling mills.',
    hero_description: 'Enhance asset availability across melt shops, continuous casting lines, and heavy rolling mills operating under severe temperature and mechanical impact loads.',
    pain_points: [
      {
        title: 'Thermal Stress & Caster Bearing Failure',
        description: 'Continuous casting roll necks endure extreme radiant heat and cooling water ingress, requiring precise L10 rating life calculation.'
      },
      {
        title: 'Hot Strip Mill Bottlenecks',
        description: 'Breakdowns on main mill stands instantly halt upstream reheat furnaces and waste preheated steel billets.'
      },
      {
        title: 'Hydraulic System Valve Sticking',
        description: 'Particulate contamination in high-pressure hydraulic roll-gap systems causes servo valve binding and strip gauge defects.'
      }
    ],
    recommended_tool_slugs: ['bearing-life', 'downtime-cost', 'availability', 'oee', 'weibull', 'lubricant-life']
  },
  {
    slug: 'automotive',
    name: 'Automotive & OEM Manufacturing',
    tagline: 'Eliminate stamping & body shop downtime and achieve IATF 16949 compliance.',
    hero_description: 'Achieve world-class OEE benchmarks, reduce MTTR across robotic welding cells, and streamline IATF 16949 FMEA risk prioritization for automotive OEMs and Tier-1 suppliers.',
    pain_points: [
      {
        title: 'Robotic Line Stoppage Bottlenecks',
        description: 'Automated welding and body assembly lines lose thousands of dollars for every minute of unexpected robot servo or cable harness failure.'
      },
      {
        title: 'Quality Defects & Die Wear Scrap',
        description: 'Stamping die wear and robot repeatability degradation lead to out-of-spec panels, high scrap rates, and costly offline rework.'
      },
      {
        title: 'IATF 16949 FMEA Compliance',
        description: 'Automotive OEMs require documented DFMEA and PFMEA worksheets with Action Priority (AP) tracking for all safety-critical components.'
      }
    ],
    recommended_tool_slugs: ['fmea', 'oee', 'downtime-cost', 'mttr', 'optimal-replacement', 'spares']
  },
  {
    slug: 'pharmaceuticals',
    name: 'Pharmaceuticals & Life Sciences',
    tagline: 'Protect cleanroom sterile environments, batch yield, and 21 CFR compliance.',
    hero_description: 'Ensure 21 CFR Part 11 and cGMP regulatory compliance, maintain sterile filling line uptime, and calculate Safety Instrumented Function (SIF) PFDavg for chemical synthesis.',
    pain_points: [
      {
        title: 'Sterile Batch Loss & Environmental Trips',
        description: 'Cleanroom HVAC or sterile filler downtime causes full batch rejection, regulatory deviation reporting, and massive revenue loss.'
      },
      {
        title: 'Lyophilizer & Autoclave Outages',
        description: 'Refrigeration compressor or vacuum pump failures ruin sensitive biopharmaceutical freeze-drying cycles mid-process.'
      },
      {
        title: 'Mandatory Regulatory PM Schedules',
        description: 'US FDA and EU GMP standards require strict, checklist-driven preventive maintenance and calibration for all critical equipment.'
      }
    ],
    recommended_tool_slugs: ['sil', 'availability', 'pm', 'downtime-cost', 'confidence-interval', 'fmea']
  },
  {
    slug: 'fmcg',
    name: 'FMCG & Consumer Goods',
    tagline: 'Maximize high-speed packaging OEE and optimize MRO spare part inventory.',
    hero_description: 'Boost Overall Equipment Effectiveness on high-speed packaging lines, eliminate micro-stoppages, and optimize MRO spare parts inventory for 24/7 consumer goods production.',
    pain_points: [
      {
        title: 'High-Speed Packaging Micro-Stoppages',
        description: 'Frequent minor jams (< 5 mins) on pouch fillers, labellers, and cartoners heavily erode line Performance scores.'
      },
      {
        title: 'Changeover & Setup Downtime',
        description: 'Frequent SKU changeovers introduce setup downtime and startup reject scrap if tooling alignment is uncalibrated.'
      },
      {
        title: 'MRO Spare Part Stockouts',
        description: 'Lacking critical photo-eyes, suction cups, or heating elements delays changeovers and halts production lines.'
      }
    ],
    recommended_tool_slugs: ['oee', 'eoq', 'spares', 'downtime-cost', 'mttr', 'optimal-replacement']
  },
  {
    slug: 'power-generation',
    name: 'Power Generation & Utilities',
    tagline: 'Ensure base-load grid availability and IEC 61511 safety system compliance.',
    hero_description: 'Ensure maximum base-load grid availability, turbine-generator reliability, and Safety Instrumented System (SIS) compliance per IEC 61508 / 61511 for power utilities.',
    pain_points: [
      {
        title: 'Turbine & Generator Forced Trips',
        description: 'Forced outages on steam or gas turbines incur severe utility grid penalty fees and expensive emergency startup fuel consumption.'
      },
      {
        title: 'Safety System False Trips (PFDavg)',
        description: 'Unreliable safety instrumented functions cause nuisance trips or dangerous fail-to-trip conditions on boiler fuel supply systems.'
      },
      {
        title: 'Long Lead-Time Critical Spares',
        description: 'Long lead-time turbine journal bearings and boiler feed pump seals require precise ROP and safety stock optimization.'
      }
    ],
    recommended_tool_slugs: ['sil', 'availability', 'bearing-life', 'k-out-of-n', 'downtime-cost', 'hazard-rate']
  }
];

export function getIndustryBySlug(slug: string): IndustryData | undefined {
  const normalized = slug.toLowerCase().trim();
  return INDUSTRIES.find(i => i.slug === normalized);
}
