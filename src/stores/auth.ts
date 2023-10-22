import { defineStore } from 'pinia';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  orderByChild,
  equalTo,
  query,
} from 'firebase/database';
import User from '../interfaces/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  getters: {
    isSignedIn(): boolean {
      return !!this.user;
    },
    isBroker(): boolean {
      if (this.user) return this.user.accountType == 'broker';
      return false;
    },
    isAdmin(): boolean {
      if (this.user) return this.user.accountType == 'admin';
      return false;
    },
  },

  actions: {
    initializeAuth() {
      return new Promise(async (resolve) => {
        const auth = getAuth();
        const db = getDatabase();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Create a reference to the root of the database
            const rootRef = ref(db);

            // Create a reference to the user's data using their UID
            const userRef = child(rootRef, 'users/' + user.uid);

            // Fetch the user's data from the Realtime Database
            const userSnapshot = await get(userRef);

            if (userSnapshot.exists()) {
              console.log(userSnapshot.val()); // Log the related user data
              this.user = userSnapshot.val();
              // If needed, store this data in local state or perform other tasks
              // Example:
              // this.relatedUserData = userSnapshot.val();
            } else {
              console.log('No related user data found.');
            }
          }

          // Resolve the promise after the first call
          resolve(null);

          // Unsubscribe from the listener
          unsubscribe();
        });
      });
    },

    async createUser(userData: User, password: string) {
      const auth = getAuth();
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          password
        );
        console.log('Sign In Success.');

        // Add user to Realtime Database
        const db = getDatabase();
        const uid = userCredential.user.uid;
        await set(ref(db, 'users/' + uid), userData);

        window.location.href = '/';
      } catch (error) {
        console.log(error);
      }
    },

    async signInUser(email: string, password: string) {
      const auth = getAuth();

      signInWithEmailAndPassword(auth, email, password)
        .then((auth) => {
          console.log('Sign In Success.');
          window.location.href = '/';
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async signOutUser() {
      const auth = getAuth();

      auth.signOut();
      window.location.href = '/';
    },

    async getUser() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        return user.uid;
      } else {
        return null;
      }
    },
  },
});
