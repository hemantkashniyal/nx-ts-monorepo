import { getLogger } from '@myapp/logger';
import * as opentelemetry from '@opentelemetry/api';
import { SpanKind } from '@opentelemetry/api';
import { NextFunction, Request, Response } from 'express';
import { initTracer } from '../tracing';

const logger = getLogger('tracerMiddleware');

initTracer();

export const requestTracer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tracer = opentelemetry.trace.getTracer('reqTracer');

  // Create a span.
  const childSpan = tracer.startSpan(
    'serverReqHandler',
    { kind: SpanKind.SERVER },
    opentelemetry.context.active()
  );

  // Set attributes to the span.
  childSpan.setAttribute('reqId', (req as any)['id'] || 'id-not-found');

  // Annotate our span to capture metadata about our operation
  next();

  childSpan.setAttribute('status', res.statusCode);

  // Be sure to end the span.
  childSpan.end();
};
