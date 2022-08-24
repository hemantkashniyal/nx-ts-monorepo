import { clientLib } from '@myapp/client-lib';
import { serverLib } from '@myapp/server-lib';
import {ProductConfigV1} from '@myapp/common-models/lib/productConfig/v1/productConfig'
import * as functions from 'firebase-functions';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  const productConfig: ProductConfigV1 | undefined  = undefined;

  console.log("productConfig:", productConfig);
  response.send('Hello from Firebase!' + serverLib() + clientLib());
});
