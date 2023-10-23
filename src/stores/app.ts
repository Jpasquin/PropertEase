import { child, equalTo, get, getDatabase, orderByChild, query, ref } from 'firebase/database';
import { getStorage, ref as firebaseRef, getDownloadURL } from "firebase/storage";
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    filter: {
      type: 'buy',
      tags: ['']
    },
    listings: null
  }),

  getters: {
    getImageURL() {
      return 'https://firebasestorage.googleapis.com/v0/b/propertease-5ff7d.appspot.com/o/'
    }
  },

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

    async getListing(listingId: string) {
      const db = getDatabase();
      const listingListRef = ref(db, 'listings/');
      const specificListingRef = child(listingListRef, listingId);
    
      try {
        const snapshot = await get(specificListingRef);
        
        if (snapshot.exists()) {
          const listing = snapshot.val();
          listing.id = snapshot.key;
          return listing;
        } else {
          console.error(`No listing found with id: ${listingId}`);
          return null;
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        return null;
      }
    },

    async getListingImage(listingId: string): Promise<string> {
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
