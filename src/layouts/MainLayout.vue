<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="border-4 border-black bg-white">
      <q-toolbar
        class="h-[64px] px-6 min-w-[400px] max-w-[1200px] justify-center sm:justify-start m-auto"
      >
        <div
          class="text-[#2AAA8A] font-bold text-3xl tracking-[-1.5px] cursor-pointer"
          @click="$router.push('/')"
        >
          PropertEase
        </div>

        <div class="absolute right-0 mr-[24px]" v-if="showDiv">
          <q-btn
            v-if="!authStore.isSignedIn"
            flat
            no-caps
            rounded
            class="text-black mr-2 border-solid border-1 border-[#2AAA8A]"
            label="Buy, Sell or Rent a home"
            @click="$router.push('/signin')"
          />

          <q-btn
            v-if="authStore.isSignedIn"
            flat
            no-caps
            round
            class="text-black mr-4 border-solid border-1 border-[#2AAA8A]"
            :label="userInitials ?? ''"
          >
            <q-menu>
              <q-list style="min-width: 200px">
                <q-item
                  v-if="authStore.isBroker"
                  clickable
                  v-close-popup
                  @click="navigateAndReload('/brokers?id=' + authStore?.user?.userId)"
                >
                  <q-item-section>View my Listings</q-item-section>
                </q-item>
                <q-separator />

                <q-item v-if="authStore.isBroker" clickable v-close-popup @click="navigateAndReload('/listing?id=new')">
                  <q-item-section>Add Listing</q-item-section>
                </q-item>
                <q-separator />

                <q-item
                  clickable
                  v-close-popup
                  @click="$router.push('/settings')"
                >
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="authStore.signOutUser">
                  <q-item-section>Sign out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
      <q-separator />
    </q-header>

    <q-page-container class="px-4">
      <router-view />
    </q-page-container>

    <!-- footer -->
    <footer class="bg-gray-100 shadow dark:bg-gray-900">
      <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div
            class="text-[#2AAA8A] font-bold text-3xl tracking-[-1.5px] cursor-pointer"
            @click="$router.push('/')"
          >
            PropertEase
          </div>
          <ul
            class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400"
          >
            <li>
              <div
                class="mr-4 hover:underline md:mr-6 cursor-pointer"
                @click="$router.push('/brokerApp')"
                v-if="!authStore.isBroker"
              >
                Become a Broker
              </div>
            </li>
            <li>
              <div
                class="mr-4 hover:underline md:mr-6 cursor-pointer"
                @click="$router.push('/')"
              >
                About
              </div>
            </li>
            <li>
              <div
                class="mr-4 hover:underline md:mr-6 cursor-pointer"
                @click="$router.push('/')"
              >
                Privacy Policy
              </div>
            </li>
            <li>
              <div
                class="mr-4 hover:underline md:mr-6 cursor-pointer"
                @click="$router.push('/')"
              >
                Licensing
              </div>
            </li>
            <li>
              <div
                class="mr-4 hover:underline md:mr-6 cursor-pointer"
                @click="$router.push('/')"
              >
                Contact
              </div>
            </li>
          </ul>
        </div>
        <hr
          class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8"
        />
        <span
          class="block text-sm text-gray-500 sm:text-center dark:text-gray-400"
          >© 2023 <a href="#" class="hover:underline">PropertEase</a>. All
          Rights Reserved.</span
        >
      </div>
    </footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, defineComponent } from 'vue';
import { useAuthStore } from 'stores/auth';
import FilterSearch from '../components/FilterSearch.vue';
import { useRoute, useRouter } from 'vue-router';
import BrokerApplicationForm from 'src/pages/BrokerApplicationForm.vue';

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore();

const windowWidth = ref(window.innerWidth);

const props = defineProps([]);

const components = defineComponent([BrokerApplicationForm]);

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

const showDiv = computed(() => windowWidth.value > 640);

const userInitials = computed(() => {
  if (authStore.user) {
    return (
      authStore.user.firstName[0] + authStore.user.lastName[0]
    ).toUpperCase();
  }
  return null;
});

const navigateAndReload = async (route) => {
  await router.push(route );
  window.location.reload();
}
const showAppModal = () => {
  showModal = true;
};

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>
