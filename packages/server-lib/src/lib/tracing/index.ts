import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { CloudPropagator } from '@google-cloud/opentelemetry-cloud-trace-propagator';
import { getLogger } from '@myapp/logger';
import * as opentelemetry from '@opentelemetry/api';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import {
  InstrumentationOption,
  registerInstrumentations,
} from '@opentelemetry/instrumentation';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { Resource } from '@opentelemetry/resources';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const logger = getLogger('tracer');

const initGoogleCloudTrace = (provider: NodeTracerProvider) => {
  const cloudTraceExporter = new TraceExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(cloudTraceExporter));
};

const initZipkin = (provider: NodeTracerProvider) => {
  const zipkinExporter = new ZipkinExporter({
    url: 'http://localhost:9411/api/v2/spans',
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(zipkinExporter));
};

let tracerInitialized = false;

export const initTracer = () => {
  if (tracerInitialized) {
    logger.warning({
      msg: 'tracer already initialized',
    });
    return;
  }

  tracerInitialized = true;

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'basic-service',
    }),
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      // Express instrumentation expects HTTP layer to be instrumented
      HttpInstrumentation as unknown as InstrumentationOption,
      ExpressInstrumentation as unknown as InstrumentationOption,
    ],
  });

  initGoogleCloudTrace(provider);
  initZipkin(provider);

  provider.register({
    // Use CloudPropagator
    propagator: new CloudPropagator(),
  });

  opentelemetry.trace.setGlobalTracerProvider(provider);

  logger.info({
    msg: 'tracer initialized',
  });
};
