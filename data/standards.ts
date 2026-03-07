export interface StandardComponent {
  id: string;
  category: string;
  name: string;
  failureRate: number; // Failures per million hours (FPMH)
  standard: string;
}

export const reliabilityStandards: StandardComponent[] = [
  // MIL-HDBK-217F
  { id: 'mil-res-film', category: 'Resistors', name: 'Film Resistor (Fixed)', failureRate: 0.0037, standard: 'MIL-HDBK-217F' },
  { id: 'mil-cap-cer', category: 'Capacitors', name: 'Ceramic Capacitor (General)', failureRate: 0.027, standard: 'MIL-HDBK-217F' },
  { id: 'mil-trans-bjt', category: 'Semiconductors', name: 'Bipolar Transistor (< 5W)', failureRate: 0.086, standard: 'MIL-HDBK-217F' },
  { id: 'mil-ic-digital', category: 'Microcircuits', name: 'Digital IC (Logic, 100-1000 gates)', failureRate: 0.150, standard: 'MIL-HDBK-217F' },
  { id: 'mil-relay-em', category: 'Electromechanical', name: 'Electromagnetic Relay', failureRate: 0.350, standard: 'MIL-HDBK-217F' },
  { id: 'mil-switch-toggle', category: 'Electromechanical', name: 'Toggle Switch', failureRate: 0.100, standard: 'MIL-HDBK-217F' },
  
  // Telcordia SR-332
  { id: 'tel-res-film', category: 'Resistors', name: 'Film Resistor', failureRate: 0.001, standard: 'Telcordia SR-332' },
  { id: 'tel-cap-cer', category: 'Capacitors', name: 'Ceramic Capacitor', failureRate: 0.010, standard: 'Telcordia SR-332' },
  { id: 'tel-ic-micro', category: 'Microcircuits', name: 'Microprocessor / MCU', failureRate: 0.500, standard: 'Telcordia SR-332' },
  { id: 'tel-optical-laser', category: 'Optoelectronics', name: 'Laser Diode Module', failureRate: 4.500, standard: 'Telcordia SR-332' },
  
  // IEC 62380 / FIDES
  { id: 'iec-pcb-fr4', category: 'Printed Circuit Boards', name: 'FR4 PCB (per sq cm)', failureRate: 0.005, standard: 'IEC 62380' },
  { id: 'iec-conn-pin', category: 'Connectors', name: 'Pin Header (per pin)', failureRate: 0.001, standard: 'IEC 62380' },
  { id: 'iec-battery-li', category: 'Power', name: 'Lithium Ion Battery Cell', failureRate: 1.200, standard: 'IEC 62380' }
];

// Helper to get grouped components for dropdowns
export const getGroupedStandards = () => {
  return reliabilityStandards.reduce((acc, curr) => {
    if (!acc[curr.standard]) acc[curr.standard] = [];
    acc[curr.standard].push(curr);
    return acc;
  }, {} as Record<string, StandardComponent[]>);
};
