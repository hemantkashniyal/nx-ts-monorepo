import { getLogger } from '@myapp/logger';
import * as opentelemetry from '@opentelemetry/api';
import { SpanKind } from '@opentelemetry/api';
import { Request, Response } from 'express';
import { getExpressRouter, getExpressServer } from '../express';
import { requestIdHandler } from '../middlewares/requestIdHandler';
import { requestLogger } from '../middlewares/requestLogger';
import { requestTracer } from '../middlewares/tracer';

const logger = getLogger('notification-server');

const tracer = opentelemetry.trace.getTracer('notificationsTracer');

export const notificationsApp = getExpressServer([
  requestIdHandler(),
  requestTracer,
  requestLogger,
]);

const router = getExpressRouter();

router.get('/', async (req: Request, res: Response) => {
  // Create a span.
  tracer.startActiveSpan('processing', { kind: SpanKind.INTERNAL }, (span) => {
    span.setAttribute('someTestAttribute', 'test-123');
    // do some computations here and measure attributes and tags in the created span
    span.end();
  });
  res.status(200).send({ message: 'Hey there from notification!' });
});

router.get('/hello', async (req: Request, res: Response) => {
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
  res.status(200).send({ message: 'Hello, World!' });
});

router.get('/success', async (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hello there! notification successful!' });
});

router.get('/failure', async (req: Request, res: Response) => {
  res.status(500).send({ message: 'Hello there! notification failed!' });
});

router.get('/exception', async (req: Request, res: Response) => {
  JSON.parse('{"malformedJson": true');
});

notificationsApp.use(router);
