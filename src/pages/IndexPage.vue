<template>
  <q-page>
    <listing-list :amount="10" :filter="filter" />
  </q-page>
</template>

<script setup lang="ts">
import ListingList from 'components/ListingList.vue';
import { reactive } from 'vue';
import Filter from '../interfaces/filter';

const filter: Filter = reactive({
  type: 'buy'
});
</script>
