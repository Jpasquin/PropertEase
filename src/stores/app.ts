
import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
  remove,
  update,
} from 'firebase/database';
import {
  getStorage,
  ref as firebaseRef,
  getDownloadURL,
} from 'firebase/storage';
import { defineStore } from 'pinia';
import Filter from '../interfaces/filter';

export const useAppStore = defineStore('app', {
  state: () => ({
    listings: null,
  }),

  getters: {
    getImageURL() {
      return 'https://firebasestorage.googleapis.com/v0/b/propertease-5ff7d.appspot.com/o/'
    }
  },

  actions: {
    async removeImages(images: string[]) {
      console.log(images);
    },

    async revokeBroker(userId: string) {
      const db = getDatabase();

      // Reference to the specific user by their userId
      const brokerUserRef = ref(db, 'users/' + userId);

      // Set accountType to null (which effectively deletes it)
      await update(brokerUserRef, { accountType: 'user' });
    },

    async getBrokers() {
      const db = getDatabase();
      const brokerListRef = ref(db, 'users/');

      const brokerQuery = query(
        brokerListRef,
        orderByChild('accountType'),
        equalTo('broker')
      );
      const brokerListSnapshot = await get(brokerQuery);

      // Convert the snapshot to an array of objects
      const brokers: any = [];
      brokerListSnapshot.forEach((childSnapshot) => {
        const brokerId = childSnapshot.key; // This will give you the ID, e.g., "001"
        const brokerData = childSnapshot.val();

        // Add the ID to the listing object
        brokerData.id = brokerId;

        brokers.push(brokerData);
      });
      return brokers;
    },

    async getBrokerApplications() {
      const db = getDatabase();

      // Reference to the 'brokerApplications' in the database
      const brokerApplicationsRef = ref(db, 'brokerApplications/');

      // Query for getting the broker applications (assuming you want to query by 'accountType' again)
      const brokerApplicationsQuery = query(brokerApplicationsRef);
      const brokerApplicationsSnapshot = await get(brokerApplicationsQuery);

      // Convert the snapshot to an array of objects
      const applications: any = [];
      brokerApplicationsSnapshot.forEach((childSnapshot) => {
        const applicationId = childSnapshot.key; // This will give you the ID
        const applicationData = childSnapshot.val();

        // Add the ID to the listing object
        applicationData.id = applicationId;

        applications.push(applicationData);
      });

      return applications;
    },

    async updateOrDeleteBrokerApplication(userId: string, approved: boolean) {
      const db = getDatabase();

      // If approved, update the user's account type to 'broker'
      if (approved) {
        const userRef = ref(db, `users/${userId}`);
        await update(userRef, {
          accountType: 'broker',
        });
      }

      // Remove the corresponding application from brokerApplications
      const brokerApplicationRef = ref(db, `brokerApplications/${userId}`);
      await remove(brokerApplicationRef);
    },

    async getListings(filter: Filter) {
      const db = getDatabase();
      const listingListRef = ref(db, 'listings/');

      // Query listings with type set to "buy"
      const buyListingsQuery = query(
        listingListRef,
        orderByChild('type'),
        equalTo(filter.type)
      );
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

      return listings;
    },

    async getListingsBroker(broker: string) {
      const db = getDatabase();
      const listingListRef = ref(db, 'listings/');

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
