import { NextFunction, Request, Response } from 'express';

import { getLogger } from '@myapp/logger';

const logger = getLogger('loggerMiddleware');

const getProcessingTimeInMS = (time: [number, number]): number => {
  return time[0] * 1000 + time[1] / 1e6;
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug({
    msg: 'req-log',
    requestId: (req as any)['id'], // injected by express-request-id library
    method: req.method,
    hostname: req.hostname,
    path: req.path,
  });
  const start = process.hrtime();

  res.once('finish', () => {
    // log end of the execution process
    const end = process.hrtime(start);
    const logObj = {
      msg: 'resp-log',
      requestId: (req as any)['id'], // injected by express-request-id library
      method: req.method,
      hostname: req.hostname,
      path: req.path,
      respStatus: res.statusCode,
      respTimeMs: getProcessingTimeInMS(end),
    };
    if (res.statusCode < 400) {
      logger.info(logObj);
    } else {
      logger.error(logObj);
    }
  });

  // execute next middleware/event handler
  next();
};
