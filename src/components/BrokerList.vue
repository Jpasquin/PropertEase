<template>
  <div class="p-6 relative md:w-[780px]">
    <transition-group
      name="fade"
      tag="div"
      class="grid md:grid-cols-2 grid-cols-1 gap-4"
    >
      <div
        v-for="(broker, index) in filteredBrokers"
        :key="index"
        @click="navigateAndReload(broker?.id)"
        class="w-[360px] flex cursor-pointer hover:bg-[#ededed] hover:opacity-70"
        style="
          border: 1px solid rgb(221, 221, 221);
          border-radius: 12px;
          padding: 24px;
          box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;"
      >
        <div
          class="w-16 h-16 text-base text-black mr-4 border-solid border-1 border-[#2AAA8A] flex justify-center items-center rounded-full"
        >
          {{ broker?.firstName?.charAt(0)?.toUpperCase() + broker?.lastName?.charAt(0)?.toUpperCase() }}
        </div>

        <div>
          <span class="font-medium">
            {{ capitalizeFirstChar(broker?.firstName) }}
            {{ capitalizeFirstChar(broker?.lastName) }}
          </span>
          <div>
            {{ truncateEmail(broker?.email) }}
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAppStore } from 'stores/app';

const props = defineProps<{
  filter: string;
}>();

const appStore = useAppStore();
const brokers = ref([]);

const capitalizeFirstChar = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const truncateEmail = (email, maxLength = 24) => {
  if (!email) return '';
  if (email.length <= maxLength) return email;
  return email.substring(0, maxLength) + '...';
};

const getBrokers = async () => {
  brokers.value = await appStore.getBrokers();
};

const navigateAndReload = (brokerId) => {
  const newUrl = `/brokers?id=${brokerId}`;
  // Change the current URL and reload the page
  window.location.href = newUrl;
};

// Computed property for filtered brokers
const filteredBrokers = computed(() => {
  const filterLower = props.filter?.toLowerCase();
  return brokers.value.filter((broker) => {
    const firstNameLower = broker.firstName?.toLowerCase();
    const lastNameLower = broker.lastName?.toLowerCase();
    return (
      firstNameLower.includes(filterLower) || lastNameLower.includes(filterLower)
    );
  });
});

onMounted(async () => {
  await getBrokers();
});
</script>


<style scoped>
/* Define the transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
