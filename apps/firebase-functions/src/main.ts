import * as functions from 'firebase-functions';

import { getLogger } from '@myapp/logger';
import { notificationsApp } from '@myapp/server-lib/lib/api/notifiaction';
import { simulationsApp } from '@myapp/server-lib/lib/api/simulation';

const logger = getLogger('firebase-functions');

export const helloWorld = functions.https.onRequest((request, response) => {
  console.log('@#@# APP_LOG_LEVEL:', process.env.APP_LOG_LEVEL);
  logger.emergency({
    msg: 'test log msg',
  });
  logger.alert({
    msg: 'test log msg',
  });
  logger.critical({
    msg: 'test log msg',
  });
  logger.error({
    msg: 'test log msg',
  });
  logger.warning({
    msg: 'test log msg',
  });
  logger.notice({
    msg: 'test log msg',
  });
  logger.info({
    msg: 'test log msg',
  });
  logger.debug({
    msg: 'test log msg',
  });
  logger.trace({
    msg: 'test log msg',
  });
  response.status(200).send({ message: 'Hello, World!' });
});

export const notification = functions.https.onRequest(notificationsApp);
export const simulation = functions.https.onRequest(simulationsApp);
