<template>
  <q-page>
    <filter-search
      @filterChange="handleFilterChange"
      class="pt-2"
    />
    <listing-list :amount="10" :filter="filter" />
  </q-page>
</template>

<script setup lang="ts">
import ListingList from 'components/ListingList.vue';
import { ref } from 'vue';
import FilterSearch from 'components/FilterSearch.vue';

const filter = ref({
  type: 'buy'
});

const handleFilterChange = (newFilter) => {
  console.log(newFilter)
  filter.value = newFilter;
}
</script>
