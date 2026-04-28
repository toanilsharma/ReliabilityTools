import { QuizQuestion } from '../types';

export const quizQuestionsInstrumentation: QuizQuestion[] = [
  // Easy (1-12)
  {
    id: 501,
    text: "What is the primary function of a transmitter in an instrumentation system?",
    options: ["To physically block fluid flow", "To convert a sensor's measurement into a standardized signal (like 4-20mA) for transmission", "To generate power for the sensor", "To cool the process line"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "A transmitter converts the raw physical measurement from a sensor into a standardized analog or digital signal.",
    discipline: "instrumentation"
  },
  {
    id: 502,
    text: "In industrial instrumentation, what does the 4-20mA standard represent?",
    options: ["4 volts to 20 volts", "A current loop signal where 4mA is 0% and 20mA is 100% of the measured scale", "A frequency of 4 to 20 Hertz", "The physical size of the cable"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "The 4-20mA current loop is an industry standard where 4mA represents the zero-scale value and 20mA represents the full-scale value.",
    discipline: "instrumentation"
  },
  {
    id: 503,
    text: "What is a 'Thermocouple' used to measure?",
    options: ["Pressure", "Flow rate", "Temperature", "Level"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "A thermocouple consists of two dissimilar metals joined together that produce a small voltage proportional to temperature.",
    discipline: "instrumentation"
  },
  {
    id: 504,
    text: "What does PLC stand for?",
    options: ["Pressure Level Controller", "Programmable Logic Controller", "Process Loop Calibrator", "Primary Line Circuit"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "A Programmable Logic Controller (PLC) is an industrial digital computer ruggedized for the control of manufacturing processes.",
    discipline: "instrumentation"
  },
  {
    id: 505,
    text: "What does an RTD (Resistance Temperature Detector) rely on to measure temperature?",
    options: ["The expansion of mercury", "The generation of a millivolt signal", "The predictable change in electrical resistance of a metal with temperature", "Infrared radiation"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "RTDs measure temperature by correlating the resistance of the RTD element (usually platinum) with temperature.",
    discipline: "instrumentation"
  },
  {
    id: 506,
    text: "What is the purpose of a 'control valve'?",
    options: ["To measure fluid flow", "To physically manipulate the flow rate of a fluid in response to a control signal", "To filter particles out of the fluid", "To pump fluid through a pipe"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Control valves act as the final control element, adjusting flow by opening or closing based on signals from a controller.",
    discipline: "instrumentation"
  },
  {
    id: 507,
    text: "What does 'Calibration' mean?",
    options: ["Replacing a broken sensor", "Adjusting a device's output to match a known, traceable standard", "Cleaning a transmitter", "Painting the instrument"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Calibration is the comparison and adjustment of a measurement device against an accurate, traceable reference standard.",
    discipline: "instrumentation"
  },
  {
    id: 508,
    text: "In a control loop, what does 'PID' stand for?",
    options: ["Proportional, Integral, Derivative", "Process, Instrument, Device", "Pressure, Indicator, Dial", "Pneumatic, Internal, Direct"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "PID stands for Proportional, Integral, Derivative, which are the three terms used in the most common control algorithm.",
    discipline: "instrumentation"
  },
  {
    id: 509,
    text: "What type of level measurement involves measuring the pressure at the bottom of a tank?",
    options: ["Ultrasonic level", "Radar level", "Hydrostatic level", "Capacitance level"],
    correctAnswer: 2,
    difficulty: "easy",
    explanation: "Hydrostatic level measurement infers the level of liquid in a tank by measuring the pressure created by the column of liquid.",
    discipline: "instrumentation"
  },
  {
    id: 510,
    text: "What is a 'fail-safe' position for a control valve?",
    options: ["The position the valve goes to when power or air supply is lost to ensure safety", "The position that gives maximum flow", "Always completely open", "The position it holds when working normally"],
    correctAnswer: 0,
    difficulty: "easy",
    explanation: "Fail-safe is the engineered default state (Fail Open or Fail Closed) a valve takes upon loss of actuator power to prevent a hazard.",
    discipline: "instrumentation"
  },
  {
    id: 511,
    text: "What is 'HART' in instrumentation?",
    options: ["A brand of valve", "Highway Addressable Remote Transducer - a digital protocol superimposed on a 4-20mA signal", "A temperature scale", "A pressure unit"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "HART is a hybrid protocol that allows two-way digital communication over legacy 4-20mA analog wiring.",
    discipline: "instrumentation"
  },
  {
    id: 512,
    text: "What is the primary advantage of a Coriolis flow meter?",
    options: ["It is very cheap", "It directly measures mass flow rate rather than volumetric flow", "It has no moving parts", "It only measures gas"],
    correctAnswer: 1,
    difficulty: "easy",
    explanation: "Coriolis meters directly measure the true mass flow rate of a fluid, independent of temperature, pressure, or density changes.",
    discipline: "instrumentation"
  },

  // Difficult (13-21)
  {
    id: 513,
    text: "What does 'Zero Drift' mean in a transmitter?",
    options: ["The physical movement of the transmitter", "A parallel shift of the entire calibration curve, affecting all readings equally", "A change in the span/slope of the calibration", "The signal dropping to 0mA"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Zero drift is an offset error where the output shifts by a constant amount across the entire measurement range.",
    discipline: "instrumentation"
  },
  {
    id: 514,
    text: "In Safety Instrumented Systems (SIS), what does 'SIL' stand for?",
    options: ["Standard Instrument Level", "Safety Integrity Level", "System Internal Logic", "Sequence Indication Light"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Safety Integrity Level (SIL) represents the target level of risk reduction provided by a safety function (rated 1 to 4).",
    discipline: "instrumentation"
  },
  {
    id: 515,
    text: "What is 'Deadband' in a switch or controller?",
    options: ["The time it takes to break", "The range through which an input signal can be varied without initiating an observable change in output", "A broken electrical wire", "The maximum pressure limit"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Deadband is a range of input values where the system does not respond, often used to prevent rapid cycling (chattering).",
    discipline: "instrumentation"
  },
  {
    id: 516,
    text: "How does a differential pressure (DP) transmitter calculate flow across an orifice plate?",
    options: ["Flow is proportional to the DP", "Flow is proportional to the square root of the DP", "Flow is inversely proportional to DP", "Flow equals DP squared"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "According to Bernoulli's principle, the volumetric flow rate through an orifice is proportional to the square root of the differential pressure.",
    discipline: "instrumentation"
  },
  {
    id: 517,
    text: "What is 'Cavitation' specifically within a control valve?",
    options: ["Vibration of the stem", "The flashing of liquid to vapor at the vena contracta, followed by violent collapse as pressure recovers", "Corrosion from acids", "The valve failing closed"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "In valves, cavitation occurs when pressure drops below vapor pressure at the narrowest point (vena contracta), forming bubbles that collapse downstream.",
    discipline: "instrumentation"
  },
  {
    id: 518,
    text: "What characterizes an 'Intrinsically Safe' (IS) instrument loop?",
    options: ["It has a very strong metal casing", "It is designed to operate on energy levels so low they cannot ignite an explosive atmosphere", "It uses high voltage", "It only operates underwater"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Intrinsic safety limits the electrical and thermal energy available in a circuit to levels incapable of igniting a specific hazardous atmosphere.",
    discipline: "instrumentation"
  },
  {
    id: 519,
    text: "What is the primary difference between a 2-wire and a 4-wire transmitter?",
    options: ["A 2-wire is loop-powered via the 4-20mA signal; a 4-wire has a separate dedicated power supply", "A 2-wire has two sensors", "A 4-wire transmits 4 signals", "A 2-wire is only for AC power"],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "A 2-wire transmitter draws its operating power directly from the 4-20mA loop, whereas a 4-wire transmitter has separate pairs for power and signal.",
    discipline: "instrumentation"
  },
  {
    id: 520,
    text: "In PID tuning, what is the effect of increasing the 'Integral' action (decreasing Integral Time)?",
    options: ["It eliminates steady-state error but can cause oscillation if too aggressive", "It creates a steady-state offset", "It acts like a shock absorber", "It limits the maximum valve opening"],
    correctAnswer: 0,
    difficulty: "difficult",
    explanation: "Integral action sums the error over time to drive the steady-state error to zero, but too much integral action causes the loop to overshoot and oscillate.",
    discipline: "instrumentation"
  },
  {
    id: 521,
    text: "What is 'Cold Junction Compensation' in thermocouple measurement?",
    options: ["Freezing the sensor", "Compensating for the unwanted thermoelectric voltage generated where the thermocouple wires connect to the measurement instrument", "Cooling the transmitter", "Using a platinum wire"],
    correctAnswer: 1,
    difficulty: "difficult",
    explanation: "Thermocouples measure temperature differences. CJC adds the known temperature of the connection point (cold junction) to calculate the absolute temperature at the tip.",
    discipline: "instrumentation"
  },

  // Very Difficult (22-30)
  {
    id: 522,
    text: "In functional safety (IEC 61511), what is the difference between 'Demand Mode' and 'Continuous Mode' operation?",
    options: ["The speed of the PLC", "Demand mode means the safety function operates only on a process deviation; continuous mode means the safety function actively controls the process", "There is no difference", "Continuous mode is for valves, demand for pumps"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Demand mode systems act only when a dangerous condition occurs (e.g., an ESD valve). Continuous mode systems constantly act to maintain safety.",
    discipline: "instrumentation"
  },
  {
    id: 523,
    text: "What is the 'Beta Ratio' (β) of an orifice plate?",
    options: ["The accuracy of the DP cell", "The ratio of the orifice bore diameter (d) to the internal pipe diameter (D)", "The density of the fluid", "The discharge coefficient"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "The Beta ratio (d/D) is a critical dimensionless parameter used in flow calculations to determine the pressure drop characteristics of an orifice plate.",
    discipline: "instrumentation"
  },
  {
    id: 524,
    text: "In advanced process control, what does 'Cascade Control' involve?",
    options: ["Water flowing down a pipe", "The output of a primary (master) controller acting as the setpoint for a secondary (slave) controller", "Using two valves in parallel", "A controller that only has Proportional action"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Cascade control uses an inner (slave) loop to quickly reject fast disturbances before they affect the outer (master) loop.",
    discipline: "instrumentation"
  },
  {
    id: 525,
    text: "What is the phenomenon of 'Reset Windup' in a PID controller?",
    options: ["The spring inside a valve breaking", "The integral term continuing to accumulate a massive error value when the final control element has reached its physical limit (saturation)", "The derivative term going to infinity", "The controller rebooting"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Reset windup occurs when the actuator hits a physical limit (e.g., 100% open), but the integral term keeps accumulating error, causing a massive delay when the process finally reverses.",
    discipline: "instrumentation"
  },
  {
    id: 526,
    text: "In SIL verification calculations, what does 'PFDavg' calculate?",
    options: ["The average pressure", "The Average Probability of Failure on Demand of a safety function", "The proportional frequency derivative", "The power factor difference"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "PFDavg is the quantitative metric used to determine if a low-demand safety instrumented function meets its target SIL rating.",
    discipline: "instrumentation"
  },
  {
    id: 527,
    text: "What defines 'Hysteresis' in a mechanical pressure switch or valve actuator?",
    options: ["The speed of response", "The maximum pressure rating", "The difference in actuation point depending on whether the input signal is increasing or decreasing", "The electrical voltage required"],
    correctAnswer: 2,
    difficulty: "very_difficult",
    explanation: "Hysteresis is the dependence of a system's state on its history, resulting in a lag or differing trip/reset points on the way up versus the way down.",
    discipline: "instrumentation"
  },
  {
    id: 528,
    text: "Which digital communication protocol uses a 'Token Passing' mechanism on an RS-485 physical layer?",
    options: ["HART", "Foundation Fieldbus", "Profibus DP", "EtherNet/IP"],
    correctAnswer: 2,
    difficulty: "very_difficult",
    explanation: "Profibus DP utilizes a token passing mechanism between masters, and a master-slave mechanism for communicating with field devices over an RS-485 network.",
    discipline: "instrumentation"
  },
  {
    id: 529,
    text: "In ultrasonic flow meters, what is the 'Transit-Time' principle?",
    options: ["Measuring the Doppler shift of particles", "Measuring the difference in time it takes an ultrasonic pulse to travel upstream versus downstream", "Measuring the time for a pulse to bounce off the pipe wall", "Measuring fluid density"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "Transit-time flow meters calculate flow velocity based on the fact that sound travels faster downstream (with the flow) than upstream (against the flow).",
    discipline: "instrumentation"
  },
  {
    id: 530,
    text: "What is a 'Stilling Well' used for in radar or ultrasonic level measurement?",
    options: ["To store spare fluid", "To provide a calm, smooth surface free of turbulence and foam for the signal to bounce off", "To increase the pressure", "To measure temperature"],
    correctAnswer: 1,
    difficulty: "very_difficult",
    explanation: "A stilling well is a vertical pipe installed inside a turbulent tank to isolate the level sensor's measurement path from surface agitation and foam.",
    discipline: "instrumentation"
  }
];
