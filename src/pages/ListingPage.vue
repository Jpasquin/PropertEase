<template>
  <q-page>
    <div class="p-6 top-0 w-full grid grid-cols-1 gap-2">
      <div class="font-medium text-[26px] pb-4">
        <span v-if="!isAssociatedBroker">
          {{ listing.title }}
        </span>

        <q-input
          v-if="isAssociatedBroker"
          outlined
          color="black"
          label="Title"
          class="mb-4 text-xl"
          v-model="listing.title"
        />

        <div
          v-if="!isAssociatedBroker"
          class="font-normal text-base opacity-80"
        >
          {{
            dataHandling.propertyTitle(
              listing?.propertyType,
              listing?.province,
              listing?.city
            )
          }}
        </div>
      </div>

      <transition-group name="fade" tag="div" class="grid grid-cols-2 gap-2">
        <div
          key="listingMainImage"
          class="w-full relative cursor-pointer image-container"
        >
          <div class="w-full relative pt-full">
            <div
              v-if="isAssociatedBroker || route.query.id === 'new'"
              class="remove-btn"
            >
              X
            </div>
            <!-- Added remove button -->
            <div
              @click="triggerFileUpload(0)"
              class="absolute top-0 left-0 right-0 bottom-0 bg-[#d8d8d8] rounded-l-2xl"
              :class="isAssociatedBroker ? 'hover:opacity-50' : ''"
            >
              <listing-image
                v-if="
                  (!!listing?.id && !imagesToDelete[0]) ||
                  selectedImagesDataUrl[0]
                "
                :listingId="listing?.id"
                :src="selectedImagesDataUrl[0]"
                class="rounded-l-2xl"
              />
            </div>
          </div>
        </div>

        <div key="listingImages" class="grid grid-cols-2 gap-2">
          <div
            v-for="(item, index) in 4"
            :key="index"
            class="w-full relative cursor-pointer image-container"
          >
            <div class="w-full relative pt-full">
              <div
                v-if="isAssociatedBroker || route.query.id === 'new'"
                class="remove-btn"
              >
                X
              </div>
              <!-- Added remove button -->
              <div
                @click="triggerFileUpload(index + 1)"
                class="absolute top-0 left-0 right-0 bottom-0 bg-[#d8d8d8]"
                :class="
                  index === 3
                    ? 'rounded-br-2xl' + isAssociatedBrokerOpacity
                    : '' + isAssociatedBrokerOpacity || index === 1
                    ? 'rounded-tr-2xl' + isAssociatedBrokerOpacity
                    : '' + isAssociatedBrokerOpacity
                "
              >
                <listing-image
                  v-if="
                    (!!listing?.id && !imagesToDelete[index + 1]) ||
                    selectedImagesDataUrl[index + 1]
                  "
                  :listingId="listing?.id"
                  :imageIndex="index + 1"
                  :src="selectedImagesDataUrl[index + 1]"
                  :class="
                    index === 3
                      ? 'rounded-br-2xl'
                      : '' || index === 1
                      ? 'rounded-tr-2xl'
                      : ''
                  "
                />
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <div key="listingPrice" class="font-medium text-[26px] pt-4 flex">
        {{ dataHandling.formatCurrency(listing?.price) + ' CAD' || 'Price' }}
        <span v-if="isAssociatedBroker">
          <q-btn dense flat icon="edit">
            <q-popup-edit
              v-model="listing.price"
              title="Price"
              color="black"
              buttons
              persistent
              v-slot="scope"
            >
              <q-input
                color="black"
                v-model="scope.value"
                type="number"
                dense
                autofocus
              />
            </q-popup-edit>
          </q-btn>
        </span>

        <div v-if="isAssociatedBroker" class="flex">
          <q-input
            dense
            outlined
            color="black"
            label="City"
            class="ml-4 mb-4 float-left"
            v-model="listing.city"
          />

          <q-select
            dense
            outlined
            color="black"
            v-model="listing.province"
            :options="provinces"
            option-value="value"
            option-label="label"
            label="Province"
            class="mb-4 ml-4"
          />

          <q-input
            dense
            outlined
            color="black"
            label="Bedrooms"
            type="number"
            class="ml-4 mb-4 float-left"
            v-model="listing.bedrooms"
          />

          <q-input
            dense
            outlined
            color="black"
            label="Baths"
            type="number"
            class="ml-4 mb-4 float-left"
            v-model="listing.baths"
          />
        </div>
      </div>

      <q-separator class="my-4" />

      <div class="grid grid-cols-2 gap-8">
        <div ref="fixedDivRef">
          <div
            v-if="!isAssociatedBroker"
            key="listingDescription"
            class="font-normal text-base pb-2 opacity-80"
          >
            {{ listing?.description }}
          </div>

          <q-input
            v-if="isAssociatedBroker"
            outlined
            autogrow
            color="black"
            label="Description"
            class="mb-4 text-base"
            v-model="listing.description"
          />

          <q-separator class="my-4" v-if="!isAssociatedBroker" />

          <div
            key="listingDetails"
            v-if="!isAssociatedBroker"
            class="font-medium text-[22px] pb-2"
          >
            What this place offers
          </div>
        </div>

        <div v-if="isAssociatedBroker" class="grid grid-cols-2 gap-2">
          <q-btn
            flat
            no-caps
            class="h-[48px] w-full rounded-md text-base text-black bg-[#ededed]"
            label="Cancel"
            @click="router.back()"
          />

          <q-btn
            flat
            no-caps
            class="h-[48px] w-full rounded-md text-base text-white bg-gradient-to-r from-[#2AAA6A] from-33% via-[#2AAA8A] via-66% to-[#2AAAAA] to-100%"
            label="Save Changes"
            :loading="saving"
            @click="saveChanges"
          />

          <q-btn
            v-if="route.query.id !== 'new'"
            outline
            no-caps
            color="red"
            class="col-span-2 h-[48px] w-full rounded-md text-base"
            label="Remove Listing"
            @click="removeListing"
          />
        </div>

        <div v-if="!isAssociatedBroker">
          <div
            class="fixedDiv"
            :class="fixedStyle"
            style="
              border: 1px solid rgb(221, 221, 221);
              border-radius: 12px;
              padding: 24px;
              box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
            "
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
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
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
              :label="visitSent ? 'Request Sent!' : 'Request a Visit'"
              @click="requestVisit"
              :loading="visitLoading"
              :disabled="visitSent"
            />

            <div class="font-normal text-base pb-2 opacity-80">
              Before scheduling a visit, please note that it must be approved by
              the corresponding broker. Ensure you coordinate appropriately to
              avoid any inconvenience.
            </div>

            <q-separator class="my-4" />

            <q-btn
              flat
              no-caps
              class="h-[48px] w-full mb-4 rounded-md text-base text-white bg-gradient-to-r from-[#2AAA6A] from-33% via-[#2AAA8A] via-66% to-[#2AAAAA] to-100%"
              @click="openOfferModal"
              :label="offerSent ? 'Offer Sent!' : 'Send an Offer'"
              :loading="offerLoading"
              :disabled="offerSent"
            />

            <q-dialog
              v-model="offerModal"
              transition-show="slide-up"
              transition-hide="slide-down"
            >
              
              <div class="q-pa-md" style="width: 50%">
                <q-stepper
                  v-model="step"
                  vertical
                  color="primary"
                  done-color="teal-10"
                  active-color="teal"
                  inactive-color="teal-3"
                  animated
                >
                <div class="q-pa-md text-[#2AAA8A] font-bold text-3xl tracking-[-1.5px] cursor-pointer">Send an Offer </div>
                  <q-step
                    :name="1"
                    title="Broker information"
                    icon="settings"
                    :done="step > 1"
                  >
                    <q-input
                      v-model="brokerFName"
                      rounded
                      outlined
                      color="teal"
                      label="First Name"
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="brokerLName"
                      rounded
                      outlined
                      color="teal"
                      label="Last Name"
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="brokerLicense"
                      rounded
                      outlined
                      color="teal"
                      label="License number"
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="brokerAgency"
                      rounded
                      outlined
                      color="teal"
                      label="Agency"
                      class="q-mb-md"
                    />

                    <q-stepper-navigation>
                      <q-btn @click="step = 2" color="teal" label="Continue" />
                    </q-stepper-navigation>
                  </q-step>

                  <q-step
                    :name="2"
                    title="Buyer information"
                    icon="create_new_folder"
                    :done="step > 2"
                  >
                    <q-input
                      v-model="buyerFName"
                      rounded
                      outlined
                      color="teal"
                      label="First name"
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="buyerLName"
                      rounded
                      outlined
                      color="teal"
                      label="Last name"
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="buyerEmail"
                      rounded
                      outlined
                      color="teal"
                      label="Email"
                      class="q-mb-md"
                    />

                    <q-stepper-navigation>
                      <q-btn @click="step = 4" color="teal" label="Continue" />
                      <q-btn
                        flat
                        @click="step = 1"
                        color="teal"
                        label="Back"
                        class="q-ml-sm"
                      />
                    </q-stepper-navigation>
                  </q-step>

                  <q-step
                    :name="3"
                    title="Address of the Immovable"
                    :caption="listing.address"
                    icon="assignment"
                    disable
                  >
                  </q-step>

                  <q-step :name="4" title="Price and dates" icon="add_comment">
                    <q-input
                      v-model="buyerPrice"
                      rounded
                      outlined
                      color="teal"
                      label="Price"
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="dateSale"
                      label="Deed of sale date"
                      type="date"
                      rounded
                      outlined
                      color="teal"
                      class="q-mb-md"
                    />
                    <q-input
                      v-model="dateOccupy"
                      label="Occupancy of premises date"
                      type="date"
                      rounded
                      outlined
                      color="teal"
                      class="q-mb-md"
                    />

                    <q-stepper-navigation>
                      <q-btn
                        label="Submit Offer"
                        color="teal"
                        @click="submitOffer"
                      />
                      <q-btn
                        flat
                        @click="step = 2"
                        color="teal"
                        label="Back"
                        class="q-ml-sm"
                      />
                    </q-stepper-navigation>
                  </q-step>
                </q-stepper>
              </div>
            </q-dialog>

            <div class="font-normal text-base pb-2 opacity-80">
              Please exercise caution before submitting an offer to purchase a
              property. Ensure you've reviewed all details and consulted with a
              broker or legal advisor.
            </div>

            <q-separator class="my-4" />

            <q-btn
            flat
            no-caps
            class="h-[48px] w-full mb-4 rounded-md text-base text-white bg-gradient-to-r from-[#2AAA6A] from-33% via-[#2AAA8A] via-66% to-[#2AAAAA] to-100%"
            @click="openMortgageCalculator"
            label="Mortgage Calculator"
            />

            <div class="font-normal text-base pb-2 opacity-80">
              To use the mortgage calculator, enter the loan's principal amount, the annual interest rate provided by your lender, and the loan term in years. Once these details are filled in, click to calculate.
            </div>

            <q-dialog v-model="dialogVisible">
              <div class="q-pa-md" style="width: 50%">
              <q-card>
                <q-card-section>
                  <div class="text-[#2AAA8A] font-bold text-3xl tracking-[-1.5px] cursor-pointer"> Mortgage Calculator </div>
                </q-card-section>
                <q-card-section>
                  Principal Amount
                  <q-input 
                      v-model="principal" 
                      :placeholder="listing.price"
                      type="number" 
                      rounded
                      outlined 
                      color="teal"
                      class="q-mb-md" 
                      readonly />
                  <div class="row items-start example-container">
                    <div class="example-cell q-pa-md" tabindex="0">
                      Annual Rate (%) 
                      <q-input
                          v-model="annualRate" 
                          placeholder="%"
                          type="number" 
                          rounded
                          outlined
                          color="teal"
                          class="q-mb-md" />
                    </div>
                    <div class="example-cell q-pa-md" tabindex="0">
                    Loan Term
                    <q-input 
                        v-model="loanTerm" 
                        placeholder="Years" 
                        type="number" 
                        rounded
                        outlined
                        color="teal"
                        class="q-mb-md"/>
                    </div>
                  </div>
                  <q-btn label="Calculate" color="teal" @click="calculateAndDisplay" />
                </q-card-section>
              </q-card>
              </div>
            </q-dialog>

          </div>
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        @change="selectImage"
        style="display: none"
        accept="image/*"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  listAll,
  deleteObject,
} from 'firebase/storage';
import {
  getDatabase,
  ref as databaseRef,
  get,
  update,
  remove,
  set,
} from 'firebase/database';
import { useAppStore } from 'stores/app';
import { useAuthStore } from 'stores/auth';
import useDataHandling from '../services/dataHandling';
import ListingImage from 'components/ListingImage.vue';

const fileInput = ref<HTMLInputElement | null>(null);

const appStore = useAppStore();
const authStore = useAuthStore();
const dataHandling = useDataHandling();

const route = useRoute();
const router = useRouter();
const listing = ref({});
const fixedDivRef = ref(null);
const date = ref(null);
const imagesToDelete = ref([false, false, false, false, false]);
const shouldBeFixed = ref(false);
const selectedFiles = ref<File[]>([]);
const selectedImagesDataUrl = ref<string[]>([]);
const currentIndex = ref(null);
const saving = ref(false);
const visitLoading = ref(false);
const visitSent = ref(false);
const offerLoading = ref(false);
const offerSent = ref(false);

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
  { label: 'Yukon', value: 'YT' },
]);

const offerModal = ref(false);
const step = ref(1);

const brokerFName = ref('');
const brokerLName = ref('');
const brokerLicense = ref('');
const brokerAgency = ref('');
const buyerFName = ref('');
const buyerLName = ref('');
const buyerEmail = ref('');
const buyerPrice = ref('');
const dateSale = ref('');
const dateOccupy = ref('');

const openOfferModal = () => {
  if (authStore.user) {
    offerModal.value = true;
  } else {
    router.push('/signin');
  }
};

const closeOfferModal = () => {
  offerModal.value = false;
};

const submitOffer = async () => {
  offerLoading.value = true;
  await appStore.createOffer({
    brokerFName: brokerFName.value,
    brokerLName: brokerLName.value,
    brokerLicense: brokerLicense.value,
    brokerAgency: brokerAgency.value,
    buyerFName: buyerFName.value,
    buyerLName: buyerLName.value,
    buyerEmail: buyerEmail.value,
    buyerPrice: buyerPrice.value,
    dateSale: dateSale.value,
    dateOccupy: dateOccupy.value,
    address: listing.value.address,
    brokerId: listing.value.broker,
    confirmed: false,
  });
  
  closeOfferModal();
  offerLoading.value = false;
  offerSent.value = true;
};

const dialogVisible = ref(false);
const principal = ref('');
const annualRate = ref<number | null>(null);
const loanTerm = ref<number | null>(null);
const monthlyPayment = ref<number | null>(null);

const openMortgageCalculator = () => {
  dialogVisible.value = true;
}

const calculateAndDisplay = async () => {
  console.log('Pricipal Payment:', listing.value.price);
  console.log('Annual rate  Payment:', annualRate);
  console.log('Loan term Payment:', loanTerm);
  try {
    if (annualRate.value !== undefined && annualRate.value !== null &&
        loanTerm.value !== undefined && loanTerm.value !== null) {
      const result = await appStore.calculateMortgage(listing.value.price, annualRate.value, loanTerm.value);
      monthlyPayment.value = result;
      console.log('Monthly Payment:', result);
    } else {
      console.error('Please fill in all fields.');
    }
  } catch (error) {
    console.error('Failed to calculate mortgage:', error);
  }
};

let storage;
onMounted(async () => {
  storage = getStorage();
  // Check if "id" exists and is not empty
  const id = route?.query.id;
  if (!id || id === '') {
    router?.push('/');
  } else if (id === 'new' && authStore.isBroker) {
    console.log('new listing');
  } else {
    listing.value = await appStore.getListing(id);
    console.log(listing.value.broker);
    if (!listing.value) {
      router?.push('/');
    }
  }
});

const isAssociatedBrokerOpacity = computed(() => {
  if (authStore.user?.userId === listing.value?.broker) {
    return ' hover:opacity-50';
  }
  return '';
});
const isAssociatedBroker = computed(() => {
  if (authStore.user?.userId === listing.value?.broker) {
    return true;
  } else if (route.query.id === 'new') {
    return true;
  }
  return false;
});
// 8MTm7bGfDrcWS0vKAx7E5aiwUjO2
const generateAlphanumericString = () => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const checkUIDExists = async (uid) => {
  const db = getDatabase();
  const uidRef = databaseRef(db, `listings/${uid}`);
  const snapshot = await get(uidRef);
  return snapshot.exists();
};

const generateAndVerifyUID = async () => {
  let uid = generateAlphanumericString();
  console.log(uid);
  let exists = await checkUIDExists(uid);
  while (exists) {
    uid = generateAlphanumericString();
    exists = await checkUIDExists(uid);
  }
  return uid;
};

const requestVisit = async () => {
  console.log(authStore.user);
  if (authStore.user) {
    if (date.value) {
      visitLoading.value = true;
      await appStore.createVisitRequest({
        date: date.value,
        listingId: listing.value.id,
        brokerId: listing.value.broker,
        userId: authStore.user.userId,
        email: authStore.user.email,
        confirmed: false,
      });
      visitLoading.value = false;
      visitSent.value = true;
    }
  } else {
    router.push('/signin');
  }
};

const saveChanges = async () => {
  const db = getDatabase();
  // List all files in the listings-images directory
  const directoryRef = storageRef(storage, 'listings-images/');
  const fileList = await listAll(directoryRef);
  saving.value = true;
  if (storage && listing.value && route.query.id !== 'new') {
    const listingId = listing.value.id; // replace with actual listingId

    try {
      // Delete marked images
      for (const [index, toDelete] of imagesToDelete.value.entries()) {
        if (toDelete) {
          const imagePattern = new RegExp(`^${listingId}-0${index + 1}\\.`);
          for (const file of fileList.items) {
            if (imagePattern.test(file.name)) {
              try {
                await deleteObject(file);
                console.log(`Deleted existing file: ${file.name}`);
              } catch (error) {
                console.error(`Error deleting file: ${file.name}`, error);
              }
            }
          }
        }
      }

      // Upload new images
      for (let i = 0; i < selectedFiles.value.length; i++) {
        const file = selectedFiles.value[i];
        const pattern = new RegExp(`^${listingId}-0${i + 1}\\.`);
        for (const item of fileList.items) {
          if (pattern.test(item.name)) {
            try {
              await deleteObject(item);
              console.log(`Deleted existing file: ${item.name}`);
            } catch (error) {
              console.error(`Error deleting file: ${item.name}`, error);
            }
          }
        }
        const fileStorageRef = storageRef(
          storage,
          `listings-images/${listingId}-0${i + 1}.${file?.type.split('/')[1]}`
        );
        try {
          await uploadBytes(fileStorageRef, file);
          console.log('Image uploaded successfully!');
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }

      // Update the listing in the Realtime Database
      const listingRef = databaseRef(db, `listings/${listingId}`);
      await update(listingRef, listing.value);

      console.log('Listing updated successfully!');
    } catch (error) {
      console.error('Error handling files or updating listing:', error);
    }

    selectedFiles.value = [];
  } else if (route.query.id === 'new') {
    const token = await generateAndVerifyUID();
    listing.value.id = token;
    listing.value.type = 'buy';
    listing.value.propertyType = 'house';
    listing.value.broker = authStore.user.userId;
    listing.value.province = listing.value.province.value;
    const newListingRef = databaseRef(db, `listings/${token}`);
    await set(newListingRef, listing.value);

    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i];
      const pattern = new RegExp(`^${token}-0${i + 1}\\.`);
      for (const item of fileList.items) {
        if (pattern.test(item.name)) {
          try {
            await deleteObject(item);
            console.log(`Deleted existing file: ${item.name}`);
          } catch (error) {
            console.error(`Error deleting file: ${item.name}`, error);
          }
        }
      }
      const fileStorageRef = storageRef(
        storage,
        `listings-images/${token}-0${i + 1}.${file?.type.split('/')[1]}`
      );
      try {
        await uploadBytes(fileStorageRef, file);
        console.log('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    console.log(listing.value);
    router.back();
  } else {
    console.log('Storage not initialized or listing is not set');
  }
  saving.value = false;
};

const selectImage = (event) => {
  const index = currentIndex.value;
  console.log(index);
  if (index !== null) {
    // Now you have access to the index here
    selectedFiles.value[index] = event.target.files[0];
    selectedImagesDataUrl.value[index] = URL.createObjectURL(
      event.target.files[0]
    );
  }
  console.log(selectedFiles.value);
  console.log(selectedImagesDataUrl.value);
};

const triggerFileUpload = (index) => {
  if (isAssociatedBroker.value || route.query.id === 'new') {
    currentIndex.value = index;
    imagesToDelete.value[index] = true;
    console.log('triggerFileUpload function called');
    if (fileInput.value?.disabled) {
      console.log('File input is disabled');
    } else {
      console.log('fileInput:', fileInput.value);
      fileInput.value?.click();
    }
  }
};

const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (file && storage) {
    const fileStorageRef = storageRef(storage, `listings-images/${file.name}`);
    try {
      await uploadBytes(fileStorageRef, file);
      console.log('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
};

const removeListing = async () => {
  if (listing.value && listing.value.id) {
    const listingId = listing.value.id;
    const storage = getStorage();
    const db = getDatabase();

    try {
      // Step 3: List all images connected to the listing
      const imageDirectoryRef = storageRef(
        storage,
        `listings-images/${listingId}`
      );
      const imageList = await listAll(imageDirectoryRef);

      // Step 4: Delete each image
      for (const imageRef of imageList.items) {
        await deleteObject(imageRef);
        console.log(`Image deleted: ${imageRef.fullPath}`);
      }

      // Step 5: Delete the listing from Realtime Database
      const listingRef = databaseRef(db, `listings/${listingId}`);
      await remove(listingRef);
      console.log('Listing deleted successfully!');

      // Step 7: Update the UI
      // You can redirect the user, show a success message, etc.
      router.push('/'); // Redirect to home page as an example
    } catch (error) {
      console.error('Error removing listing:', error);
      // Handle the error appropriately (show error message to the user, etc.)
    }
  } else {
    console.error('Listing is not set or has no ID');
  }
  router.back();
};

const fixedStyle = computed(() => {
  return shouldBeFixed.value ? 'fixed w-full top-[104px]' : 'w-full!';
});
</script>

<style scoped>
.image-container {
  position: relative;
  overflow: hidden;
  border-radius: 2xl; /* This should match the border-radius of your image */
}

.remove-btn {
  position: absolute;
  border-radius: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  display: none;
  align-items: center;
  justify-content: center;
}

.image-container:hover .remove-btn {
  display: flex;
}

/* Define the transition styles */
.fade-enter-active,
.fade-leave-active {
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
