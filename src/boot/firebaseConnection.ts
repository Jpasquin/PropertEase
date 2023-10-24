import { boot } from 'quasar/wrappers';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: 'AIzaSyBH3QuItRKMv2kxBtOaH9yMCuojfmYP5zc',
    authDomain: 'propertease-5ff7d.firebaseapp.com',
    projectId: 'propertease-5ff7d',
    storageBucket: 'propertease-5ff7d.appspot.com',
    messagingSenderId: '710347219343',
    appId: '1:710347219343:web:91442d0aaeafc536ffebfa',
    measurementId: 'G-JK7J8WTBR5',
  };

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const analytics = getAnalytics(firebaseApp);
  const db = getDatabase(firebaseApp);

  // Add the database instance to the app's global properties
  app.config.globalProperties.$db = db;
});
