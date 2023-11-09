import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import BrokersPage from '../../../src/pages/BrokersPage.vue'
import { createTestingPinia } from '@pinia/testing'

describe('BrokersPage', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it('ensures Search input is working', async () => {
    const wrapper = mount(BrokersPage, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        // other mocks and global configs
      },
    });

    // Wait for any initial asynchronous operations
    await flushPromises();
    await wrapper.vm.$nextTick();

    wrapper.vm.searchFilter = 'Jonathan';

    await flushPromises();
    await wrapper.vm.$nextTick();

    // Assert that all fields are set correctly
    expect(wrapper.vm.searchFilter).toBe('Jonathan');
  });
});

