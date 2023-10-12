<template>
  <q-input
    v-model="text"
    rounded
    outlined
    color="customteal"
    bottom-slots
    label="Search"
    class="rounded absolute top-15% left-35% right-35%"
  >
    <template v-slot:append>
      <q-icon name="close" @click="text = ''" class="cursor-pointer" />
    </template>
  </q-input>
</template>

<script setup lang="ts"></script>
