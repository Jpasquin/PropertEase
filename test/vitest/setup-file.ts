// This file will be run before each test file
import { vi } from 'vitest'

vi.mock('firebase/app', () => {
  return {
    initializeApp: vi.fn().mockReturnValue({
      // Mocked return values and methods
    }),
    // Add other Firebase services that you use and need to mock
  };
});

vi.mock('firebase/storage', () => {
  return {
    getStorage: vi.fn(),
    // Mock other storage functionalities if necessary
  };
});
