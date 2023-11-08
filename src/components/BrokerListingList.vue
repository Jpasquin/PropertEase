<template>
  <div class="p-6 pt-0 top-0 w-full">
    <transition-group name="fade" tag="div" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <listing-item v-for="(item, index) in listAmount" :key="index" :listing="listings[index]" />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAppStore } from 'stores/app';
import { useAuthStore } from 'stores/auth';

import ListingItem from 'components/ListingItem.vue';

const props = defineProps<{
  brokerId: string;
}>()

const appStore = useAppStore();
const authStore = useAuthStore();
const listings = ref([]);
const listAmount = ref(null);
const userToken = ref('');

onMounted(async () => {
  listings.value = await appStore.getListingsBroker(props.brokerId);
  listAmount.value = listings.value.length;
})
</script>

<style scoped>
/* Define the transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}
</style>
