<template>
  <q-page class="row items-center justify-evenly">
    <div class="p-6 absolute top-0 grid md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <listing-item
        v-for="item in 10"
        :key="item"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ListingItem from 'components/ListingItem.vue';
</script>
