<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="border-4 border-black bg-white" style="border-bottom: 1px solid #e9e9e9">
      <q-toolbar class="h-[80px] px-6 min-w-[400px] max-w-[1800px] justify-center sm:justify-start m-auto">
        <div class="text-[#2AAA8A] font-bold text-3xl tracking-[-1.5px] cursor-pointer" @click="$router.push('/')">
          PropertEase
        </div>

        <FilterSearch />

        <div class="absolute right-0 mr-[24px]" v-if="showDiv">
          <q-btn v-if="!authStore.isSignedIn" flat no-caps rounded
            class="text-black mr-2 border-solid border-1 border-[#2AAA8A]" label="Buy, Sell or Rent a home"
            @click="$router.push('/signin')" />

          <q-btn v-if="authStore.isSignedIn" flat no-caps round
            class="text-black mr-2 border-solid border-1 border-[#2AAA8A]" :label="userInitials ?? ''">
            <q-menu>
              <q-list style="min-width: 200px">
                <q-item clickable v-close-popup @click="$router.push('/settings')">
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="authStore.signOutUser">
                  <q-item-section>Sign out</q-item-section>
                </q-item>
                <q-separator />
                <q-item v-if="authStore.isBroker" clickable v-close-popup @click="$router.push('/broker')">
                  <q-item-section>View my Listings</q-item-section>
                </q-item>
                <q-item v-if="authStore.isBroker" clickable v-close-popup @click="$router.push('/add')">
                  <q-item-section>Add Listing</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <q-footer v-if="!showDiv" class="border-4 border-black bg-white" style="border-top: 1px solid #e9e9e9">
          <q-toolbar class="h-[80px] px-6 min-w-[400px] m-auto text-black">
          </q-toolbar>
        </q-footer>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useAuthStore } from 'stores/auth';
import FilterSearch from '../components/FilterSearch.vue';

const authStore = useAuthStore();

const windowWidth = ref(window.innerWidth);

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

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>
