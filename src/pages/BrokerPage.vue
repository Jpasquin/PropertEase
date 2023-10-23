<template>
  <q-page class="row items-center justify-evenly">
    <broker-listing-list :amount="10" />
  </q-page>
</template>

<script setup lang="ts">
import BrokerListingList from 'components/BrokerListingList.vue';
</script>
