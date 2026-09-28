/**
 * Failure Museum Dataset – Forensic Industrial Reliability Case Studies
 * Pre-seeds 14 real-world engineering failure analyses across mechanical, chemical, 
 * nuclear, aerospace, and software disciplines.
 */

export interface FailureCase {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  incidentDate: string; // ISO date format YYYY-MM-DD
  location: string;
  industry: string;
  fatalities: number;
  costEstimate: string;
  primaryFailureMode: string;
  standardsViolated: string[];
  rootCauseAnalysis: string; // Rich text / HTML
  engineeringLessons: string[];
  author: {
    name: string;
    role: string;
    affiliation: string;
  };
  datePublished: string;
  imageUrl: string;
  status: 'approved' | 'draft';
  tags: string[];
  externalReferences?: { title: string; url: string }[];
  ugcContentHtml?: string;
  isCommunitySubmission?: boolean;
}

export const SEEDED_FAILURE_CASES: FailureCase[] = [
  {
    id: 'challenger-1986',
    slug: 'space-shuttle-challenger-o-ring',
    title: 'Space Shuttle Challenger STS-51-L Breakup',
    subtitle: 'Cold-temperature resiliency loss and gas blow-by of solid rocket booster primary and secondary FKM O-rings.',
    incidentDate: '1986-01-28',
    location: 'Cape Canaveral, Florida, USA',
    industry: 'Aerospace & Defense',
    fatalities: 7,
    costEstimate: '$3.2 Billion',
    primaryFailureMode: 'Elastomer Glass Transition / O-Ring Blow-By',
    standardsViolated: ['NASA SP-8000 Series', 'MIL-STD-882 System Safety', 'AIAA S-102 Redundancy Verification'],
    rootCauseAnalysis: `
      <p>At an ambient launch pad temperature of 36°F (2.2°C), the fluoroelastomer O-rings in the aft field joint of the right Solid Rocket Booster (SRB) operated far below their tested resilience envelope. As combustion pressure surged during ignition, the steel rocket casing expanded outward. The cold O-rings failed to expand rapidly enough to bridge the extruded gap.</p>
      <p>Hot combustion gas (over 5,000°F) breached both the primary and secondary O-rings within 0.678 seconds of launch. The resulting flame plume impinged directly on the liquid hydrogen / liquid oxygen external fuel tank strut, causing structural detachment and aerodynamic disintegration at Mach 1.92.</p>
    `,
    engineeringLessons: [
      'Redundancy is completely invalidated when a common-cause environmental stressor (extreme cold) degrades all redundant barriers simultaneously.',
      'Normalization of deviance: past partial O-ring erosion on warmer flights was mistakenly treated as acceptable margin rather than an imminent failure signature.',
      'Data visualization ethics: quantitative engineers possessed evidence of temperature sensitivity but failed to present clear bivariate correlation plots during pre-flight launch decision calls.'
    ],
    author: {
      name: 'Dr. Evelyn Vance, PE',
      role: 'Forensic Reliability Lead',
      affiliation: 'Aerospace Safety Advisory Council'
    },
    datePublished: '2026-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1517976487502-5f71318e5074?w=1200&q=80',
    status: 'approved',
    tags: ['O-Ring', 'Common-Cause Failure', 'Aerospace', 'Elastomers', 'NASA']
  },
  {
    id: 'chernobyl-1986',
    slug: 'chernobyl-reactor-4-runaway',
    title: 'Chernobyl Nuclear Power Plant Unit 4 Disaster',
    subtitle: 'RBMK-1000 reactor thermal-hydraulic instability, positive void coefficient, and graphite-tipped control rod design defect.',
    incidentDate: '1986-04-26',
    location: 'Pripyat, Ukrainian SSR',
    industry: 'Nuclear Power Generation',
    fatalities: 31,
    costEstimate: '$235 Billion',
    primaryFailureMode: 'Prompt Criticality & Steam Explosion (Positive Void Coefficient)',
    standardsViolated: ['IAEA Safety Series 75-INSAG-7', 'IEC 60880 Nuclear I&C Software', 'GOST Nuclear Power Safety Regulations'],
    rootCauseAnalysis: `
      <p>During a low-power electrical rundown turbine test, operators disabled automatic reactor safety shutdown interlocks and emergency core cooling systems. Xenon-135 poisoning severely suppressed reactivity, prompting operators to manually withdraw virtually all control rods beyond permissible operational limits.</p>
      <p>When the AZ-5 emergency scram button was depressed, the graphite displacer tips of the entering boron carbide control rods displaced water at the bottom of the core first. Because water acts as a neutron absorber in the RBMK graphite-moderated lattice, this introduced positive reactivity, triggering prompt criticality, massive fuel vaporization, and two catastrophic steam explosions.</p>
    `,
    engineeringLessons: [
      'Inherent physics safety must always supersede procedural checklists: positive reactivity feedback under operational conditions is unacceptable.',
      'Control rod insertion mechanisms must never introduce initial positive reactivity during emergency scram maneuvers.',
      'Defense-in-depth safety interlocks must be engineered as non-bypassable hardware interlocks rather than administratively managed switches.'
    ],
    author: {
      name: 'Mikhail Romanov, Ph.D.',
      role: 'Nuclear Safety Systems Specialist',
      affiliation: 'Institute for Nuclear Asset Protection'
    },
    datePublished: '2026-01-20',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
    status: 'approved',
    tags: ['Nuclear', 'Positive Void Coefficient', 'Thermal Runaway', 'Safety Instrumented Systems', 'IAEA']
  },
  {
    id: 'deepwater-horizon-2010',
    slug: 'deepwater-horizon-macondo-blowout',
    title: 'Deepwater Horizon Macondo Well Blowout',
    subtitle: 'Subsea Blowout Preventer (BOP) blind shear ram buckling failure and primary cement barrier seal breakdown.',
    incidentDate: '2010-04-20',
    location: 'Gulf of Mexico (Mississippi Canyon Block 252)',
    industry: 'Oil & Gas Exploration',
    fatalities: 11,
    costEstimate: '$65 Billion',
    primaryFailureMode: 'Hydrocarbon Influx & Shear Ram Drill-Pipe Buckling',
    standardsViolated: ['API Standard 53 BOP Systems', 'API RP 65-2 Cementing Barriers', 'ISO 13628 Subsea Production Systems'],
    rootCauseAnalysis: `
      <p>A nitrogen-foamed cement slurry pumped to seal the bottom of the Macondo production casing failed to isolate high-pressure hydrocarbon reservoirs. Negative pressure tests were misinterpreted despite pressure anomalies on the kill line.</p>
      <p>Hydrocarbons rushed up the riser pipe onto the drill floor and ignited. Emergency activation of the blind shear rams failed because the upward velocity of the reservoir fluids buckled the off-center drill pipe inside the wellbore, moving it outside the cutting blade trajectory.</p>
    `,
    engineeringLessons: [
      'Diagnostic test ambiguity: negative pressure tests must require strict mathematical convergence to zero pressure differential before acceptance.',
      'Subsea BOP shear rams must be certified to shear off-center and buckled tool joints under maximum flowing dynamic kick pressures.',
      'Multi-barrier philosophy requires that no single human misinterpretation can defeat physical containment barriers.'
    ],
    author: {
      name: 'Marcus Sterling, CEng',
      role: 'Principal Subsea Reliability Engineer',
      affiliation: 'Offshore Energy Safety Board'
    },
    datePublished: '2026-01-28',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&q=80',
    status: 'approved',
    tags: ['Oil & Gas', 'BOP', 'Wellhead Barrier', 'API 53', 'Offshore Reliability']
  },
  {
    id: 'texas-city-2005',
    slug: 'texas-city-refinery-isom-explosion',
    title: 'BP Texas City Refinery ISOM Explosion',
    subtitle: 'Raffinate splitter tower overfill, level transmitter false readings, and atmospheric blowdown vent drum geyser ignition.',
    incidentDate: '2005-03-23',
    location: 'Texas City, Texas, USA',
    industry: 'Refining & Petrochemical',
    fatalities: 15,
    costEstimate: '$2.1 Billion',
    primaryFailureMode: 'Liquid Overfill & Vapor Cloud Ignition',
    standardsViolated: ['API 521 Pressure-Relieving Systems', 'OSHA 1910.119 Process Safety Management', 'IEC 61511 Safety Instrumented Systems'],
    rootCauseAnalysis: `
      <p>During the startup of the isomerization (ISOM) unit raffinate splitter tower, liquid hydrocarbons were pumped into the 170-foot column continuously for over three hours while the bottoms outlet valve remained closed. The displacer-type liquid level transmitter spanned only the bottom 9 feet and pegged at 100%, misleading operators into believing the level was rising slowly.</p>
      <p>Hydrocarbon liquid overflowed into the overhead line and filled the relief valves. The valves lifted, sending 52,000 gallons of flammable liquid into an outdated atmospheric blowdown drum and stack with no flare. A geyser of flammable liquid erupted, formed a vapor cloud, and ignited from a nearby running diesel pickup truck.</p>
    `,
    engineeringLessons: [
      'Atmospheric blowdown drums for heavy volatile hydrocarbons must be replaced by closed flare headers conforming to API 521.',
      'Level instrument design: high-level alarms must be physically and electrically independent from the primary process level control loop (IEC 61511 IPL allocation).',
      'Temporary trailers and offices must be sited strictly outside process unit blast zones per API RP 752.'
    ],
    author: {
      name: 'Sarah Jenkins, CSP',
      role: 'Process Safety Director',
      affiliation: 'Global Process Hazards Institute'
    },
    datePublished: '2026-02-04',
    imageUrl: 'https://images.unsplash.com/photo-1516937941344-0004e0337589?w=1200&q=80',
    status: 'approved',
    tags: ['Refining', 'Overfill', 'IEC 61511', 'Flare Stack', 'Process Safety']
  },
  {
    id: 'hyatt-regency-1981',
    slug: 'hyatt-regency-walkway-collapse',
    title: 'Hyatt Regency Kansas City Walkway Collapse',
    subtitle: 'Connection detail redesign doubling shear load on box-beam welded hanger-rod supports.',
    incidentDate: '1981-07-17',
    location: 'Kansas City, Missouri, USA',
    industry: 'Civil & Structural Engineering',
    fatalities: 114,
    costEstimate: '$140 Million',
    primaryFailureMode: 'Structural Shear Failure of Box Beam Connection',
    standardsViolated: ['AISC Steel Construction Manual', 'ANSI A58.1 Minimum Design Loads', 'ASCE Code of Ethics Fundamental Canon 1'],
    rootCauseAnalysis: `
      <p>The original structural design specified continuous hanger rods running from the ceiling trusses through the fourth-floor walkway down to the second-floor walkway. To eliminate the manufacturing difficulty of threading the entire length of the upper rods, the fabricator proposed a modified two-rod system.</p>
      <p>In the revised arrangement, the lower rods hung directly from the fourth-floor box beam rather than the ceiling truss. This doubled the shear stress transferred through the welded channel connections of the fourth-floor box beam. Under crowded spectator loading, the box beam connection punched through, dropping both skywalks into the atrium.</p>
    `,
    engineeringLessons: [
      'Shop drawing review discipline: minor field fabrication revisions can fundamentally alter the mechanical load path.',
      'Dual-responsibility failure: neither the fabricator nor the engineer-of-record performed basic static equilibrium calculations on the modified detail.',
      'Load-bearing connections must have verified structural factor of safety exceeding 2.0 under maximum dynamic live loading.'
    ],
    author: {
      name: 'Arthur Pendelton, PE, SE',
      role: 'Senior Forensic Structural Engineer',
      affiliation: 'Structural Integrity Review Board'
    },
    datePublished: '2026-02-10',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1200&q=80',
    status: 'approved',
    tags: ['Structural', 'Load Path', 'Box Beam', 'AISC', 'Engineering Ethics']
  },
  {
    id: 'bhopal-1984',
    slug: 'bhopal-gas-tragedy-mic-release',
    title: 'Union Carbide Bhopal Methyl Isocyanate Release',
    subtitle: 'Runaway exothermic trimerization reaction of MIC, offline refrigeration, and non-functional vent scrubbers.',
    incidentDate: '1984-12-03',
    location: 'Bhopal, Madhya Pradesh, India',
    industry: 'Chemical Manufacturing',
    fatalities: 3787,
    costEstimate: '$470 Million Settlement',
    primaryFailureMode: 'Runaway Chemical Reaction & Toxic Vapor Release',
    standardsViolated: ['CCPS Guidelines for Process Safety', 'OSHA 1910.119 PSM', 'ISO 45001 Occupational Safety'],
    rootCauseAnalysis: `
      <p>Water entered Methyl Isocyanate (MIC) storage Tank 610 during pipeline water washing operations without slip-blind isolation. The water triggered an exothermic hydrolytic reaction that accelerated into autocatalytic trimerization, with temperatures exceeding 200°C and pressures surpassing 40 psig.</p>
      <p>Critical mitigation systems failed: the 30-ton freon refrigeration system had been disconnected to save operational costs, the caustic soda vent scrubber was out of service, the flare tower was dismantled for pipe maintenance, and the water spray curtain lacked sufficient pressure to reach the discharge stack height.</p>
    `,
    engineeringLessons: [
      'Inherently safer design (ISD): toxic volatile intermediates must be consumed immediately in closed process loops rather than stored in massive bulk inventory tanks.',
      'Active safety systems (chillers, scrubbers, flares) must have mandatory interlocks that prevent plant operation whenever an active mitigation layer is disabled.',
      'Physical positive isolation (slip-blinds) must be strictly enforced whenever water washdown lines interface with water-reactive chemicals.'
    ],
    author: {
      name: 'Rajesh K. Sharma, FIChemE',
      role: 'Chemical Hazard Prevention Specialist',
      affiliation: 'Indian Society of Process Safety'
    },
    datePublished: '2026-02-18',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&q=80',
    status: 'approved',
    tags: ['Chemical', 'MIC', 'Inherently Safer Design', 'Process Safety', 'CCPS']
  },
  {
    id: 'aloha-1988',
    slug: 'aloha-airlines-flight-243-decompression',
    title: 'Aloha Airlines Flight 243 Explosive Decompression',
    subtitle: 'Multi-site fatigue cracking, epoxy disbonding, and crevice corrosion along Boeing 737 fuselage cold-bonded lap joints.',
    incidentDate: '1988-04-28',
    location: 'Maui, Hawaii, USA',
    industry: 'Commercial Aviation',
    fatalities: 1,
    costEstimate: '$68 Million',
    primaryFailureMode: 'Multi-Site Fatigue Damage (MSD) & Widespread Fatigue Damage (WFD)',
    standardsViolated: ['FAA FAR Part 25 Airworthiness', 'MIL-HDBK-1530 Aircraft Structural Integrity', 'ASTM E647 Fatigue Crack Growth'],
    rootCauseAnalysis: `
      <p>Flight 243 operated in an aggressive marine coastal environment with extreme cyclic duty (over 89,000 flight cycles, exceeding its 75,000-cycle design objective). Cold-bonding epoxy adhesive along fuselage stringer S-10L experienced moisture ingress and disbonded.</p>
      <p>The entire cabin pressurization load transferred directly to the skin rivets, initiating microscopic fatigue cracks at adjacent countersunk rivet holes. When cracks linked up across adjacent bays (Multi-Site Damage), the skin lost its tear-strap fail-safe flapping capability, tearing away an 18-foot section of the upper cabin crown.</p>
    `,
    engineeringLessons: [
      'Airframe structural damage tolerance must account for Widespread Fatigue Damage (WFD) where multiple collinear micro-cracks bypass traditional crack arrest features.',
      'High-cycle regional island operations require accelerated non-destructive testing (NDT) intervals using eddy-current inspection for hidden lap joint disbonding.',
      'Visual inspections alone are fundamentally inadequate for detecting sub-surface fatigue cracking hidden beneath countersunk fasteners.'
    ],
    author: {
      name: 'Captain Linda Sterling, ATP, MS',
      role: 'Aviation Systems Airworthiness Auditor',
      affiliation: 'Aviation Safety Review Federation'
    },
    datePublished: '2026-02-25',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
    status: 'approved',
    tags: ['Aviation', 'Fatigue Cracking', 'Corrosion', 'FAA', 'Damage Tolerance']
  },
  {
    id: 'piper-alpha-1988',
    slug: 'piper-alpha-platform-disaster',
    title: 'Piper Alpha Offshore Platform Disaster',
    subtitle: 'Condensate injection pump blind flange pressure breach, permit-to-work communication breakdown, and fire barrier collapse.',
    incidentDate: '1988-07-06',
    location: 'North Sea (UK Sector)',
    industry: 'Offshore Oil & Gas',
    fatalities: 167,
    costEstimate: '$3.4 Billion',
    primaryFailureMode: 'Hydrocarbon Leak & Escalating Cascading Fire',
    standardsViolated: ['Lord Cullen Inquiry Recommendations', 'ISO 13702 Control and Mitigation of Fires', 'API RP 14C Safety Systems on Offshore Platforms'],
    rootCauseAnalysis: `
      <p>Condensate injection pump B had its pressure safety valve (PSV) removed for recertification, and the open pipe was capped with a hand-tight blind flange without full torque specification. During the evening shift change, operating pump A tripped.</p>
      <p>Due to fragmented permit-to-work records stored across separate control rooms, the night operators were unaware of the missing safety valve on pump B and re-energized it. Gas condensate pressurized the blind flange, ruptured the temporary seal, ignited immediately, and destroyed the control room and firewall barriers.</p>
    `,
    engineeringLessons: [
      'Permit to Work (PTW) digital cross-locking: cross-shift handover must require unified physical locks (LOTO) and integrated electronic status tracking.',
      'Emergency Isolation Valves (ESVs) on subsea gas pipelines linking interconnected platforms must be fire-hardened and closeable remotely without local human presence.',
      'Control rooms, living quarters, and evacuation routes must be physically segregated from primary hydrocarbon processing modules.'
    ],
    author: {
      name: 'Douglas MacIntyre, CEng',
      role: 'Offshore Risk Management Director',
      affiliation: 'North Sea Offshore Safety Directorate'
    },
    datePublished: '2026-03-03',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1200&q=80',
    status: 'approved',
    tags: ['Offshore', 'Permit-to-Work', 'Fire Barrier', 'LOTO', 'API RP 14C']
  },
  {
    id: 'fukushima-2011',
    slug: 'fukushima-daiichi-station-blackout',
    title: 'Fukushima Daiichi Nuclear Station Blackout',
    subtitle: 'Beyond-design-basis tsunami inundation, emergency diesel generator submersion, and total extended station blackout (SBO).',
    incidentDate: '2011-03-11',
    location: 'Okuma, Fukushima Prefecture, Japan',
    industry: 'Nuclear Power Generation',
    fatalities: 1,
    costEstimate: '$200 Billion',
    primaryFailureMode: 'Extended Station Blackout (SBO) & Hydrogen Detonation',
    standardsViolated: ['IAEA Safety Standards Series No. SSR-2/1', 'IEEE 384 Separation of Class 1E Equipment', 'ASME Section XI Nuclear Inservice'],
    rootCauseAnalysis: `
      <p>Following the Great East Japan 9.0 magnitude earthquake, reactors 1-3 automatically scrammed successfully. However, 41 minutes later, a 14-meter-high tsunami overtopped the plant's 5.7-meter defensive seawall.</p>
      <p>Seawater flooded the turbine basement and emergency diesel generators (EDGs), destroying all AC power and washing away seawater cooling pumps. Deprived of decay heat cooling for multiple days, the reactor fuel overheated, zirconium cladding reacted with steam generating massive volumes of hydrogen gas, which vented into reactor service buildings and detonated.</p>
    `,
    engineeringLessons: [
      'Design-basis external events must be updated using modern extreme-value statistical distributions rather than historical administrative caps.',
      'Critical emergency power (diesel generators, mobile batteries, switchgear) must be elevated to upper elevations and housed in watertight bunkers.',
      'Passive hydrogen mitigation: passive autocatalytic recombiners (PARs) and hardened filtered containment venting systems (FCVS) must operate without electrical power.'
    ],
    author: {
      name: 'Dr. Kenji Takahashi, PE',
      role: 'Nuclear Resiliency Fellow',
      affiliation: 'Pacific Disaster Mitigation Engineering Society'
    },
    datePublished: '2026-03-10',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1200&q=80',
    status: 'approved',
    tags: ['Nuclear', 'Tsunami', 'Station Blackout', 'Hydrogen Explosion', 'IAEA']
  },
  {
    id: 'flixborough-1974',
    slug: 'flixborough-chemical-explosion',
    title: 'Flixborough Nypro Cyclohexane Plant Explosion',
    subtitle: 'Temporary 20-inch bellows bypass pipe installation without structural support calculations or management of change (MOC).',
    incidentDate: '1974-06-01',
    location: 'Flixborough, Lincolnshire, UK',
    industry: 'Petrochemical Manufacturing',
    fatalities: 28,
    costEstimate: '$250 Million',
    primaryFailureMode: 'Expansion Bellows Squirm & Shear Rupture',
    standardsViolated: ['BS 5500 Unfired Pressure Vessels', 'EJMA Standards for Expansion Joints', 'Health and Safety at Work Act 1974'],
    rootCauseAnalysis: `
      <p>Reactor No. 5 in a cascade of six cyclohexane oxidation reactors developed a vertical crack and was removed for repair. Plant staff bridged the 28-inch gap using a dog-legged 20-inch temporary pipe fitted between two existing stainless steel expansion bellows.</p>
      <p>No mechanical engineering calculations or stress analyses were performed. The temporary pipe was supported merely by scaffolding. Under normal operating pressure of 8.8 bar and 155°C, the dog-leg geometry generated violent lateral turning moments, causing the flexible bellows to squirm, shear, and dump 40 tons of cyclohexane into the atmosphere within seconds.</p>
    `,
    engineeringLessons: [
      'Management of Change (MOC): any temporary modification must be treated with identical rigorous design, calculation, and sign-off standards as permanent installations.',
      'Mechanical bellows are designed for axial deflection only and will fail catastrophically when subjected to unconstrained lateral or bending shear forces.',
      'Engineering competency: key plant modifications must only be authorized by qualified chartered mechanical engineers with structural design expertise.'
    ],
    author: {
      name: 'Oliver Thorne, MSc, CEng',
      role: 'Industrial Forensic Engineer',
      affiliation: 'UK Process Safety Historical Archive'
    },
    datePublished: '2026-03-14',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=80',
    status: 'approved',
    tags: ['MOC', 'Bellows', 'Cyclohexane', 'Management of Change', 'Petrochemical']
  },
  {
    id: 'silver-bridge-1967',
    slug: 'point-pleasant-silver-bridge-collapse',
    title: 'Point Pleasant Silver Bridge Eyebar Fracture',
    subtitle: 'Cleavage brittle fracture from a 0.1-inch stress-corrosion crack in a non-redundant eyebar chain link suspension bridge.',
    incidentDate: '1967-12-15',
    location: 'Point Pleasant, West Virginia / Ohio, USA',
    industry: 'Civil Infrastructure & Transport',
    fatalities: 46,
    costEstimate: '$175 Million',
    primaryFailureMode: 'Stress-Corrosion Cracking & Brittle Fracture',
    standardsViolated: ['AASHTO Bridge Design Specifications', 'ASTM A7 Structural Steel Standards', 'National Bridge Inspection Standards (NBIS)'],
    rootCauseAnalysis: `
      <p>The Silver Bridge suspended its roadway using two-eyebar chains rather than multi-strand wire cables. Eyebar 330 on the Ohio north chain developed a microscopic 0.1-inch (2.5 mm) crack at its pinhole due to cyclic fretting and sulfur dioxide atmospheric corrosion.</p>
      <p>Because the heat-treated alloy steel had low Charpy impact toughness at freezing temperatures (31°F), the tiny flaw reached critical Griffith crack length, causing instantaneous cleavage brittle fracture. With only two eyebars per link, the entire chain collapsed immediately, plunging 31 vehicles into the Ohio River.</p>
    `,
    engineeringLessons: [
      'Fracture-critical non-redundant structures (zero load-path redundancy) must be systematically identified and phased out of civil infrastructure.',
      'Creation of the National Bridge Inspection Standards (NBIS): mandated periodic 2-year non-destructive ultrasonic and visual bridge inspections nationwide.',
      'Steel material specification must include low-temperature Charpy V-notch fracture toughness criteria to prevent brittle cleavage modes.'
    ],
    author: {
      name: 'Dr. Warren H. Cole, PE',
      role: 'Senior Metallurgical Failure Analyst',
      affiliation: 'National Infrastructure Forensics Bureau'
    },
    datePublished: '2026-03-18',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1200&q=80',
    status: 'approved',
    tags: ['Bridge', 'Brittle Fracture', 'Eyebar', 'Stress Corrosion', 'Civil']
  },
  {
    id: 'ariane-5-1996',
    slug: 'ariane-5-flight-501-overflow',
    title: 'Ariane 5 Flight 501 Software Integer Overflow',
    subtitle: '64-bit floating point to 16-bit signed integer conversion exception in inertial reference system (SRI) guidance software.',
    incidentDate: '1996-06-04',
    location: 'Kourou, French Guiana',
    industry: 'Aerospace & Software Engineering',
    fatalities: 0,
    costEstimate: '$370 Million',
    primaryFailureMode: 'Software Data Conversion Overflow / Unhandled Exception',
    standardsViolated: ['DO-178B Software Considerations in Airborne Systems', 'IEEE 730 Software Quality Assurance', 'ISO 9000-3 Software Development'],
    rootCauseAnalysis: `
      <p>Flight 501 carried inertial reference system (SRI) software reused verbatim from the earlier Ariane 4 rocket. Approximately 36.7 seconds after liftoff, horizontal velocity sensor values exceeded the maximum capacity of a 16-bit signed integer (greater than +32,767).</p>
      <p>The conversion caused an unhandled software operand error. Both the primary and backup computers aborted guidance calculations simultaneously and output diagnostic bit patterns onto the data bus. The rocket flight computer interpreted these diagnostic bits as real 90-degree pitch anomalies, ordered maximum nozzle swivel, and initiated aerodynamic disintegration.</p>
    `,
    engineeringLessons: [
      'Software reuse risk: legacy modules must be re-verified against the dynamic envelope and trajectories of new physical launch vehicles.',
      'Identical hardware/software redundancy provides zero protection against deterministic logical design bugs (common-cause software failure).',
      'Defensive programming: numerical conversions must feature bounds clamping or dedicated exception recovery rather than shutting down flight-critical computing nodes.'
    ],
    author: {
      name: 'Claire Dupont, CSDP',
      role: 'Avionics Software Safety Architect',
      affiliation: 'European Aerospace Software Reliability Group'
    },
    datePublished: '2026-03-20',
    imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80',
    status: 'approved',
    tags: ['Software', 'Integer Overflow', 'Aerospace', 'DO-178B', 'Ariane']
  },
  {
    id: 'northeast-2003',
    slug: 'northeast-blackout-2003-alarm-stall',
    title: '2003 Northeast Blackout Cascading Grid Trip',
    subtitle: 'Energy management software alarm race condition, transmission line thermal tree sagging, and lack of grid situational awareness.',
    incidentDate: '2003-08-14',
    location: 'Northeastern USA & Ontario, Canada',
    industry: 'Electrical Grid & Power Systems',
    fatalities: 10,
    costEstimate: '$6 Billion',
    primaryFailureMode: 'Software Alarm Processor Freeze & Cascading Line Sag',
    standardsViolated: ['NERC Reliability Standards FAC-003', 'IEEE C37 Transmission Line Protection', 'ISO/IEC 27019 Energy Grid IT Security'],
    rootCauseAnalysis: `
      <p>Three 345-kV transmission lines in northern Ohio sagged into untrimmed trees under heavy summer power load and tripped offline. Normally, energy management system (EMS) software sounds alarms and recalculates power flow.</p>
      <p>However, a race condition in FirstEnergy\'s XA/21 alarm processing daemon caused it to enter an infinite loop, freezing the operator alarm screens without raising any software health notification. Operating without awareness for over an hour, surrounding lines became progressively overloaded, initiating a 9-second cascading blackout affecting 55 million people.</p>
    `,
    engineeringLessons: [
      'Watchdog timer architecture: critical SCADA and EMS alarm processors must have independent external hardware watchdogs to alert operators of software lockups.',
      'Vegetation management (NERC FAC-003): physical clearing of transmission line rights-of-way must be rigorously enforced with satellite and aerial LiDAR auditing.',
      'Wide-Area Situational Awareness (WASA): synchronized phasor measurement units (PMUs) must provide real-time interconnect-wide dynamic state visibility.'
    ],
    author: {
      name: 'Gerald R. O\'Connor, PE',
      role: 'Grid Reliability Compliance Director',
      affiliation: 'North American Power System Security Forum'
    },
    datePublished: '2026-03-24',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80',
    status: 'approved',
    tags: ['Power Grid', 'NERC', 'Software Stall', 'Transmission', 'Blackout']
  },
  {
    id: 'buncefield-2005',
    slug: 'buncefield-oil-depot-explosion',
    title: 'Buncefield Oil Storage Depot Explosion',
    subtitle: 'Independent high-level alarm switch mechanical jam, tank overflow, and unconfined hydrocarbon vapor cloud deflagration.',
    incidentDate: '2005-12-11',
    location: 'Hemel Hempstead, Hertfordshire, UK',
    industry: 'Petroleum Storage & Distribution',
    fatalities: 0,
    costEstimate: '$1.5 Billion',
    primaryFailureMode: 'Storage Tank Overfill & Vapor Cloud Deflagration',
    standardsViolated: ['API 2350 Overfill Protection for Storage Tanks', 'IEC 61511 Safety Instrumented Systems', 'COMAH Regulations 1999'],
    rootCauseAnalysis: `
      <p>Tank 912 at the Buncefield oil storage depot was filled with unleaded petrol at 550 cubic meters per hour. The servo level gauge stuck at a constant level due to internal mechanical friction. The secondary independent high-high level switch (IHLS) failed to trigger because a padlocked test lever had been left in an inoperative position following maintenance.</p>
      <p>Petrol cascaded over the roof of the tank, atomized in the cold still night air, and generated a massive vapor cloud over 400 meters in diameter, which ignited from emergency fire pump generator electrical contacts.</p>
    `,
    engineeringLessons: [
      'API Standard 2350 Fourth Edition compliance: overfill prevention requires automated independent safety instrumented systems (SIS) that trip supply pipeline valves without human intervention.',
      'Proof-testing protocol: testing mechanisms on safety switches must automatically return to operational status and indicate fault when pinned or disengaged.',
      'Vapor cloud dispersion modeling must account for low-wind calm atmospheric conditions that trap heavier-than-air hydrocarbons close to ground level.'
    ],
    author: {
      name: 'Fiona Abernathy, CEng, FIChemE',
      role: 'Petroleum Terminal Safety Inspector',
      affiliation: 'Major Hazards Enforcement Authority'
    },
    datePublished: '2026-03-27',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
    status: 'approved',
    tags: ['Storage Tank', 'Overfill', 'API 2350', 'Vapor Cloud', 'IEC 61511']
  }
];

const LOCAL_STORAGE_KEY = 'reliability_failure_museum_drafts';

/**
 * Retrieves all approved failure cases (pre-seeded + locally approved community submissions)
 */
export function getApprovedFailureCases(): FailureCase[] {
  const localCases = getStoredCommunityCases();
  const approvedLocal = localCases.filter(c => c.status === 'approved');
  return [...SEEDED_FAILURE_CASES, ...approvedLocal];
}

/**
 * Retrieves unapproved draft submissions (noindex)
 */
export function getDraftFailureCases(): FailureCase[] {
  const localCases = getStoredCommunityCases();
  return localCases.filter(c => c.status === 'draft');
}

/**
 * Retrieves all failure cases (both approved and drafts)
 */
export function getAllFailureCases(): FailureCase[] {
  const localCases = getStoredCommunityCases();
  return [...SEEDED_FAILURE_CASES, ...localCases];
}

/**
 * Finds a case by its slug
 */
export function getFailureCaseBySlug(slug: string): FailureCase | undefined {
  const all = getAllFailureCases();
  return all.find(c => c.slug === slug || c.slug === slug.replace(/\/$/, ''));
}

/**
 * Retrieves community cases stored in localStorage
 */
function getStoredCommunityCases(): FailureCase[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new community case submission as a 'draft' (noindex)
 */
export function saveDraftFailureCase(data: Omit<FailureCase, 'id' | 'status' | 'datePublished' | 'isCommunitySubmission'>): FailureCase {
  const id = `community-${Date.now()}`;
  const newCase: FailureCase = {
    ...data,
    id,
    status: 'draft',
    datePublished: new Date().toISOString().split('T')[0],
    isCommunitySubmission: true
  };

  if (typeof window !== 'undefined') {
    const existing = getStoredCommunityCases();
    existing.unshift(newCase);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  }

  return newCase;
}

/**
 * Manually approves a draft case, flipping status to 'approved' (indexable)
 */
export function approveDraftFailureCase(id: string): boolean {
  if (typeof window === 'undefined') return false;
  const existing = getStoredCommunityCases();
  const target = existing.find(c => c.id === id);
  if (!target) return false;

  target.status = 'approved';
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  return true;
}
