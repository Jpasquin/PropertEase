<template>
  <div class="w-full bg-white">
    <q-toolbar
      class="border-4 border-black bg-white min-w-[400px] max-w-[1200px] flex justify-between"
    >
      <q-btn-toggle v-model="currentFilter.type" class="border-solid border-1 border-black" no-caps rounded
        unelevated toggle-color="black" color="white" text-color="black" :options="[
          { label: 'Buy', value: 'buy' },
          { label: 'Rent', value: 'rent' }
        ]" />

      <div class="scrolling-container" v-if="false">
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
      <q-btn
        no-caps
        color="white"
        outline
        label="Filters"
        icon-left="true"
        @click="prompt = true"
        class="text-medium text-black rounded-lg"
      />
        <q-dialog v-model="prompt" class="rounded-lg">
          <q-card class="rounded-3xl! min-w-[350px]! w-full px-4">
            <q-card-section>
              <div class="text-3xl font-medium">Filters</div>
            </q-card-section>

            <q-card-section>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <q-input
                    outlined
                    color="black"
                    label="City"
                    v-model="newFilter.city"
                  />

                  <q-select
                    clearable
                    outlined
                    color="black"
                    v-model="newFilter.province"
                    :options="provinces"
                    option-value="value"
                    option-label="label"
                    label="Province"
                    class="mt-4"
                  />

                  <div>
                    <div class="mt-4 text-xl font-medium">
                      Price Range
                    </div>

                    <div class="text-lg my-2">
                      {{ newFilter.minMaxPrice.min === 100000 ? 'Less than ' + dataHandling.formatCurrency(newFilter.minMaxPrice.min) : dataHandling.formatCurrency(newFilter.minMaxPrice.min) }}
                      to
                      {{ newFilter.minMaxPrice.max === 1000000 ? dataHandling.formatCurrency(newFilter.minMaxPrice.max) + ' CAD +' : dataHandling.formatCurrency(newFilter.minMaxPrice.max) + ' CAD'}}
                    </div>
                    <q-range
                      color="black"
                      v-model="newFilter.minMaxPrice"
                      :min="100000"
                      :max="1000000"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="right" class="text-primary p-4">
              <q-btn
                flat
                no-caps
                class="bg-[#ededed] text-black rounded-lg py-2! px-4!"
                label="Cancel"
                @click="prompt = false"
              />
              <q-btn
                flat
                no-caps
                class="bg-black text-white rounded-lg py-2! px-4!"
                label="Apply filters"
                @click="applyFilters"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
    </q-toolbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, computed, onMounted } from 'vue';
import useDataHandling from '../services/dataHandling';
import ListingItem from '../components/ListingItem.vue';
import Filter from '../interfaces/filter';

const dataHandling = useDataHandling();

const emits = defineEmits(['filterChange']);
const prompt = ref(false);
const city = ref('');               // city
const province = ref(null);   
const bedrooms = ref(null);             // Bedrooms
const bathrooms = ref(null);            // Bathrooms
const selectedAmenities = ref(null);    // Amenities
const amenitiesOptions = [
  'Hot Tub',
  'Library',
  // Add more amenities options as needed
];

const currentFilter = ref({
  type: 'buy'
})

const newFilter = ref({
  type: currentFilter.value.type,
  minMaxPrice: {
    min: 100000,
    max: 1000000
  }
})

const provinces = ref([
  { label: 'Alberta', value: 'AB' },
  { label: 'British Columbia', value: 'BC' },
  { label: 'Manitoba', value: 'MB' },
  { label: 'New Brunswick', value: 'NB' },
  { label: 'Newfoundland and Labrador', value: 'NL' },
  { label: 'Northwest Territories', value: 'NT' },
  { label: 'Nova Scotia', value: 'NS' },
  { label: 'Nunavut', value: 'NU' },
  { label: 'Ontario', value: 'ON' },
  { label: 'Prince Edward Island', value: 'PE' },
  { label: 'Quebec', value: 'QC' },
  { label: 'Saskatchewan', value: 'SK' },
  { label: 'Yukon', value: 'YT' }
])

const filter = computed(() => {
  return currentFilter.value as Filter;
});

const applyFilters = () => {
  currentFilter.value.city = newFilter.value.city;
  currentFilter.value.province = newFilter.value.province?.value;
  currentFilter.value.minMaxPrice = newFilter.value.minMaxPrice;
  prompt.value = false;
}

watch(filter, (newVal) => {
  emits('filterChange', newVal);
}, { deep: true });

onMounted(() => {
  prompt.value = false;
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

