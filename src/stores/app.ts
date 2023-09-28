import { equalTo, get, getDatabase, orderByChild, query, ref } from 'firebase/database';
import { getStorage, ref as firebaseRef, getDownloadURL } from "firebase/storage";
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
      const listings: any = [];
      listingListSnapshot.forEach(childSnapshot => {
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
      console.log('hello');
      const storage = getStorage();
      const imagePath = `listings-images/${listingId}.webp?alt=media`;
      console.log(imagePath)
      const imageRef = firebaseRef(storage, imagePath);
  
      try {
          const url = await getDownloadURL(imageRef);
          return url;
      } catch (error) {
          console.error("Failed to fetch image:", error);
          throw error;
      }
    }
  }
});
