<template>
  <div class="grid grid-cols-1 gap-4 !min-w-[400px]">
    <div class="text-[#2AAA8A] text-center font-bold text-5xl tracking-[-1.5px] m-auto">
      Forgot your <br> password?
    </div>
    <div class="grid grid-cols-1 gap-2">
      <q-input outlined color="black" label="Email" />

      <q-btn
        flat
        no-caps
        class="h-[48px] rounded-md text-base text-white bg-gradient-to-r from-[#2AAA6A] from-33% via-[#2AAA8A] via-66% to-[#2AAAAA] to-100%"
        label="Reset password"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
