import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
} from 'firebase/database';
import {
  getStorage,
  ref as firebaseRef,
  getDownloadURL,
} from 'firebase/storage';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
<<<<<<< HEAD
    listings: null,
=======
    filter: {
      type: 'buy',
      tags: ['']
    },
    listings: null
>>>>>>> staging
  }),

  getters: {},

  actions: {
    async getBrokers() {
      const db = getDatabase();
      const brokerListRef = ref(db, 'users/');

      // Query listings with type set to "buy"
      const brokerQuery = query(brokerListRef, orderByChild('accountType'), equalTo('broker'));
      const brokerListSnapshot = await get(brokerQuery);

      // Convert the snapshot to an array of objects
      const brokers: any = [];
      brokerListSnapshot.forEach(childSnapshot => {
        const brokerId = childSnapshot.key; // This will give you the ID, e.g., "001"
        const brokerData = childSnapshot.val();

        // Add the ID to the listing object
        brokerData.id = brokerId;

        brokers.push(brokerData);
      });
      console.log(brokers)
      return brokers;
    },

    async getListings() {
      const db = getDatabase();
      const listingListRef = ref(db, 'listings/');

      // Query listings with type set to "buy"
      const buyListingsQuery = query(listingListRef, orderByChild('type'), equalTo(this.filter.type));
      const listingListSnapshot = await get(buyListingsQuery);

      // Convert the snapshot to an array of objects
      const listings: any = [];
      listingListSnapshot.forEach((childSnapshot) => {
        const listingId = childSnapshot.key; // This will give you the ID, e.g., "001"
        const listingData = childSnapshot.val();

        // Add the ID to the listing object
        listingData.id = listingId;

        listings.push(listingData);
      });

      console.log(listings);
      return listings;
    },

    async getListingsBroker(broker: string) {
      const db = getDatabase();
      const listingListRef = ref(db, 'listings/');

      console.log('User id: ' + broker);
      // Query listings with the broker id"
      const brokerListingsQuery = query(
        listingListRef,
        orderByChild('broker'),
        equalTo(broker)
      );
      const listingListSnapshot = await get(brokerListingsQuery);

      // Convert the snapshot to an array of objects
      const listings: any = [];
      listingListSnapshot.forEach((childSnapshot) => {
        const listingId = childSnapshot.key; // This will give you the ID, e.g., "001"
        const listingData = childSnapshot.val();

        // Add the ID to the listing object
        listingData.id = listingId;

        listings.push(listingData);
      });

      console.log(listings);
      return listings;
    },

    async getListingImage(listingId: string): Promise<string> {
      const storage = getStorage();
      const imagePath = `listings-images/${listingId}.webp?alt=media`;
      console.log(imagePath);
      const imageRef = firebaseRef(storage, imagePath);

      try {
        const url = await getDownloadURL(imageRef);
        return url;
      } catch (error) {
        console.error('Failed to fetch image:', error);
        throw error;
      }
    },
  },
});
