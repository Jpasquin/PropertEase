<template>
  <q-toolbar class="border-4 border-black bg-white h-[75px] px-6 min-w-[400px] max-w-[1800px] justify-center sm:justify-start
    m-auto " style="border-bottom: 1px solid #e9e9e9">
    <q-btn-toggle v-model="type" class="my-custom-toggle border-solid border-1 border-black mr-[10px]" no-caps rounded
      unelevated toggle-color="black" color="white" text-color="black" :options="[
        { label: 'Buy', value: 'buy' },
        { label: 'Rent', value: 'rent' }
      ]" />
    <q-input type="text" v-model="location" rounded outlined color="customteal" bottom-slots label="Location"
      class="rounded mt-20px mr-10px">
      <template v-slot:append>
        <q-icon name="close" @click="location = ''" class="cursor-pointer" />
      </template>
    </q-input>
    <div class="scrolling-container">
      <!-- Content goes here -->
      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>


      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>

      <div class="flex-col items-center inline-flex mx-10px">
        <q-btn flat round color="black" icon="card_giftcard" />
        <div>Condo</div>
      </div>




    </div>
    <q-btn color="white" outline label="Filters" icon-left="true" @click="prompt = true"
      class="flex ml-[10px] my-[10px] h-[25px] text-black justify-center items-center" />
    <q-dialog v-model="prompt" persistent>


      <!-- Price filter -->
      <q-input v-model="minPrice" type="number" rounded outlined color="customteal" label="Min Price"
        class="rounded absolute top-15% left-13%"></q-input>
      <q-input v-model="maxPrice" type="number" rounded outlined color="customteal" label="Max Price"
        class="rounded absolute top-15% left-24%"></q-input>

      <!-- Bedrooms & Bathrooms filter -->
      <q-input v-model="bedrooms" type="number" rounded outlined color="customteal" label="Bedrooms"
        class="rounded absolute top-60% left-35%"></q-input>
      <q-input v-model="bathrooms" type="number" rounded outlined color="customteal" label="Bathrooms"
        class="rounded absolute top-60% left-65%"></q-input>

      <!-- Amenities filter -->
      <q-select v-model="selectedAmenities" :options="amenitiesOptions" outlined label="Amenities" multiple
        color="customteal" class="rounded absolute top-75% left-35% right-35%">
        <template v-slot:prepend>
          <q-icon name="done_all" />
        </template>
      </q-select>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Filter</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="address" autofocus @keyup.enter="prompt = false" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Add address" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-toolbar>




  <!---->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ListingItem from '../components/ListingItem.vue';

const prompt = ref(false);
const type = ref('buy');
const location = ref('');               // Location
const minPrice = ref(null);             // Minimum price
const maxPrice = ref(null);             // Maximum price
const bedrooms = ref(null);             // Bedrooms
const bathrooms = ref(null);            // Bathrooms
const selectedAmenities = ref(null);    // Amenities
const amenitiesOptions = [
  'Hot Tub',
  'Library',
  // Add more amenities options as needed
];
/*

      */
onMounted(() => {
  const prompt = false;
});
</script>

<style scoped>
.scrolling-container {
  width: 100%;
  overflow-x: scroll;
  white-space: nowrap;
  /* Hide the horizontal scroll bar */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* Internet Explorer and Microsoft Edge */
}

/* Hide the horizontal scroll bar for WebKit browsers (Chrome, Safari) */
.scrolling-container::-webkit-scrollbar {
  display: none;
}
</style>

