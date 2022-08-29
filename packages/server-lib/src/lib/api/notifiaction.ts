import * as opentelemetry from '@opentelemetry/api';
import { SpanKind } from '@opentelemetry/api';

import { Request, Response } from 'express';
import { getExpressRouter, getExpressServer } from '../express';
import { requestIdHandler } from '../middlewares/requestIdHandler';
import { requestLogger } from '../middlewares/requestLogger';
import { requestTracer } from '../middlewares/tracer';

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
    span.end();
  });
  res.status(200).send({ message: 'Hey there from notification!' });
});

router.get('/success', async (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hello there! notification successful!' });
});

router.get('/failure', async (req: Request, res: Response) => {
  res.status(500).send({ message: 'Hello there! notification failed!' });
});

notificationsApp.use(router);
