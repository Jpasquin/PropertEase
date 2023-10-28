import { defineStore } from 'pinia'

export const useMockAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      userId: '123',
      firstName: 'Test',
      lastName: 'User',
    },
  }),
})
