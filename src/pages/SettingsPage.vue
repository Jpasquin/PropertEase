<template>
  <q-page class="row items-center justify-evenly">
    <div class="border-solid border-2 border-[#d8d8d8] rounded-lg p-2 min-w-[600px]">
      <div class="font-medium text-3xl px-2 py-4">Brokers</div>
      
      <q-table flat :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body-cell-firstName="props">
          <q-td key="firstName" :props="props">
            {{ props.row.firstName }}
            <q-popup-edit v-model="props.row.firstName" title="Change First name" buttons persistent v-slot="scope">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
        </template>

        <template v-slot:body-cell-lastName="props">
          <q-td key="lastName" :props="props">
            {{ props.row.lastName }}
            <q-popup-edit v-model="props.row.lastName" title="Change Last name" buttons persistent v-slot="scope">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
        </template>

        <template v-slot:body-cell-revoke="props">
          <q-td :props="props">
            <q-btn flat icon="delete" @click="revokeBroker(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from 'stores/app'

const appStore = useAppStore()

const columns = [
  {
    name: 'email',
    field: 'email',
    required: true,
    label: 'Email',
    align: 'left',
    sortable: true
  },
  { name: 'firstName', field: 'firstName', align: 'left', label: 'First name', sortable: true },
  { name: 'lastName', field: 'lastName', align: 'left', label: 'Last name', sortable: true },
  { name: 'revoke', field: 'revoke', align: 'left', label: '' }
]

const rows = ref([])

onMounted(async () => {
  const brokers = await appStore.getBrokers()

  brokers.forEach((item) => {
    rows.value.push({
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      revoke: ''
    })
  })
})

const revokeBroker = (row) => {
  console.log("Revoking broker:", row.email)
}
</script>
