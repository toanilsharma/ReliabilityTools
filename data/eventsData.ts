/**
 * Events and Jobs Digest Dataset for Industrial Reliability Engineering
 * Covers global industry conferences, symposiums, webinars, and curated monthly job postings.
 */

export interface ReliabilityEvent {
  id: string;
  name: string;
  startDate: string; // ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)
  endDate: string;
  eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode' | 'https://schema.org/OfflineEventAttendanceMode' | 'https://schema.org/MixedEventAttendanceMode';
  eventStatus: string;
  locationName: string;
  locationAddress: string;
  organizer: string;
  organizerUrl: string;
  description: string;
  topics: string[];
  registrationUrl: string;
  freeOffer: {
    name: string;
    price: string;
    priceCurrency: string;
    description: string;
  };
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  workType: 'On-site' | 'Hybrid' | 'Remote';
  industry: string;
  salaryRange: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  applyUrl: string;
}

export interface MonthlyJobDigest {
  monthKey: string; // Format: 'YYYY-MM'
  monthLabel: string; // e.g. "September 2026"
  isCurrentMonth: boolean;
  editorialSummary: string;
  jobs: JobPosting[];
}

export const RELIABILITY_EVENTS: ReliabilityEvent[] = [
  {
    id: 'smrp-annual-2026',
    name: 'SMRP 34th Annual Conference & Asset Optimization Expo',
    startDate: '2026-10-19T08:00:00-05:00',
    endDate: '2026-10-22T17:00:00-05:00',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    locationName: 'Indiana Convention Center / Virtual Live Stream',
    locationAddress: '100 S Capitol Ave, Indianapolis, IN 46254, USA',
    organizer: 'Society for Maintenance & Reliability Professionals (SMRP)',
    organizerUrl: 'https://smrp.org',
    description: 'Premier global gathering of 1,200+ maintenance and reliability practitioners covering ISO 55000 asset management, predictive AI sensing, and CMRP/CMRT workshops.',
    topics: ['Condition Monitoring', 'RCM', 'Asset Management', 'Weibull Analysis', 'Predictive Maintenance'],
    registrationUrl: 'https://smrp.org/Conference',
    freeOffer: {
      name: 'Free Virtual Keynote & Exhibition Hall Pass',
      price: '0',
      priceCurrency: 'USD',
      description: 'Complimentary digital access pass for certified maintenance practitioners and engineering students.'
    }
  },
  {
    id: 'rams-symposium-2027',
    name: 'RAMS 2027 – Annual Reliability and Maintainability Symposium',
    startDate: '2027-01-25T08:30:00-05:00',
    endDate: '2027-01-28T18:00:00-05:00',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    locationName: 'Renaissance Orlando at SeaWorld',
    locationAddress: '6677 Sea Harbor Dr, Orlando, FL 32821, USA',
    organizer: 'IEEE Reliability Society & ASQ Reliability Division',
    organizerUrl: 'https://rams.org',
    description: 'The world\'s leading symposium on probabilistic risk assessment, systems safety, hardware reliability modeling, and Bayesian life testing.',
    topics: ['Fault Tree Analysis', 'Markov Modeling', 'Bayesian Reliability', 'Aerospace Systems', 'Defense Standards'],
    registrationUrl: 'https://rams.org/registration',
    freeOffer: {
      name: 'Free Student Research Session Access Pass',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free admission to technical paper presentations and tutorials for accredited engineering university students.'
    }
  },
  {
    id: 'predictive-summit-2026',
    name: 'Global Predictive Maintenance & Digital Twin Virtual Summit',
    startDate: '2026-11-12T09:00:00Z',
    endDate: '2026-11-13T17:30:00Z',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    locationName: 'Online Live Broadcast (Global Streaming)',
    locationAddress: 'Virtual Event, Online Webinar Platform',
    organizer: 'International Predictive Maintenance Consortium',
    organizerUrl: 'https://reliabilitytools.co.in/events/',
    description: 'Two days of intensive technical case studies on real-time vibration spectral analysis, motor current signature analysis (MCSA), and acoustic ultrasound.',
    topics: ['Vibration Analysis', 'Digital Twins', 'Ultrasonic Inspection', 'Oil Tribology', 'Edge AI Sensors'],
    registrationUrl: 'https://reliabilitytools.co.in/events/',
    freeOffer: {
      name: 'Free Open-Access Live Webinar Stream',
      price: '0',
      priceCurrency: 'USD',
      description: '100% free live attendance with interactive Q&A and technical certificate of attendance.'
    }
  },
  {
    id: 'euromaintenance-2027',
    name: 'EuroMaintenance 2027 International Congress',
    startDate: '2027-03-15T09:00:00+01:00',
    endDate: '2027-03-18T18:00:00+01:00',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    locationName: 'Rotterdam Ahoy Convention Centre',
    locationAddress: 'Ahoyweg 10, 3084 HN Rotterdam, Netherlands',
    organizer: 'European Federation of National Maintenance Societies (EFNMS)',
    organizerUrl: 'https://efnms.eu',
    description: 'Europe\'s largest industrial maintenance conference showcasing sustainable asset management, circular economy maintenance, and smart robotics in manufacturing.',
    topics: ['Smart Factory 4.0', 'Autonomous Robotics', 'Lubrication Management', 'Asset Health Analytics'],
    registrationUrl: 'https://efnms.eu/euromaintenance',
    freeOffer: {
      name: 'Free Exhibition & Technology Showcase Pass',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Free entry badge to industrial technology exhibition floors and live demonstration theaters.'
    }
  },
  {
    id: 'iso-14224-workshop-2026',
    name: 'ISO 14224 & Asset Reliability Taxonomy Implementation Masterclass',
    startDate: '2026-10-08T13:00:00Z',
    endDate: '2026-10-08T17:00:00Z',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    locationName: 'Interactive Virtual Workshop (Zoom HD)',
    locationAddress: 'Online Interactive Workshop',
    organizer: 'Reliability Tools Academy',
    organizerUrl: 'https://reliabilitytools.co.in',
    description: 'Hands-on practical training on structuring CMMS failure catalogues, coding equipment taxonomy, and calculating MTBF/MTTR per ISO 14224 standards.',
    topics: ['ISO 14224', 'CMMS Taxonomy', 'Failure Modes', 'Root Cause Data', 'Reliability Allocation'],
    registrationUrl: 'https://reliabilitytools.co.in/events/',
    freeOffer: {
      name: 'Free Live Interactive Workshop Registration',
      price: '0',
      priceCurrency: 'USD',
      description: 'Zero-cost access including sample ISO 14224 equipment taxonomy spreadsheets and failure coding templates.'
    }
  }
];

export const MONTHLY_JOB_DIGESTS: MonthlyJobDigest[] = [
  {
    monthKey: '2026-09',
    monthLabel: 'September 2026 (Current)',
    isCurrentMonth: true,
    editorialSummary: 'Global demand for reliability engineers remains at an all-time peak, driven by energy transition facilities, high-uptime semiconductor fabs, and advanced automation manufacturing plants.',
    jobs: [
      {
        id: 'job-2026-09-01',
        title: 'Senior Reliability & Asset Integrity Engineer',
        company: 'ExxonMobil Global Projects',
        location: 'Baytown, Texas, USA',
        workType: 'Hybrid',
        industry: 'Energy & Refining',
        salaryRange: '$145,000 – $180,000 / year + bonus',
        postedDate: '2026-09-18',
        description: 'Lead mechanical integrity, Weibull life data analysis, and API 570 / 510 risk-based inspection (RBI) programs across high-capacity ethylene cracker units.',
        responsibilities: [
          'Develop quantitative Weibull life distributions and bad-actor elimination strategies.',
          'Lead RCM facilitation teams on rotating machinery and critical reciprocating compressors.',
          'Optimize spare parts inventories using Poisson stockout probability models.'
        ],
        qualifications: [
          'B.S. in Mechanical or Chemical Engineering.',
          '7+ years experience in refinery or petrochemical asset reliability.',
          'CRE (ASQ Certified Reliability Engineer) or CMRP certification preferred.'
        ],
        applyUrl: 'https://careers.exxonmobil.com'
      },
      {
        id: 'job-2026-09-02',
        title: 'Lead Maintenance Reliability Engineer (Cleanroom Systems)',
        company: 'TSMC North America',
        location: 'Phoenix, Arizona, USA',
        workType: 'On-site',
        industry: 'Semiconductor Manufacturing',
        salaryRange: '$135,000 – $165,000 / year',
        postedDate: '2026-09-22',
        description: 'Ensure 99.999% availability of ultra-pure water (UPW), toxic gas scrubbing, and cleanroom HVAC equipment supporting 2nm wafer fabrication lines.',
        responsibilities: [
          'Deploy continuous vibration and ultrasonic IoT sensors on mission-critical chillers.',
          'Facilitate Fault Tree Analysis (FTA) and 8D investigations for unexpected equipment excursions.',
          'Implement condition-based maintenance (CBM) replacing calendar-based PMs.'
        ],
        qualifications: [
          'B.S. in Electrical, Mechanical, or Industrial Engineering.',
          '5+ years high-reliability industrial manufacturing experience (semiconductor or pharma).'
        ],
        applyUrl: 'https://tsmc.taleo.net'
      },
      {
        id: 'job-2026-09-03',
        title: 'Asset Health & Predictive Maintenance Specialist',
        company: 'Siemens Energy',
        location: 'Manchester, UK / Remote Option',
        workType: 'Hybrid',
        industry: 'Renewables & Power Generation',
        salaryRange: '£65,000 – £82,000 / year',
        postedDate: '2026-09-15',
        description: 'Monitor fleet telematics and acoustic emission data for over 450 offshore wind turbines across the North Sea to predict bearing and gearbox failures months prior to functional breakdown.',
        responsibilities: [
          'Analyze high-frequency vibration spectra, envelope demodulation, and oil debris counts.',
          'Calibrate P-F curve inspection intervals to optimize vessel mobilization logistics.',
          'Present monthly fleet availability and EFOR metrics to key utility stakeholders.'
        ],
        qualifications: [
          'ISO 18436 Vibration Analyst Category III or equivalent.',
          'Demonstrated expertise in wind turbine planetary gearbox diagnostics.'
        ],
        applyUrl: 'https://siemens-energy.com/careers'
      }
    ]
  },
  {
    monthKey: '2026-08',
    monthLabel: 'August 2026 (Archive)',
    isCurrentMonth: false,
    editorialSummary: 'August highlighted expansions in pharmaceutical aseptic manufacturing and automotive gigafactories requiring RAMS validation engineers.',
    jobs: [
      {
        id: 'job-2026-08-01',
        title: 'Plant Reliability Manager',
        company: 'Pfizer Global Supply',
        location: 'Kalamazoo, Michigan, USA',
        workType: 'On-site',
        industry: 'Pharmaceuticals',
        salaryRange: '$150,000 – $190,000 / year',
        postedDate: '2026-08-14',
        description: 'Direct total productive maintenance (TPM) and cGMP validation protocols across sterile injectable filling and lyophilization facilities.',
        responsibilities: [
          'Maintain compliance with FDA 21 CFR Part 11 and cGMP maintenance requirements.',
          'Lead site reliability culture transformation from reactive firefighting to precision maintenance.'
        ],
        qualifications: [
          '10+ years engineering experience with minimum 4 years in pharmaceutical operations.'
        ],
        applyUrl: 'https://pfizer.com/careers'
      },
      {
        id: 'job-2026-08-02',
        title: 'Battery Cell Automation Reliability Specialist',
        company: 'Tesla Gigafactory',
        location: 'Austin, Texas, USA',
        workType: 'On-site',
        industry: 'Automotive & Energy Storage',
        salaryRange: '$130,000 – $160,000 / year',
        postedDate: '2026-08-20',
        description: 'Optimize uptime and MTBF for multi-axis servo robotics and continuous winding machinery in high-speed lithium-ion battery lines.',
        responsibilities: [
          'Identify failure modes on high-speed continuous web handling and laser welding cells.',
          'Execute Root Cause Analysis (RCA) and design out failure mechanisms.'
        ],
        qualifications: [
          'B.S. in Mechatronics, Mechanical, or Robotics Engineering.'
        ],
        applyUrl: 'https://tesla.com/careers'
      }
    ]
  },
  {
    monthKey: '2026-07',
    monthLabel: 'July 2026 (Archive)',
    isCurrentMonth: false,
    editorialSummary: 'July digest archives covering steel manufacturing and rail transit maintenance leadership openings.',
    jobs: [
      {
        id: 'job-2026-07-01',
        title: 'Heavy Rolling Mill Reliability Engineer',
        company: 'Nucor Steel',
        location: 'Decatur, Alabama, USA',
        workType: 'On-site',
        industry: 'Steel & Metallurgy',
        salaryRange: '$110,000 – $140,000 / year',
        postedDate: '2026-07-11',
        description: 'Drive reliability programs on hot strip mill gear drives, runout tables, and hydraulic AGC systems.',
        responsibilities: [
          'Perform oil analysis and grease tribology testing to eliminate bearing seizures.'
        ],
        qualifications: [
          'B.S. in Mechanical Engineering with 3+ years heavy industrial plant experience.'
        ],
        applyUrl: 'https://nucor.com/careers'
      }
    ]
  }
];

export function getCurrentMonthDigest(): MonthlyJobDigest {
  return MONTHLY_JOB_DIGESTS.find(d => d.isCurrentMonth) || MONTHLY_JOB_DIGESTS[0];
}

export function getDigestByMonth(monthKey: string): MonthlyJobDigest | undefined {
  return MONTHLY_JOB_DIGESTS.find(d => d.monthKey === monthKey);
}
