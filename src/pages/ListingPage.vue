<template>
  <q-page class="row items-center justify-evenly">
    <div class="p-6 absolute top-0 w-full grid grid-cols-1 gap-2">
      <div class="font-medium text-[26px] pb-4">
        Luxury home near Old Port, beautiful view

        <div class="font-normal text-base opacity-80"
        >
          {{ dataHandling.propertyTitle(listing?.propertyType, listing?.province, listing?.city) }}
        </div>
      </div>

      <transition-group name="fade" tag="div" class="grid grid-cols-2 gap-2">
        <div
          key="lisingMainImage"
          class="w-full relative cursor-pointer"
        >
          <div class="w-full relative pt-full">
            <div
              class="absolute top-0 left-0 right-0 bottom-0 bg-[#d8d8d8] rounded-l-2xl"
            >
              <listing-image
                v-if="!!listing?.id"
                :listingId="listing?.id"
                class="rounded-l-2xl"
              />
            </div>
          </div>
        </div>

        <div
          key="listingImages"
          class="grid grid-cols-2 gap-2"
        >
          <div
            v-for="(item, index) in 4"
            :key="index"
            class="w-full relative cursor-pointer"
          >
            <div class="w-full relative pt-full">
              <div
                class="absolute top-0 left-0 right-0 bottom-0 bg-[#d8d8d8]"
                :class="index === 3 ? 'rounded-br-2xl' : '' || index === 1 ? 'rounded-tr-2xl' : ''"
              >
                <listing-image
                  v-if="!!listing?.id"
                  :listingId="listing?.id"
                  :imageIndex="index + 1"
                  :class="index === 3 ? 'rounded-br-2xl' : '' || index === 1 ? 'rounded-tr-2xl' : ''"
                />
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <div
        key="listingPrice"
        class="font-medium text-[22px] pt-4"
      >
        {{ dataHandling.formatCurrency(listing?.price) + ' CAD' || 'Price' }}
      </div>

      <q-separator class="my-4" />

      <div class="grid grid-cols-2 gap-8">
        <div>
          <div
            ref="fixedDivRef"
            key="listingDescription"
            class="font-normal text-base pb-2 opacity-80"
          >
            {{ listing?.description }}
          </div>

          <q-separator class="my-4" />

          <div
            key="listingDescription"
            class="font-medium text-[22px] pb-2"
          >
            What this place offers
          </div>
        </div>

        <div>
          <div
            class="fixedDiv"
            :class="fixedStyle"
            style="border: 1px solid rgb(221, 221, 221); border-radius: 12px; padding: 24px; box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;"
          >
            <q-input
              outlined
              v-model="date"
              label="Date"
              mask="date"
              :rules="['date']"
              color="black"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date color="black" v-model="date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="black" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-btn
              flat
              no-caps
              class="h-[48px] w-full mb-4 rounded-md text-base text-white bg-gradient-to-r from-[#2AAA6A] from-33% via-[#2AAA8A] via-66% to-[#2AAAAA] to-100%"
              label="Request a Visit"
            />

            <div
              class="font-normal text-base pb-2 opacity-80"
            >
              Before scheduling a visit, please note that it must be approved by the corresponding broker. 
              Ensure you coordinate appropriately to avoid any inconvenience.
            </div>

            <q-separator class="my-4" />

            <q-input
              outlined
              color="black"
              label="Amount CAD"
              tye="number"
              class="mb-4"
            />

            <q-btn
              flat
              no-caps
              class="h-[48px] w-full mb-4 rounded-md text-base text-white bg-gradient-to-r from-[#2AAA6A] from-33% via-[#2AAA8A] via-66% to-[#2AAAAA] to-100%"
              label="Send an Offer"
            />

            <div 
              class="font-normal text-base pb-2 opacity-80"
            >
              Please exercise caution before submitting an offer to purchase a property. 
              Ensure you've reviewed all details and consulted with a broker or legal advisor.
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from 'stores/app'
import useDataHandling from '../services/dataHandling'
import ListingImage from 'components/ListingImage.vue'

const appStore = useAppStore()
const dataHandling = useDataHandling()
const listing = ref(null)
const fixedDivRef = ref(null)
const date = ref(null)

const shouldBeFixed = ref(false);

const checkScrollPosition = () => {
    // Get the div's position from the top of the page
    const divPosition = fixedDivRef.value.getBoundingClientRect().top;
    
    // Check if the scroll position has reached the div's position
    if (divPosition <= 102) {
        shouldBeFixed.value = true;
    } else {
        shouldBeFixed.value = false;
    }
};

onMounted(async () => {
  window.addEventListener('scroll', checkScrollPosition);
  checkScrollPosition();
  const route = useRoute()
  const router = useRouter()
  // Check if "id" exists and is not empty
  const id = route.query.id
  if (!id || id === '') {
    router.push('/')
  } else {
    listing.value = await appStore.getListing(id);
    if (!listing.value) {
      router.push('/')
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollPosition);
});

const fixedStyle = computed(() => {
  return shouldBeFixed.value ? 'fixed w-full top-[104px]' : 'w-full!';
});
</script>

<style scoped>
/* Define the transition styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Set max-width for screens wider than 556px */
.fixedDiv {
  width: calc(50% - 56px);
  max-width: 556px;
}

/* For screens narrower than 556px, adjust the max-width */
@media screen and (max-width: 1168px) {
  .fixedDiv {
    width: calc(50% - 56px);
    max-width: 556px;
  }
}
</style>

