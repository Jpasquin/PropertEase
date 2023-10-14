<template>
  <!-- switch search to searchQuery? -->
  <q-input
    type="text"
    v-model="search"
    rounded
    outlined
    color="customteal"
    bottom-slots
    label="Search a city"
    class="rounded absolute top-15% left-35% right-35%"
  >
    <template v-slot:append>
      <q-icon name="close" @click="search = ''" class="cursor-pointer" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ListingItem from '../components/ListingItem.vue';
</script>
