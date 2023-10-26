<template>
  <q-page class="row items-center justify-evenly">
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
      class="border-solid border-2 border-[#d8d8d8] rounded-lg p-2 min-w-[600px]"
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
              @click="acceptOrDeclineVisit(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useAppStore } from 'stores/app';
import { useAuthStore } from 'src/stores/auth';

const appStore = useAppStore();
const authStore = useAuthStore();

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

const rows = ref([]);
const visitRows = ref([]);
const brokerApplicationIds = ref([]);

onMounted(async () => {
  // Fetching brokers
  const brokers = await appStore.getBrokers();
  brokers.forEach((item) => {
    rows.value.push({
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      id: item.id,
      revoke: '',
    });
  });

  const visitsByBroker = await appStore.getVisitsByBroker(authStore.user.userId);
  visitsByBroker.forEach((item) => {
    visitRows.value.push({
      email: item.email,
      date: item.date,
      id: item.id,
      confirmed: item.confirmed,
      revoke: '',
    });
  });
  console.log(visitsByBroker)
  // Fetching broker applications
  const brokerApplications = await appStore.getBrokerApplications();
  brokerApplications.forEach((item) => {
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
  await appStore.deleteVisit(row.id)
  location.reload();
}
</script>
