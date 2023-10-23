<template>
  <q-page class="row items-center justify-evenly">
    <q-tab-panels animated v-model="selectedPanel">
      <q-tab-panel name="signin">
        <login-form />

        <div class="text-center pt-2">
          <div class="cursor-pointer" @click="selectedPanel = 'forgotpassword'">
            <span class="opacity-60">Having trouble signing in? &nbsp;</span>
            <span class="font-bold text-[#2AAA8A]">Reset your password</span>
          </div>

          <q-splitter class="py-2" horizontal />

          <div class="cursor-pointer" @click="selectedPanel = 'createaccount'">
            <span class="opacity-60">Don't have an account? &nbsp;</span>
            <span class="font-bold text-[#2AAA8A]">Sign up</span>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="createaccount">
        <create-account-form />

        <div class="text-center pt-2">
          <div class="cursor-pointer" @click="selectedPanel = 'signin'">
            <span class="opacity-60">Already have an account? &nbsp;</span>
            <span class="font-bold text-[#2AAA8A]">Sign in here</span>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="forgotpassword">
        <forgot-password-form />

        <div class="text-center pt-2">
          <div class="cursor-pointer" @click="selectedPanel = 'signin'">
            <span class="opacity-60">Remember your password? &nbsp;</span>
            <span class="font-bold text-[#2AAA8A]">Sign in here</span>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'stores/auth';

import LoginForm from 'components/LoginForm.vue';
import ForgotPasswordForm from 'components/ForgotPasswordForm.vue';
import CreateAccountForm from 'components/CreateAccountForm.vue';

const selectedPanel = ref('signin');
const authStore = useAuthStore();
</script>
