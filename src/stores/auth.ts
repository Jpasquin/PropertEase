import { defineStore } from 'pinia';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";

export const useAuthStore = defineStore('auth', {
  state: () => ({
  }),

  getters: {
    getUser () {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          console.log(uid)
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
    }
  },

  actions: {
    createUser(email: string, password: string) {
      const auth = getAuth();

      createUserWithEmailAndPassword(auth, email, password)
        .then(auth => {
          console.log('Sign In Success.');
          this.router.push('/');
        })
        .catch(error => {
          console.log(error)
        })
    },

    signInUser(email: string, password: string) {
      console.log(email);
    }
  }
});
