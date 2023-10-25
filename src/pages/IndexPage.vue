<template>
  <filter-search class="fixed top-[64px] z-[999] py-2" />
  <q-page class="row items-center justify-evenly">
    <listing-list :amount="10" :filter="filter" />
  </q-page>
</template>

<script setup lang="ts">
import ListingList from 'components/ListingList.vue';
import { reactive } from 'vue';
import Filter from '../interfaces/filter';
import FilterSearch from 'components/FilterSearch.vue';

const filter: Filter = reactive({
  type: 'buy'
});
</script>
