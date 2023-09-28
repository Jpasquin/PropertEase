import { equalTo, get, getDatabase, orderByChild, query, ref } from 'firebase/database';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    listings: null
  }),

  getters: {
  },

  actions: {
    async getListings(type: string) {
      const db = getDatabase();
      const listingListRef = ref(db, 'listings/');
    
      // Query listings with type set to "buy"
      const buyListingsQuery = query(listingListRef, orderByChild('type'), equalTo(type));
      const listingListSnapshot = await get(buyListingsQuery);
    
      // Convert the snapshot to an array of objects
      const listings: any | null = [];
      listingListSnapshot.forEach(childSnapshot => {
        listings.push(childSnapshot.val());
      });
    
      console.log(listings);
      return listings;
    }
  }
});
