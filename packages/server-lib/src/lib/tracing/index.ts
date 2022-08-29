import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { getLogger } from '@myapp/logger';
import * as opentelemetry from '@opentelemetry/api';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';

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

  const provider = new NodeTracerProvider();

  initGoogleCloudTrace(provider);
  initZipkin(provider);

  provider.register();

  opentelemetry.trace.setGlobalTracerProvider(provider);

  logger.info({
    msg: 'tracer initialized',
  });
};
