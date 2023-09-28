<template>
  <div class="w-full relative cursor-pointer">
    <div class="w-full relative pt-full">
      <div
        class="absolute top-0 left-0 right-0 bottom-0 bg-[#d8d8d8] rounded-[16px]"
      >
        <q-img
          no-spinner
          v-if="!!listing?.id"
          :src="propertyImageUrl"
          alt="Listing Image"
          class="absolute inset-0 object-cover w-full h-full rounded-[16px]"
          ratio="1x1"
        />
      </div>
    </div>

    <div class="h-30 w-full">
      <div
        class="mt-4 rounded-[4px] h-[16px] w-[50%]"
        :class="!!listing?.propertyType ? 'text-[16px] font-medium whitespace-nowrap' :'animate-pulse bg-[#d8d8d8]'"
      >
        <span v-if="!!listing?.propertyType">
          {{ propertyTitle(listing.propertyType) }}
        </span>
      </div>

      <div
        class="mt-2 rounded-[4px] h-[16px] w-[40%]"
        :class="!!listing?.description ? 'text-md whitespace-nowrap opacity-60' :'animate-pulse bg-[#d8d8d8]'"
      >
        <span v-if="!!listing?.description">
          {{ propertyDescription(listing.description) }}
        </span>
      </div>

      <div
        class="mt-2 rounded-[4px] h-[16px] w-[20%]"
        :class="!!listing?.bedrooms ? 'text-md whitespace-nowrap opacity-60' :'animate-pulse bg-[#d8d8d8]'"
      >
        <span v-if="!!listing?.bedrooms" class="material-symbols-outlined">
          <span class="pr-1">{{ listing.bedrooms }}</span> <q-icon name="bed" />
          <div class="mx-1" >•</div>
          <span class="pr-1">{{ listing.baths }}</span> <q-icon name="bathtub"></q-icon>
        </span>
      </div>

      <div
        class="mt-2 rounded-[4px] h-[16px] w-[40%]"
        :class="!!listing?.price ? 'text-[16px] font-medium whitespace-nowrap' :'animate-pulse bg-[#d8d8d8]'"
      >
        <span v-if="!!listing?.price">
          {{ formatCurrency(listing.price) }} CAD
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, computed } from 'vue';
import { useAppStore } from 'stores/app';
import Listing from '../interfaces/listing';

const props = defineProps<{
  listing: any;
}>()

const appStore = useAppStore();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
  }).format(value);
}

const propertyTitle = (propertyType: string) => {
  let propertyTitle;
  switch (propertyType) {
    case 'condo':
      propertyTitle = 'Condo in ';
      break;
    case 'house':
      propertyTitle = 'Home in ';
      break;
    default:
      propertyTitle = 'Home in ';
      break;
  }
  return propertyTitle + props.listing?.city.charAt(0).toUpperCase() + props.listing?.city.slice(1) + ', ' + props.listing?.province.toUpperCase();
}

const propertyDescription = (description: string) => {
  if (description.length <= 37) {
      return description;
  }
  return description.substr(0, 34) + '...';
}

const propertyImageUrl = computed(() => 'https://firebasestorage.googleapis.com/v0/b/propertease-5ff7d.appspot.com/o/listings-images%2F'
    + props.listing?.id
    + '-01'
    + '.webp?alt=media');
</script>
