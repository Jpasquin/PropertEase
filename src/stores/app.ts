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
  set,
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
      console.log('Store log');
      console.log(offerId);
      const db = getDatabase();
      const offerRef = ref(db, `offers/${offerId}`);
      const confirmedOffersRef = ref(db, 'offersConfirmed');
      console.log(offerRef);
      try {
        const offerSnapshot = await get(offerRef);
        if (offerSnapshot.exists()) {
          const offerData = offerSnapshot.val();

          if (approved) {
            await update(offerRef, { confirmed: true });
            // Add the accepted offer to offersConfirmed
            await push(confirmedOffersRef, {
              ...offerData,
              accepted: true,
            });
            console.log(
              'Offer approved and stored in offersConfirmed successfully'
            );

            const listingsRef = ref(db, 'listings');

            // Query to find listings with a specific address
            const soldListingsQuery = query(
              listingsRef,
              orderByChild('address'),
              equalTo(offerData.address)
            );

            // Get the snapshot of listings that match the query
            const snapshot = await get(soldListingsQuery);

            // Create an array of promises
            const operations = [];

            snapshot.forEach((childSnapshot) => {
              const listingId = childSnapshot.key;
              const listingData = childSnapshot.val();

              // Reference to the new location in soldListings
              const soldListingsRef = ref(db, `soldListings/${listingId}`);

              // Push operation promise to the array
              operations.push(
                set(soldListingsRef, listingData)
                  .then(() => remove(childSnapshot.ref))
                  .then(() => console.log('Moved Listing'))
              );
            });

            // Await all promises outside the loop
            await Promise.all(operations);
          } else {
            await remove(offerRef);
            // Add the declined offer to offersConfirmed
            await push(confirmedOffersRef, {
              ...offerData,
              declined: true,
            });
            console.log(
              'Offer declined and stored in offersConfirmed successfully'
            );
          }
        } else {
          console.log('Offer does not exist');
        }
      } catch (error) {
        console.error('Error processing offer: ', error);
        throw error;
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

    async getOffersByBrokerSender(senderID: string) {
      console.log(
        'In the getOfferByBrokerSender, this is the brokerId ' + senderID
      );
      const db = getDatabase();
      const offersRef = ref(db, 'offers/');
      const brokerOffersQuery = query(
        offersRef,
        orderByChild('senderID'),
        equalTo(senderID)
      );

      try {
        const snapshot = await get(brokerOffersQuery);
        console.log(brokerOffersQuery);
        if (snapshot.exists()) {
          console.log('snapshot exists');
          const offers: any = [];
          snapshot.forEach((childSnapshot) => {
            const offerData = childSnapshot.val();
            offerData.id = childSnapshot.key; // Save the unique key of the visit
            if (offerData.confirmed == false) offers.push(offerData);
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

    async getConfirmedOffersByBrokerSender(senderID: string) {
      console.log(
        'In the getOfferByBrokerSender, this is the brokerId ' + senderID
      );
      const db = getDatabase();
      const offersRef = ref(db, 'offersConfirmed/');
      const brokerOffersQuery = query(
        offersRef,
        orderByChild('senderID'),
        equalTo(senderID)
      );

      try {
        const snapshot = await get(brokerOffersQuery);
        console.log(brokerOffersQuery);
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
      console.log(offer.senderID);
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
        console.log('No broker found with ID: ' + brokerId);
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

    async calculateMortgage(
      principal: number,
      annualRate: number,
      loanTerm: number
    ): Promise<number> {
      return new Promise((resolve, reject) => {
        try {
          console.log('Starting mortgage calculation...');
          console.log(`Received principal: ${principal}, annualRate: ${annualRate}, loanTerm: ${loanTerm}`);
          
          const monthlyRate = annualRate / 100 / 12;
          console.log(`Calculated monthlyRate: ${monthlyRate}`);

          const numberOfPayments = loanTerm * 12;
          console.log(`Calculated numberOfPayments: ${numberOfPayments}`);

          
          const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
          console.log(`Calculated monthlyPayment: ${monthlyPayment}`);
          
          resolve(monthlyPayment);
        } catch (error) {
          console.error('Failed to calculate mortgage:', error);
          reject(error);
        }
      });
    },
  },
});
