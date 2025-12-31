import { calculateMTBF, calculateMTTR, calculateAvailability, calculateSeriesReliability, calculateParallelReliability } from './reliabilityMath';

// Declaring test globals to fix TypeScript errors when types are not installed
declare const describe: (name: string, callback: () => void) => void;
declare const test: (name: string, callback: () => void) => void;
declare const expect: (value: any) => any;

describe('Reliability Calculator Tests', () => {
  
  test('calculateMTBF should return correct value', () => {
    expect(calculateMTBF(1000, 4)).toBe(250);
    expect(calculateMTBF(1000, 0)).toBe(1000); // Handle zero failures
  });

  test('calculateMTTR should return correct value', () => {
    expect(calculateMTTR(100, 10)).toBe(10);
    expect(calculateMTTR(0, 5)).toBe(0);
  });

  test('calculateAvailability should return correct percentage', () => {
    // MTBF = 90, MTTR = 10 -> 90 / (90+10) = 0.9 -> 90%
    expect(calculateAvailability(90, 10)).toBeCloseTo(90);
  });

  test('calculateSeriesReliability', () => {
    // Series: 0.9 * 0.9 = 0.81
    expect(calculateSeriesReliability([0.9, 0.9])).toBeCloseTo(0.81);
  });

  test('calculateParallelReliability', () => {
    // Parallel: 1 - (0.1 * 0.1) = 0.99
    expect(calculateParallelReliability([0.9, 0.9])).toBeCloseTo(0.99);
  });
});