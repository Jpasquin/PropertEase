import { describe, it, expect, beforeEach, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import BrokerList from '../../../src/components/BrokerList.vue';
import { createTestingPinia, TestingPinia } from '@pinia/testing';

describe('BrokerList', () => {
  let pinia: TestingPinia;

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn, // Configure createSpy with vi.fn
    });

    vi.mock('../../../src/stores/app', () => {
      return {
        useAppStore: vi.fn().mockReturnValue({
          getBrokers: vi.fn().mockResolvedValue([
            { id: 0, firstName: 'Jonathan', lastName: 'Pasquin', email: 'test@gmail.com' },
            { id: 1, firstName: 'Youssef', lastName: 'Ouaaka', email: 'youssef@gmail.com' }
          ])
        })
      }
    });
  });

  it('ensures Search input is working', async () => {
    const wrapper = mount(BrokerList, {
      global: {
        plugins: [pinia],
        // other mocks and global configs
      },
    });

    // Wait for the component to finish loading brokers
    await flushPromises();
    await wrapper.vm.$nextTick();
    await wrapper.setProps({ filter: '' });
    
    // Assuming initial length is 2 based on the mocked data
    expect(wrapper.vm.filteredBrokers.length).toBe(2);

    // Change searchFilter
    await wrapper.setProps({ filter: 'Jonathan' });

    // Wait for the DOM to update
    await flushPromises();
    await wrapper.vm.$nextTick();

    // Assert that filteredBrokers length has changed
    expect(wrapper.vm.filteredBrokers.length).toBe(1);
  });
});
