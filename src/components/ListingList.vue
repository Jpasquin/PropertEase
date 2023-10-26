<template>
  <div class="p-6 relative w-full mb-100px">
    <transition-group
      name="fade"
      tag="div"
      class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <listing-item
        v-for="(item, index) in listAmount"
        :key="index"
        :listing="listings[index]"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAppStore } from 'stores/app';
import Filter from '../interfaces/filter';
import ListingItem from 'components/ListingItem.vue';

const props = defineProps<{
  amount: number;
  filter: Filter;
}>();

const appStore = useAppStore();
const listings = ref([]);
const listAmount = ref(props.amount);

const getListings = async () => {
  listings.value = await appStore.getListings(props.filter);
  listAmount.value = listings.value.length;
};

onMounted(getListings);

watch(() => props.filter, getListings, { deep: true });
</script>

<style scoped>
/* Define the transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
