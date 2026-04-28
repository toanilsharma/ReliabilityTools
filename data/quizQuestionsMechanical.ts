import { QuizQuestion } from '../types';

export const quizQuestionsMechanical: QuizQuestion[] = [
  // Easy (1-12)
  {
    id: 301,
    text: "What is the primary purpose of a bearing in rotating machinery?",
    options: ["To generate torque", "To reduce friction and support loads", "To increase shaft speed", "To cool the system"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Bearings reduce friction between moving parts and support the mechanical loads of the rotating shaft.",
    discipline: "mechanical"
  },
  {
    id: 302,
    text: "Which type of misalignment is characterized by the shafts being parallel but not collinear?",
    options: ["Angular misalignment", "Parallel (offset) misalignment", "Axial misalignment", "Torsional misalignment"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Parallel or offset misalignment occurs when the centerlines of the two shafts are parallel but displaced laterally.",
    discipline: "mechanical"
  },
  {
    id: 303,
    text: "What is the main function of a mechanical seal in a centrifugal pump?",
    options: ["To pump the fluid", "To prevent fluid leakage along the shaft", "To cool the motor", "To align the shaft"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Mechanical seals prevent the pumped fluid from leaking out along the rotating shaft of the pump.",
    discipline: "mechanical"
  },
  {
    id: 304,
    text: "In vibration analysis, what does a high 1X (running speed) peak typically indicate?",
    options: ["Bearing failure", "Gear mesh issues", "Unbalance", "Cavitation"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "A dominant peak at 1X the running speed is the classic signature of mass unbalance in a rotor.",
    discipline: "mechanical"
  },
  {
    id: 305,
    text: "What is the primary purpose of lubrication?",
    options: ["To increase friction", "To separate moving surfaces and reduce wear", "To generate heat", "To harden metal surfaces"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Lubricants form a film that separates moving surfaces, reducing friction, wear, and heat generation.",
    discipline: "mechanical"
  },
  {
    id: 306,
    text: "Which parameter is most critical for hydrodynamic lubrication?",
    options: ["Oil color", "Viscosity", "Flash point", "Density"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Viscosity is the most critical property as it determines the oil's ability to maintain a hydrodynamic film under load.",
    discipline: "mechanical"
  },
  {
    id: 307,
    text: "What is cavitation in a pump?",
    options: ["The formation and collapse of vapor bubbles", "The motor overheating", "The shaft bending", "The seal leaking"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "Cavitation occurs when fluid pressure drops below vapor pressure, forming bubbles that violently collapse, causing damage.",
    discipline: "mechanical"
  },
  {
    id: 308,
    text: "What tool is commonly used to measure shaft alignment precisely?",
    options: ["Tape measure", "Laser alignment tool", "Thermometer", "Stethoscope"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Laser alignment tools are the industry standard for highly precise shaft alignment.",
    discipline: "mechanical"
  },
  {
    id: 309,
    text: "What causes 'soft foot' in rotating machinery?",
    options: ["A soft rubber vibration pad", "Uneven contact between the machine feet and the base", "A loose bearing", "Low oil pressure"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Soft foot occurs when the mounting feet of a machine do not sit flat evenly on the baseplate.",
    discipline: "mechanical"
  },
  {
    id: 310,
    text: "Which NDT (Non-Destructive Testing) method is best for finding surface cracks in ferromagnetic materials?",
    options: ["Ultrasonic testing", "Radiography", "Magnetic Particle Inspection (MPI)", "Vibration analysis"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "MPI uses magnetic fields and iron particles to detect surface and near-surface defects in ferromagnetic materials.",
    discipline: "mechanical"
  },
  {
    id: 311,
    text: "What does ISO VG stand for in lubrication?",
    options: ["International Standards Organization Viscosity Grade", "Internal System of Viscosity Guidelines", "Industrial Standard Value Grade", "Integrated System of Vane Gears"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "ISO VG is the internationally recognized system for classifying the viscosity of industrial lubricating oils.",
    discipline: "mechanical"
  },
  {
    id: 312,
    text: "What is the primary cause of fatigue failure in a mechanical shaft?",
    options: ["High static load", "Cyclic (alternating) stresses", "High temperature", "Corrosion only"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Fatigue failure is caused by repeated, cyclic stresses that initiate and propagate cracks over time.",
    discipline: "mechanical"
  },

  // Difficult (13-21)
  {
    id: 313,
    text: "In a gear mesh vibration spectrum, where would you expect to see the gear mesh frequency (GMF)?",
    options: ["At 1X shaft speed", "At Number of Teeth × Shaft Speed", "At 2X shaft speed", "At the bearing outer race frequency"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Gear Mesh Frequency (GMF) is calculated by multiplying the number of teeth on a gear by its rotational speed.",
    discipline: "mechanical"
  },
  {
    id: 314,
    text: "What does the 'L10 life' of a rolling element bearing represent?",
    options: ["The time until 10% of a population of bearings will fail due to fatigue", "The time until 100% of bearings fail", "10 years of life", "The time until the lubricant degrades 10%"],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "L10 life (or B10 life) is the basic rating life at which 10% of a large group of identical bearings are expected to fail from rolling contact fatigue.",
    discipline: "mechanical"
  },
  {
    id: 315,
    text: "What is the phenomenon where a rotor operates at its natural frequency, causing massive vibration amplitudes?",
    options: ["Surge", "Critical speed", "Cavitation", "Resonance"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "The critical speed of a rotor is the rotational speed that matches its natural frequency, leading to resonance and high vibration.",
    discipline: "mechanical"
  },
  {
    id: 316,
    text: "In oil analysis, what does an increase in the Total Acid Number (TAN) usually indicate?",
    options: ["Water contamination", "Oil oxidation and degradation", "Fuel dilution", "Particle contamination"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "An increasing TAN indicates the formation of acidic byproducts, a primary sign of oil oxidation and chemical degradation.",
    discipline: "mechanical"
  },
  {
    id: 317,
    text: "What is the purpose of a 'labyrinth seal'?",
    options: ["To block fluid using a complex, tortuous path rather than contact", "To create a vacuum", "To filter oil", "To couple two shafts"],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "A labyrinth seal uses a series of complex, non-contacting passages to restrict leakage through pressure drops.",
    discipline: "mechanical"
  },
  {
    id: 318,
    text: "Which of the following is an indicator of rolling element bearing degradation in its early stages?",
    options: ["High 1X vibration", "High velocity amplitude", "High frequency ultrasonic/demodulated energy (PeakVue/Spike Energy)", "Low oil pressure"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "Early bearing defects generate high-frequency stress waves, best detected by ultrasonic or demodulation/enveloping techniques.",
    discipline: "mechanical"
  },
  {
    id: 319,
    text: "What is the primary mechanism of 'fretting corrosion'?",
    options: ["Galvanic action between dissimilar metals", "Chemical attack by acids", "Micro-motion (oscillation) between two loaded surfaces", "High-temperature oxidation"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "Fretting wear/corrosion occurs between two loaded surfaces subjected to microscopic oscillatory motion (vibration).",
    discipline: "mechanical"
  },
  {
    id: 320,
    text: "In pump performance curves, what happens if NPSHa (Available) drops below NPSHr (Required)?",
    options: ["The pump runs efficiently", "The motor trips on overload", "Cavitation occurs", "The seal blows out"],
    correctAnswer: 2,
    difficulty: "difficult",
    explanation: "If Net Positive Suction Head Available drops below the Required value, the fluid flashes to vapor, causing cavitation.",
    discipline: "mechanical"
  },
  {
    id: 321,
    text: "What is 'Brinelling' in a bearing?",
    options: ["Chemical corrosion of the races", "Permanent plastic deformation (dents) of the raceways caused by static overload or impact", "Wear from lack of lubrication", "Electrical fluting"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "True Brinelling is the material yielding (denting) on the raceway due to extreme static loads or impacts.",
    discipline: "mechanical"
  },

  // Very Difficult (22-30)
  {
    id: 322,
    text: "In rotor dynamics, what is a 'sub-synchronous' vibration peak at exactly 0.43X to 0.48X running speed characteristic of?",
    options: ["Mass unbalance", "Oil whirl in a journal bearing", "Gear mesh frequency", "Outer race bearing defect"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Oil whirl is an instability in hydrodynamic journal bearings, typically occurring just below 0.5X running speed (often 0.43-0.48X).",
    discipline: "mechanical"
  },
  {
    id: 323,
    text: "According to the SKF bearing life equation, if the dynamic equivalent radial load on a ball bearing is doubled, what happens to the calculated L10 life?",
    options: ["It is halved (1/2)", "It is reduced to 1/8th of its original life", "It decreases by 10%", "It remains the same"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "For ball bearings, life is inversely proportional to the load cubed (1/P^3). Doubling the load (2^3 = 8) reduces life to 1/8th.",
    discipline: "mechanical"
  },
  {
    id: 324,
    text: "What is the primary difference between a 'stiff' rotor and a 'flexible' rotor?",
    options: ["Material hardness", "A flexible rotor operates above its first critical speed; a stiff rotor operates below it", "Flexible rotors use rubber couplings", "Stiff rotors are only used in low-speed pumps"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "In dynamics, a rotor is 'flexible' if its normal operating speed is above its first bending critical speed.",
    discipline: "mechanical"
  },
  {
    id: 325,
    text: "In interpreting an orbit plot (Lissajous figure) from proximity probes, what does a clear 'figure-8' shape indicate?",
    options: ["Unbalance", "Misalignment", "Rubbing", "Oil whip"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "A figure-8 orbit plot indicates a dominant 2X vibration, which is a classic symptom of severe angular misalignment.",
    discipline: "mechanical"
  },
  {
    id: 326,
    text: "What specific defect causes 'fluting' (washboard pattern) on rolling element bearing raceways?",
    options: ["Acidic oil", "Electrical discharge machining (EDM) currents passing through the bearing", "Improper installation force", "Water contamination"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Fluting is caused by stray electrical currents arcing through the thin oil film, melting the steel and causing a washboard pattern.",
    discipline: "mechanical"
  },
  {
    id: 327,
    text: "In elastohydrodynamic lubrication (EHL), what happens to the viscosity of the oil within the contact zone?",
    options: ["It drops to zero", "It remains constant", "It increases exponentially due to extreme pressure, becoming glass-like", "It vaporizes"],
    correctAnswer: 2,
    difficulty: "very_difficult",
    explanation: "In EHL (like in rolling bearings), the extreme pressure in the contact zone causes the oil's viscosity to increase exponentially, acting almost like a solid.",
    discipline: "mechanical"
  },
  {
    id: 328,
    text: "Which parameter does the 'Sommerfeld Number' mathematically describe?",
    options: ["Bearing fatigue life", "The load-carrying capacity and performance of a hydrodynamic journal bearing", "Pump cavitation threshold", "Gear tooth bending stress"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "The Sommerfeld Number is a dimensionless quantity used extensively in the design and analysis of hydrodynamic journal bearings.",
    discipline: "mechanical"
  },
  {
    id: 329,
    text: "In a centrifugal compressor, what defines the 'surge line' on its performance map?",
    options: ["The point of maximum efficiency", "The locus of points where aerodynamic stall and flow reversal occur due to high head and low flow", "The maximum mechanical speed limit", "The choke point"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "The surge line marks the boundary of unstable operation where flow violently reverses due to the compressor's inability to overcome the discharge pressure.",
    discipline: "mechanical"
  },
  {
    id: 330,
    text: "What does the 'Paris Law' equation (da/dN = C(ΔK)^m) model in mechanical reliability?",
    options: ["Heat transfer rates", "Fatigue crack growth rate under cyclic loading", "Lubricant degradation rate", "Vibration attenuation"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "The Paris-Erdogan law relates the rate of fatigue crack growth (da/dN) to the stress intensity factor range (ΔK) in fracture mechanics.",
    discipline: "mechanical"
  }
];
