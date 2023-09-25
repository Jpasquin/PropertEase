<template>
  <router-view v-if="!isLoading" />
</template>


<script setup lang="ts">
import { useAuthStore } from 'stores/auth';
import { ref, onBeforeMount } from 'vue'

const authStore = useAuthStore();
const isLoading = ref(true);

onBeforeMount(async () => {
  await authStore.initializeAuth();
  isLoading.value = false;
})
</script>
