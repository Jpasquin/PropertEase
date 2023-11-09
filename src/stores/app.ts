import {
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query,
  child,
  ref,
  remove,
  update,
  push,
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
      return 'https://firebasestorage.googleapis.com/v0/b/propertease-5ff7d.appspot.com/o/';
    },
  },

  actions: {
    async createVisitRequest(visit: any) {
      const db = getDatabase();
      const visitsRef = ref(db, 'visits/');

      try {
        await push(visitsRef, visit);
        console.log('Visit added successfully');
      } catch (error) {
        console.error('Error adding visit: ', error);
      }
    },

    async approveOrDeclineVisit(visitId: string, approved: any) {
      const db = getDatabase();
      const visitRef = ref(db, `visits/${visitId}`);

      if (approved) {
        try {
          await update(visitRef, { confirmed: true });
          console.log('Visit approved successfully');
        } catch (error) {
          console.error('Error approving visit: ', error);
          throw error;
        }
      } else {
        try {
          await remove(visitRef);
          console.log('Visit declined and deleted successfully');
        } catch (error) {
          console.error('Error deleting visit: ', error);
          throw error;
        }
      }
    },

    // used for when the visit has already been approved
    async deleteVisit(visitId: string) {
      const db = getDatabase();
      const visitRef = ref(db, `visits/${visitId}`);

      try {
        await remove(visitRef);
        console.log('Visit deleted successfully');
      } catch (error) {
        console.error('Error deleting visit: ', error);
        throw error; // Re-throw the error to handle it in the calling function
      }
    },

    // used for when the offer has already been approved
    async deleteOffer(offerId: string) {
      const db = getDatabase();
      const offerRef = ref(db, `offers/${offerId}`);

      try {
        await remove(offerRef);
        console.log('Offer deleted successfully');
      } catch (error) {
        console.error('Error deleting Offer: ', error);
        throw error; // Re-throw the error to handle it in the calling function
      }
    },

    async approveOrDeclineOffer(offerId: string, approved: any) {
      console.log('Store log')
      console.log(offerId)
      const db = getDatabase();
      const offerRef = ref(db, `offers/${offerId}`);
      console.log(offerRef)
      if (approved) {
        try {
          await update(offerRef, { confirmed: true });
          console.log('Offer approved successfully');
        } catch (error) {
          console.error('Error approving visit: ', error);
          throw error;
        }
      } else {
        try {
          await remove(offerRef);
          console.log('Offer declined and deleted successfully');
        } catch (error) {
          console.error('Error deleting offer: ', error);
          throw error;
        }
      }
    },

    async getVisitsByBroker(brokerId: string) {
      const db = getDatabase();
      const visitsRef = ref(db, 'visits');
      const brokerVisitsQuery = query(
        visitsRef,
        orderByChild('brokerId'),
        equalTo(brokerId)
      );

      try {
        const snapshot = await get(brokerVisitsQuery);
        if (snapshot.exists()) {
          const visits: any = [];
          snapshot.forEach((childSnapshot) => {
            const visitData = childSnapshot.val();
            visitData.id = childSnapshot.key; // Save the unique key of the visit
            visits.push(visitData);
          });
          return visits;
        } else {
          console.log('No visits found for the given brokerId');
          return [];
        }
      } catch (error) {
        console.error('Error fetching visits: ', error);
        throw error; // Re-throw the error to handle it in the calling function
      }
    },

    async getOffersByBroker(brokerId: string) {
      console.log('In the getOfferByBroker, this is the brokerId ' + brokerId);
      const db = getDatabase();
      const visitsRef = ref(db, 'offers/');
      const brokerVisitsQuery = query(
        visitsRef,
        orderByChild('brokerId'),
        equalTo(brokerId)
      );

      try {
        const snapshot = await get(brokerVisitsQuery);
        console.log(brokerVisitsQuery);
        if (snapshot.exists()) {
          console.log('snapshot exists');
          const offers: any = [];
          snapshot.forEach((childSnapshot) => {
            const offerData = childSnapshot.val();
            offerData.id = childSnapshot.key; // Save the unique key of the visit
            offers.push(offerData);
          });
          return offers;
        } else {
          console.log('No offers found for the given brokerId');
          return [];
        }
      } catch (error) {
        console.error('Error fetching offers: ', error);
        throw error; // Re-throw the error to handle it in the calling function
      }
    },

    async createOffer(offer: any) {
      console.log('hello');
      const db = getDatabase();
      const offerRef = ref(db, 'offers/');

      try {
        await push(offerRef, offer);
        console.log('Offer added successfully');
      } catch (error) {
        console.error('Error adding offer: ', error);
      }
    },

    async removeImages(images: string[]) {
      console.log(images);
    },

    async updateUser(userChanges: any) {
      const db = getDatabase();
      const userRef = ref(db, `users/${userChanges.userId}`);

      try {
        await update(userRef, {
          firstName: userChanges.firstName,
          lastName: userChanges.lastName,
        });
        console.log('User updated successfully');
      } catch (error) {
        console.error('Error updating user: ', error);
        throw error; // Re-throw the error to handle it in the calling function if needed
      }
    },

    async revokeBroker(userId: string) {
      const db = getDatabase();

      // Reference to the specific user by their userId
      const brokerUserRef = ref(db, 'users/' + userId);

      // Set accountType to null (which effectively deletes it)
      await update(brokerUserRef, { accountType: 'user' });
    },

    async getBroker(brokerId: string) {
      const db = getDatabase();
      // Create a reference to the specific broker's data
      const brokerRef = ref(db, 'users/' + brokerId);
    
      // Retrieve the snapshot for the specific broker
      const brokerSnapshot = await get(brokerRef);
    
      if (brokerSnapshot.exists()) {
        const brokerData = brokerSnapshot.val();
        // Add the ID to the broker object
        brokerData.id = brokerId;
        return brokerData;
      } else {
        // Handle the case where the broker does not exist
        console.log("No broker found with ID: " + brokerId);
        return null; // or throw an error or return a default value
      }
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
      const brokerApplicationRef = ref(db, `brokerApplications/${userId}`);
      // If approved, update the user's account type to 'broker'
      if (approved) {
        const userRef = ref(db, `users/${userId}`);

        // Fetch the broker application data
        const brokerApplicationSnapshot = await get(brokerApplicationRef);
        const brokerApplicationData = brokerApplicationSnapshot.val();

        if (brokerApplicationData) {
          // Extract info from the broker application
          const { phone, license, agency } = brokerApplicationData;

          // Update user's account type to 'broker' and add phone number
          await update(userRef, {
            phone: phone, // Add the phone number to the user object
            license: license,
            agency: agency,
          });
        }

        await update(userRef, {
          accountType: 'broker',
        });
      }

      // Remove the corresponding application from brokerApplications
      await remove(brokerApplicationRef);
    },

    async getListings(filter: Filter) {
      const db = getDatabase();
      const listingListRef = ref(db, 'listings/');
      const buyListingsQuery = query(
        listingListRef,
        orderByChild('type'),
        equalTo(filter.type)
      );
      const listingListSnapshot = await get(buyListingsQuery);

      const listings: any = [];
      listingListSnapshot.forEach((childSnapshot) => {
        const listingId = childSnapshot.key;
        const listingData = childSnapshot.val();
        listingData.id = listingId;

        const isCityMatch =
          filter.city == null ||
          (listingData.city != null &&
            listingData.city.toLowerCase().includes(filter.city.toLowerCase()));
        const isProvinceMatch =
          filter.province == null ||
          (listingData.province != null &&
            listingData.province.toLowerCase() ===
              filter.province.toLowerCase());

        const isPriceMatch =
          (filter.minMaxPrice?.min == null ||
            listingData.price >= filter.minMaxPrice.min) &&
          (filter.minMaxPrice?.max == null ||
            listingData.price <= filter.minMaxPrice.max);

        if (isCityMatch && isProvinceMatch && isPriceMatch) {
          listings.push(listingData);
        }
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
