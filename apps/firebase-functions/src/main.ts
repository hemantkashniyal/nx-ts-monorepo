import { initLogger, initTracer } from '@myapp/logger';
import * as functions from 'firebase-functions';

initLogger();
initTracer();

import { notificationsApp } from '@myapp/server-lib/lib/api/notifiaction';
import { simulationsApp } from '@myapp/server-lib/lib/api/simulation';

export const notification = functions.https.onRequest(notificationsApp);
export const simulation = functions.https.onRequest(simulationsApp);
