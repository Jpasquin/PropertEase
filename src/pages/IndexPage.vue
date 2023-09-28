<template>
  <q-page class="row items-center justify-evenly">
    <listing-list :amount="10" />
  </q-page>
</template>

<script setup lang="ts">
import ListingList from 'components/ListingList.vue';
</script>
