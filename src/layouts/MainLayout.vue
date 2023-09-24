<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="border-4 border-black"
      style="border-bottom: 1px solid #e9e9e9;"
    >
      <q-toolbar class="bg-white h-[80px] px-6">
        <div
          class="text-[#2AAA8A] font-bold text-3xl tracking-[-1.5px] cursor-pointer"
          @click="$router.push('/')"
        >
          PropertEase
        </div>

        <div class="absolute right-0 mr-[24px]">
          <q-btn flat no-caps rounded class="text-black mr-2 border-solid border-1 border-[#2AAA8A]" label="Buy, Sell or Rent a home" 
            @click="$router.push('/signin')"
          />
          <!--<q-btn
            outline
            no-caps
            class="text-[#2AAA8A] rounded-md py-2"
            label="Sign in"
          />-->
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>
