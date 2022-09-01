import { getLogger } from '@myapp/logger';
import * as opentelemetry from '@opentelemetry/api';
import { SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { NextFunction, Request, Response } from 'express';

const logger = getLogger('tracerMiddleware');
const tracer = opentelemetry.trace.getTracer('reqTracer');

export const requestTracer = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const remoteCtx = opentelemetry.propagation.extract(
    opentelemetry.ROOT_CONTEXT,
    req.headers
  );

  tracer.startActiveSpan(
    'serverReqHandler',
    { kind: SpanKind.SERVER },
    remoteCtx,
    (serverReqHandlerSpan) => {
      serverReqHandlerSpan.setAttribute(
        'reqId',
        (req as any)['id'] || 'id-not-found'
      );

      res.once('finish', () => {
        serverReqHandlerSpan.setAttribute('status', res.statusCode);
        serverReqHandlerSpan.setStatus({ code: SpanStatusCode.OK });
        serverReqHandlerSpan.end();
      });

      res.once('error', (err: Error) => {
        serverReqHandlerSpan.setAttribute('errorName', err.name);
        serverReqHandlerSpan.setAttribute('errMsg', err.message);
        serverReqHandlerSpan.setStatus({
          code: SpanStatusCode.ERROR,
          message: err.message,
        });
        serverReqHandlerSpan.end();
      });

      next();
    }
  );
};
