<template>
  <div class="grid grid-cols-1 gap-4 min-w-[400px]">
    <div
      class="text-[#2AAA8A] font-bold text-5xl tracking-[-1.5px] m-auto cursor-pointer"
      @click="$router.push('/')"
    >
      PropertEase
    </div>

    <div class="grid grid-cols-1 gap-2">
      <q-input
        outlined
        color="black"
        label="Email"
        v-model="email"
      />
      <q-input
        outlined
        color="black"
        label="Password"
        type="password"
        v-model="password"
      />

      <q-checkbox
        color="black"
        label="Remember me?"
        v-model="rememberUser"
      />

      <q-btn
        flat
        no-caps
        class="h-[48px] rounded-md text-base text-white bg-gradient-to-r from-[#2AAA6A] from-33% via-[#2AAA8A] via-66% to-[#2AAAAA] to-100%"
        label="Sign in"
        @click="onSignIn"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'stores/auth';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const rememberUser = ref(false);

const onSignIn = () => {
  authStore.signInUser(email, password);
}
</script>
