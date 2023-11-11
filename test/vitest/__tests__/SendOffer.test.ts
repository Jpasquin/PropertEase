import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ListingPage from '../../../src/pages/ListingPage.vue'
import { createTestingPinia } from '@pinia/testing'

describe('ListingPage', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it('ensures Application is not empty', async () => {
    const wrapper = mount(ListingPage, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        // other mocks and global configs
      },
    });
    const submitOfferSpy = vi.spyOn(wrapper.vm, 'submitOffer');

    // Wait for any initial asynchronous operations
    await flushPromises();
    await wrapper.vm.$nextTick();

    // Broker
    wrapper.vm.brokerFName = 'John';
    wrapper.vm.brokerLName = 'Doe';
    wrapper.vm.brokerLicense = '1234-ABCD';
    wrapper.vm.brokerAgency = 'Doe Agency';
    // Buyer
    wrapper.vm.buyerFName = 'Jane';
    wrapper.vm.buyerLName = 'Doe';
    wrapper.vm.buyerEmail = 'jane@doe.com';
    wrapper.vm.buyerPrice = 100000;
    wrapper.vm.dateSale = '2023/11/22';
    wrapper.vm.dateOccupy = '2023/11/22';
    wrapper.vm.submitOffer();

    await flushPromises();
    await wrapper.vm.$nextTick();

    // Assert that all fields are set correctly
    expect(wrapper.vm.brokerFName).toBe('John');
    expect(wrapper.vm.brokerLName).toBe('Doe');
    expect(wrapper.vm.brokerLicense).toBe('1234-ABCD');
    expect(wrapper.vm.brokerAgency).toBe('Doe Agency');
    expect(wrapper.vm.buyerFName).toBe('Jane');
    expect(wrapper.vm.buyerLName).toBe('Doe');
    expect(wrapper.vm.buyerEmail).toBe('jane@doe.com');
    expect(wrapper.vm.buyerPrice).toBe(100000);
    expect(wrapper.vm.dateSale).toBe('2023/11/22');
    expect(wrapper.vm.dateOccupy).toBe('2023/11/22');
    expect(submitOfferSpy).toHaveBeenCalled();
  });
});

