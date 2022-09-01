import { getLogger } from '@myapp/logger';
import * as opentelemetry from '@opentelemetry/api';
import { SpanKind } from '@opentelemetry/api';
import { Request, Response } from 'express';
import { getExpressRouter, getExpressServer } from '../express/express';
import { requestIdHandler } from '../express/middlewares/requestIdHandler';
import { requestLogger } from '../express/middlewares/requestLogger';
import { requestTracer } from '../express/middlewares/tracer';

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
    message: 'test log msg',
  });
  logger.alert({
    message: 'test log msg',
  });
  logger.critical({
    message: 'test log msg',
  });
  logger.error({
    message: 'test log msg',
  });
  logger.warning({
    message: 'test log msg',
  });
  logger.notice({
    message: 'test log msg',
  });
  logger.info({
    message: 'test log msg',
  });
  logger.debug({
    message: 'test log msg',
  });
  logger.trace({
    message: 'test log msg',
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
