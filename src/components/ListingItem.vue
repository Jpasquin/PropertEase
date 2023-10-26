<template>
  <div
    @click="navigateToListing"
    class="w-full relative cursor-pointer"
  >
    <div class="w-full relative pt-full">
      <div
        class="absolute top-0 left-0 right-0 bottom-0 bg-[#d8d8d8] rounded-[16px]"
      >
        <listing-image
          v-if="!!listing?.id"
          :listingId="listing?.id"
          class="rounded-2xl"
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
import { useRouter } from 'vue-router'; // Import useRouter
import Listing from '../interfaces/listing';
import ListingImage from 'components/ListingImage.vue';

const props = defineProps<{
  listing: any;
}>()

const appStore = useAppStore();

// Get the router instance
const router = useRouter();

// Create the navigation function
const navigateToListing = () => {
  if (props.listing?.id) {
    router.push(`/listing?id=${props.listing.id}`);
  }
};

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
      propertyTitle = 'House in ';
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
</script>
