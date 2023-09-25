<template>
  <div class="grid grid-cols-1 gap-4 min-w-[400px]">
    <div class="text-[#2AAA8A] font-bold text-5xl tracking-[-1.5px] m-auto">
      Create an account
    </div>

    <div class="grid grid-cols-1 gap-2">
      <q-input
        outlined
        color="black"
        label="First name"
        v-model="userData.firstName"
      />

      <q-input
        outlined
        color="black"
        label="Last name"
        v-model="userData.lastName"
      />

      <q-splitter class="py-2" horizontal />

      <q-input outlined color="black" label="Email" v-model="userData.email" />

      <q-input
        outlined
        color="black"
        label="Password"
        type="password"
        v-model="password"
      />

      <q-input
        outlined
        color="black"
        label="Confirm password"
        type="password"
        v-model="confirmPassword"
      />

      <q-checkbox
        color="black"
        label="I accept the Terms of Service and Privacy Policy"
        v-model="agreeTermsAndPolicy"
      />

      <q-btn
        flat
        no-caps
        class="h-[48px] rounded-md text-base text-white bg-gradient-to-r from-[#2AAA6A] from-33% via-[#2AAA8A] via-66% to-[#2AAAAA] to-100%"
        label="Create account"
        @click="onCreateAccount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'stores/auth';
import UserInterface from '../interfaces/user';
const authStore = useAuthStore();

const userData: User = ref({
  firstName: '',
  lastName: '',
  email: '',
});

const password = ref('');
const confirmPassword = ref('');
const agreeTermsAndPolicy = ref(false);

const onCreateAccount = async () => {
  authStore.createUser(userData.value, password.value);
};
</script>
