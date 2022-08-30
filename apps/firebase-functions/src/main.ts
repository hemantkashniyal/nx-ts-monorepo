import * as functions from 'firebase-functions';

import { getLogger } from '@myapp/logger';
import { notificationsApp } from '@myapp/server-lib/lib/api/notifiaction';
import { simulationsApp } from '@myapp/server-lib/lib/api/simulation';

const logger = getLogger('firebase-functions');

export const notification = functions.https.onRequest(notificationsApp);
export const simulation = functions.https.onRequest(simulationsApp);
