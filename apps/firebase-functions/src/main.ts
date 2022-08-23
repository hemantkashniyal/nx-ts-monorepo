import { clientLib } from '@myapp/client-lib';
import { serverLib } from '@myapp/server-lib';
import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {

  response.send('Hello from Firebase!' + serverLib() + clientLib());
});
