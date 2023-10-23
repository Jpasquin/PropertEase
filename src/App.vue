<template>
  <div class="min-w-[400px] max-w-[1200px] m-auto">
    <router-view v-if="!isLoading" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from 'stores/auth';
import { ref, onBeforeMount } from 'vue';

const authStore = useAuthStore();
const isLoading = ref(true);

onBeforeMount(async () => {
  await authStore.initializeAuth();
  isLoading.value = false;
});
</script>

<style>
.q-field--outlined .q-field__control {
  border-radius: 8px !important;
}
</style>
