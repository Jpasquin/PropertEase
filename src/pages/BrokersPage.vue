<template>
  <q-page class="row justify-evenly">
    <div v-if="!broker && !loadingPage">
      <div class="font-medium my-6 flex justify-center m-auto text-4xl">
        Search for Brokers
      </div>

      <q-input
        outlined
        v-model="searchFilter"
        color="black"
        label="Search"
        icon="search"
        class="my-2 w-full"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <div>
        <broker-list :filter="searchFilter" />
      </div>
    </div>

    <div v-if="broker && !loadingPage">
      <div class="font-medium my-6 flex justify-center m-auto text-4xl">
        {{ broker?.firstName }}'s Listings
      </div>
      <broker-listing-list :brokerId="broker?.id" />
      <div
        class="w-full grid grid-cols-1 gap-4"
        style="
          border: 1px solid rgb(221, 221, 221);
          border-radius: 12px;
          padding: 24px;
          box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;"
      >
        <div class="font-medium text-4xl">
          <q-icon name="info" class="mb-[4px]" />
          Information
        </div>

        <div class="grid">
          <span class="opacity-70">Name</span>
          <div class="text-xl mb-1">
            {{ broker?.firstName }}
            {{ broker?.lastName }}
          </div>

          <span class="opacity-70">Email</span>
          <div class="text-xl mb-1">
            {{ broker?.email }}
          </div>

          <span class="opacity-70">Phone</span>
          <div class="text-xl mb-1">
            {{formatPhoneNumber(broker?.phone) }}
          </div>

          <span class="opacity-70">Agency</span>
          <div class="text-xl mb-1">
            {{ broker?.agency }}
          </div>

          <span class="opacity-70">License number</span>
          <div class="text-xl mb-1">
            #{{ broker?.license }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from 'stores/app';
import BrokerList from 'components/BrokerList.vue';
import BrokerListingList from 'components/BrokerListingList.vue';

const route = useRoute();
const appStore = useAppStore();
const loadingPage = ref(false)
const searchFilter = ref('');
const broker = ref(null)

const formatPhoneNumber = (phoneNumber) => {
  // Check if the input is already a formatted phone number
  if (/^\d{3}-\d{3}-\d{4}$/.test(phoneNumber)) {
    return phoneNumber;
  }

  // Remove all non-digits
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
  // Check if the cleaned number has the length of 10 digits
  if (cleaned.length === 10) {
    // Split the string into parts and join with a hyphen
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  // If the number doesn't match the expected format, return the original
  return phoneNumber;
}

const checkBroker = async () => {
  const id = route.query.id;
  if (id) {
    try {
      // Make an API call to get the broker by ID
      const broker = await appStore.getBroker(id);
      return broker; // This will return the broker object if found
    } catch (error) {
      console.error(error);
      return null; // Return null if there was an error or if the broker was not found
    }
  } else {
    return null; // Return null if no ID was provided
  }
};

onMounted(async () => {
  loadingPage.value = true
  // If there is an "id" query parameter, try to fetch the broker.
  broker.value = await checkBroker();
  console.log(broker.value)
  loadingPage.value = false
});
</script>

