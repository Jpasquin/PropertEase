import { describe, it, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAppStore } from '../../../src/stores/app';

describe('calculateMortgage', () => {
  it('should correctly calculate the monthly payment', async () => {
    // Create a new instance of Pinia
    const pinia = createPinia();
    // Set the created Pinia as the active instance
    setActivePinia(pinia);

    const app = useAppStore();
    const principal = 500000; // Example principal
    const annualRate = 5; // Example annual interest rate
    const loanTerm = 30; // Example loan term in years

    const expectedMonthlyPayment = 2684.11;
    const monthlyPayment = await app.calculateMortgage(principal, annualRate, loanTerm);

    expect(monthlyPayment).toBeCloseTo(expectedMonthlyPayment);
  });
});
