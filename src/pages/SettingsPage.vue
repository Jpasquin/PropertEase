<template>
  <q-page class="row items-center justify-evenly">
    <div class="grid grid-cols-1 gap-4 min-w-[600px] mt-4">
      <q-input
        ref="firstNameInput"
        outlined
        color="black"
        label="First name"
        v-model="userChanges.firstName"
      />

      <q-input
        ref="lastNameInput"
        outlined
        color="black"
        label="Last name"
        v-model="userChanges.lastName"
      />

      <div>
        <q-btn
          flat
          no-caps
          class="bg-black text-white rounded-lg py-2! px-4! float-right"
          label="Save Changes"
          @click="saveUserChanges"
          :loading="savingUserChanges"
        />

        <q-btn
          flat
          no-caps
          class="bg-[#ededed] text-black rounded-lg py-2! px-4! float-right mr-2"
          label="Cancel"
          @click="
            (userChanges.firstName = authStore.user.firstName),
              (userChanges.lastName = authStore.user.lastName)
          "
        />
      </div>
    </div>

    <div
      class="border-solid border-2 border-[#d8d8d8] rounded-lg p-2 min-w-[600px]"
      v-if="authStore.isAdmin"
    >
      <div class="font-medium text-3xl px-2 py-4">Brokers</div>
      <q-table flat :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-firstName="props">
          <q-td key="firstName" :props="props">
            {{ props.row.firstName }}
            <q-popup-edit
              v-model="props.row.firstName"
              title="Change First name"
              buttons
              persistent
              v-slot="scope"
            >
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
        </template>

        <template v-slot:body-cell-lastName="props">
          <q-td key="lastName" :props="props">
            {{ props.row.lastName }}
            <q-popup-edit
              v-model="props.row.lastName"
              title="Change Last name"
              buttons
              persistent
              v-slot="scope"
            >
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
        </template>

        <template v-slot:body-cell-revoke="props">
          <q-td :props="props">
            <!-- Display delete button only if current row's id is NOT in brokerApplicationIds -->
            <q-btn
              v-if="!brokerApplicationIds?.includes(props.row.id)"
              flat
              icon="delete"
              @click="revokeBroker(props.row)"
            />
            <q-btn
              v-if="brokerApplicationIds?.includes(props.row.id)"
              flat
              icon="check"
              @click="acceptOrDeclineApplication(props.row, true)"
            />
            <q-btn
              v-if="brokerApplicationIds?.includes(props.row.id)"
              flat
              icon="close"
              @click="acceptOrDeclineApplication(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <div
      class="border-solid border-2 border-[#d8d8d8] rounded-lg p-2 min-w-[600px] mt-[50px]"
      v-if="authStore.isBroker"
    >
      <div class="font-medium text-3xl px-2 py-4">Visits</div>
      <q-table flat :rows="visitRows" :columns="visitColumns" row-key="name">
        <template v-slot:body-cell-revoke="props">
          <q-td :props="props">
            <!-- Display delete button only if current row's id is NOT in brokerApplicationIds -->
            <q-btn
              v-if="props.row.confirmed"
              flat
              icon="delete"
              @click="deleteVisit(props.row)"
            />
            <q-btn
              v-if="!props.row.confirmed"
              flat
              icon="check"
              @click="acceptOrDeclineVisit(props.row, true)"
            />
            <q-btn
              v-if="!props.row.confirmed"
              flat
              icon="close"
              @click="acceptOrDeclineVisit(props.row, false)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <div
      class="border-solid border-2 border-[#d8d8d8] rounded-lg p-2 min-w-[600px] mt-[50px] mb-[50px]"
      v-if="authStore.isBroker"
    >
      <div class="font-medium text-3xl px-2 py-4">Offers</div>
      <q-table
        flat
        :rows="offerRows"
        :columns="offerColumns"
        row-key="name"
        @row-click="onRowClick"
      >
        <template v-slot:body-cell-revoke="props">
          <q-td :props="props">
            <!-- Display delete button only if current row's id is NOT in brokerApplicationIds -->
            <q-btn
              v-if="props.row.confirmed"
              flat
              icon="delete"
              @click="deleteOffer(props.row)"
            />
            <q-btn
              v-if="!props.row.confirmed"
              flat
              icon="check"
              @click.stop="acceptOrDeclineOffer(props.row, true)"
            />
            <q-btn
              v-if="!props.row.confirmed"
              flat
              icon="close"
              @click.stop="acceptOrDeclineOffer(props.row, false)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="offerModal">
      <q-card style="width: 50vw">
        <q-card-section>
          Broker information
          <q-input
            v-model="currentOffer.brokerLicense"
            label="License number"
            readonly
          />
          <q-input
            v-model="currentOffer.brokerAgency"
            label="Agency"
            readonly
          />
        </q-card-section>

        <q-card-section>
          Buyer information
          <q-input
            readonly
            v-model="currentOffer.buyerFName"
            label="First name"
          />
          <q-input
            readonly
            v-model="currentOffer.buyerLName"
            label="Last name"
          />
          <q-input readonly v-model="currentOffer.buyerEmail" label="Email" />
        </q-card-section>

        <q-card-section>
          Address of the immovable
          <q-input v-model="currentOffer.address" label="Address" readonly />
        </q-card-section>

        <q-card-section>
          Price and dates
          <q-input v-model="currentOffer.buyerPrice" label="Price" readonly />
          <!-- add calendar popup selector for the last 2 options -->
          <q-input
            v-model="currentOffer.dateSale"
            label="Deed of sale date"
            readonly
          />
          <q-input
            readonly
            v-model="currentOffer.dateOccupy"
            label="Occupancy of premises date"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Cancel" @click="closeOfferModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useAppStore } from 'stores/app';
import { useAuthStore } from 'src/stores/auth';

const appStore = useAppStore();
const authStore = useAuthStore();
const savingUserChanges = ref(false);
const offerModal = ref(false);

const columns = [
  {
    name: 'email',
    field: 'email',
    required: true,
    label: 'Email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'firstName',
    field: 'firstName',
    align: 'left',
    label: 'First name',
    sortable: true,
  },
  {
    name: 'lastName',
    field: 'lastName',
    align: 'left',
    label: 'Last name',
    sortable: true,
  },
  { name: 'revoke', field: 'revoke', align: 'left', label: '' },
  { name: 'accept', field: 'accept', align: 'left', label: '' },
  { name: 'decline', field: 'decline', align: 'left', label: '' },
];

const visitColumns = [
  {
    name: 'email',
    field: 'email',
    required: true,
    label: 'Email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    field: 'date',
    align: 'left',
    label: 'Date',
    sortable: true,
  },
  { name: 'revoke', field: 'revoke', align: 'left', label: '' },
  { name: 'accept', field: 'accept', align: 'left', label: '' },
  { name: 'decline', field: 'decline', align: 'left', label: '' },
];

const offerColumns = [
  {
    name: 'buyerFName',
    field: 'buyerFName',
    align: 'left',
    label: 'First name',
    sortable: true,
  },
  {
    name: 'buyerLName',
    field: 'buyerLName',
    align: 'left',
    label: 'Last name',
    sortable: true,
  },
  {
    name: 'buyerPrice',
    field: 'buyerPrice',
    align: 'left',
    label: 'Price',
    sortable: true,
  },
  {
    name: 'dateSale',
    field: 'dateSale',
    align: 'left',
    label: 'Date',
    sortable: true,
  },
  { name: 'revoke', field: 'revoke', align: 'left', label: '' },
  { name: 'accept', field: 'accept', align: 'left', label: '' },
  { name: 'decline', field: 'decline', align: 'left', label: '' },
];

const rows = ref([]);
const visitRows = ref([]);
const brokerApplicationIds = ref([]);
const offerRows = ref([]);
const currentOffer = ref([]);

const userChanges = ref({
  userId: authStore.user?.userId,
  firstName: authStore.user?.firstName,
  lastName: authStore.user?.lastName,
});

const onRowClick = (event, row) => {
  offerModal.value = true;
  currentOffer.value = row;
  console.log(currentOffer);
};

const closeOfferModal = () => {
  offerModal.value = false;
};

onMounted(async () => {
  // Fetching brokers
  const brokers = await appStore.getBrokers();
  brokers?.forEach((item) => {
    rows.value.push({
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      id: item.id,
      revoke: '',
    });
  });

  const visitsByBroker = await appStore.getVisitsByBroker(
    authStore.user?.userId
  );
  visitsByBroker?.forEach((item) => {
    visitRows.value.push({
      email: item.email,
      date: item.date,
      id: item.id,
      confirmed: item.confirmed,
      revoke: '',
    });
  });

  const offersByBroker = await appStore.getOffersByBroker(
    authStore.user?.userId
  );
  offersByBroker?.forEach((item) => {
    offerRows.value.push({
      address: item.address,
      id: item.id,
      brokerAgency: item.brokerAgency,
      brokerFName: item.brokerFName,
      brokerLName: item.brokerLName,
      brokerLicense: item.brokerLicense,
      buyerEmail: item.buyerEmail,
      buyerFName: item.buyerFName,
      buyerLName: item.buyerLName,
      buyerPrice: item.buyerPrice,
      dateOccupy: item.dateOccupy,
      dateSale: item.dateSale,
      confirmed: item.confirmed,
      revoke: '',
    });
  });

  // Fetching broker applications
  const brokerApplications = await appStore.getBrokerApplications();
  brokerApplications?.forEach((item) => {
    brokerApplicationIds.value.push(item.id); // populate the ids ref
    rows.value.push({
      email: item.email, // Assuming brokerApplications also have 'email', 'firstName', etc.
      firstName: item.firstName,
      lastName: item.lastName,
      id: item.id,
      revoke: '',
    });
  });
});

const revokeBroker = async (row) => {
  // Find the index of the row with the given id
  const rowIndex = rows.value.findIndex((r) => r.id === row.id);
  // If the row is found, remove it
  if (rowIndex !== -1) {
    rows.value.splice(rowIndex, 1);
  }
  await appStore.revokeBroker(row.id);
};

const acceptOrDeclineApplication = async (row, approved) => {
  // Find the index of the row with the given id
  const rowIndex = rows.value.findIndex((r) => r.id === row.id);
  // If the row is found, remove it
  if (rowIndex !== -1) {
    rows.value.splice(rowIndex, 1);
  }
  await appStore.updateOrDeleteBrokerApplication(row.id, approved);
  location.reload();
};

const saveUserChanges = async () => {
  savingUserChanges.value = true;
  await appStore.updateUser(userChanges.value);
  savingUserChanges.value = false;
};

const acceptOrDeclineVisit = async (row, approved) => {
  // Find the index of the row with the given id
  const rowIndex = rows.value.findIndex((r) => r.id === row.id);
  // If the row is found, remove it
  if (rowIndex !== -1) {
    rows.value.splice(rowIndex, 1);
  }
  await appStore.approveOrDeclineVisit(row.id, approved);
  location.reload();
};

const deleteVisit = async (row) => {
  await appStore.deleteVisit(row.id);
  location.reload();
};

const acceptOrDeclineOffer = async (row, approved) => {
  // Find the index of the row with the given id
  const rowIndex = offerRows.value.findIndex((r) => r.id === row.id);
  // If the row is found, remove it
  if (rowIndex !== -1) {
    offerRows.value.splice(rowIndex, 1);
  }
  const response = await appStore.approveOrDeclineOffer(row.id, approved);
  location.reload();
};

const deleteOffer = async (row) => {
  await appStore.deleteOffer(row.id);
  location.reload();
};
</script>
