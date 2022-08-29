import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import * as opentelemetry from '@opentelemetry/api';
import { SpanKind } from '@opentelemetry/api';
// import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { NextFunction, Request, Response } from 'express';

// const zipkinExporter = new ZipkinExporter({
//   url: 'http://localhost:9411/api/v2/spans',
//   serviceName: 'movies-service',
// });

// const zipkinProcessor = new SimpleSpanProcessor(zipkinExporter);

import { getLogger } from '@myapp/logger';

const provider = new NodeTracerProvider();

const exporter = new TraceExporter();

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
// provider.addSpanProcessor(zipkinProcessor);
provider.register();

opentelemetry.trace.setGlobalTracerProvider(provider);

const logger = getLogger('tracerMiddleware');

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
