<template>
  <q-img
    no-spinner
    v-if="!!listingId"
    :src="currentImageUrl[imageIndex || 0]"
    alt="Listing Image"
    class="absolute inset-0 object-cover w-full h-full"
    ratio="1x1"
    @error="handleImageError"
  />
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
import { useAppStore } from 'stores/app'

const props = defineProps<{
  listingId: string;
  imageIndex?: any;
}>()

const appStore = useAppStore()

// Define the base image URL without extension
const baseImageUrl = computed(() => 
  `${appStore.getImageURL}listings-images%2F${props.listingId}`
);

// Possible image formats in the order of preference
const imageFormats = ['webp', 'jpeg', 'png'];
const formatIndex = ref(0);

const currentImageUrl = computed(() => {
  const url = []
  for (let i = 1; i <= 5; i++) {
    url.push(`${baseImageUrl.value}-0${i}.${imageFormats[formatIndex.value]}?alt=media`)
  }
  return url
});

function handleImageError(error) {
  if (formatIndex.value < imageFormats.length - 1) {
    formatIndex.value++; // Try the next format
  } else {
    // Couldnt load images
  }
}
</script>
