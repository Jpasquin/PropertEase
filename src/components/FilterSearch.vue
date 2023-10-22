<template>
  <!-- Location filter -->
  <q-input
    type="text"
    v-model="location"
    rounded
    outlined
    color="customteal"
    bottom-slots
    label="Location"
    class="rounded absolute top-15% left-35% right-35%"
  >
    <template v-slot:append>
      <q-icon name="close" @click="location = ''" class="cursor-pointer" />
    </template>
  </q-input>

  <!-- Price filter -->
  <q-input
      v-model="minPrice"
      type="number"
      rounded
      outlined
      color="customteal"
      label="Min Price"
      class="rounded absolute top-15% left-13%"
    ></q-input>
  <q-input
      v-model="maxPrice"
      type="number"
      rounded
      outlined
      color="customteal"
      label="Max Price"
      class="rounded absolute top-15% left-24%"
    ></q-input>

    <!-- Bedrooms & Bathrooms filter -->
    <q-input
      v-model="bedrooms"
      type="number"
      rounded
      outlined
      color="customteal"
      label="Bedrooms"
      class="rounded absolute top-60% left-35%"
    ></q-input>
    <q-input
      v-model="bathrooms"
      type="number"
      rounded
      outlined
      color="customteal"
      label="Bathrooms"
      class="rounded absolute top-60% left-65%"
    ></q-input>

    <!-- Amenities filter -->
    <q-select
      v-model="selectedAmenities"
      :options="amenitiesOptions"
      outlined
      label="Amenities"
      multiple
      color="customteal"
      class="rounded absolute top-75% left-35% right-35%"
    >
      <template v-slot:prepend>
        <q-icon name="done_all" />
      </template>
    </q-select>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ListingItem from '../components/ListingItem.vue';

const location = ref('');               // Location
const minPrice = ref(null);             // Minimum price 
const maxPrice = ref(null);             // Maximum price 
const bedrooms = ref(null);             // Bedrooms 
const bathrooms = ref(null);            // Bathrooms 
const selectedAmenities = ref(null);    // Amenities 
const amenitiesOptions = [
  'Hot Tub',
  'Library',
  // Add more amenities options as needed
];
</script>
