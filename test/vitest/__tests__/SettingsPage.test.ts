import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SettingsPage from '../../../src/pages/SettingsPage.vue'
import { createTestingPinia } from '@pinia/testing'
import { useMockAuthStore } from '../__tests__/stores/mockAuthStore'

describe('SettingsPage', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    useMockAuthStore()
  })

  it('updates userChanges on input', async () => {
    const wrapper = mount(SettingsPage, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    })

    // Access the input elements using refs
    const firstNameInput = wrapper.vm.$refs.firstNameInput
    const lastNameInput = wrapper.vm.$refs.lastNameInput
    
    if (firstNameInput && lastNameInput) {
      // Access the DOM element
      const firstNameInputElement = firstNameInput.$el || firstNameInput.element
      const lastNameInputElement = lastNameInput.$el || lastNameInput.element
    
      // Set the value
      await firstNameInputElement.setValue('John')
      await lastNameInputElement.setValue('Doe')
    
      expect(wrapper.vm.userChanges.firstName).toBe('John')
      expect(wrapper.vm.userChanges.lastName).toBe('Doe')
    } else {
      throw new Error('Refs not found')
    }
  })
})
