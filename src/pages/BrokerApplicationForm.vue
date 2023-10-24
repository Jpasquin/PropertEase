<template>
  <q-page class="login-page row items-center justify-evenly">
    <div class="grid grid-cols-1 gap-4 min-w-[400px]">
      <div class="text-[#2AAA8A] font-bold text-5xl tracking-[-1.5px] m-auto">
        Become a Broker
      </div>

      <div class="grid grid-cols-1 gap-2">
        <q-input
          outlined
          color="black"
          label="First name"
          v-model="application.firstName"
        />

        <q-input
          outlined
          color="black"
          label="Last name"
          v-model="application.lastName"
        />

        <q-input
          outlined
          color="black"
          label="Email"
          v-model="application.email"
        />

        <q-btn
          flat
          no-caps
          class="h-[48px] rounded-md text-base text-white bg-gradient-to-r from-[#2AAA6A] from-33% via-[#2AAA8A] via-66% to-[#2AAAAA] to-100%"
          label="Create account"
          @click="submitApplication"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BrokerApp from 'src/interfaces/brokerApp';
import { useAuthStore } from 'src/stores/auth';
import { reactive, ref } from 'vue';
const authStore = useAuthStore();

const application: BrokerApp = reactive({
  firstName: '',
  lastName: '',
  email: '',
});

const submitApplication = async () => {
  authStore.createApp(application);
};
</script>
