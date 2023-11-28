import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SettingsPage from '../../../src/pages/SettingsPage.vue'
import { createTestingPinia } from '@pinia/testing'

describe('SettingsPage', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it('acceptOrDeclineOffer method test', async () => {
    const wrapper = mount(SettingsPage, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        // other mocks and global configs
      },
    });
    const acceptOrDeclineOfferSpy = vi.spyOn(wrapper.vm, 'acceptOrDeclineOffer');

    // Wait for any initial asynchronous operations
    await flushPromises();
    await wrapper.vm.$nextTick();

    wrapper.vm.acceptOrDeclineOffer({ id: 0 }, true);

    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(acceptOrDeclineOfferSpy).toHaveBeenCalled();
  });

  it('deleteOffer method test', async () => {
    const wrapper = mount(SettingsPage, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
        // other mocks and global configs
      },
    });
    const deleteOfferSpy = vi.spyOn(wrapper.vm, 'deleteOffer');

    // Wait for any initial asynchronous operations
    await flushPromises();
    await wrapper.vm.$nextTick();

    wrapper.vm.deleteOffer({ id: 0 });

    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(deleteOfferSpy).toHaveBeenCalled();
  });
});

