import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';

import { corsHandler } from './middlewares/corsHandler';
import requestIdHandler from './middlewares/requestIdHandler';
import { requestLogger } from './middlewares/requestLogger';
import { requestTracer } from './middlewares/tracer';

export const getExpressServer = (
  middlewares: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[] = []
): Express => {
  const app = express();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(corsHandler);
  app.use(requestIdHandler());
  app.use(requestTracer);

  app.use(requestLogger);

  middlewares.forEach((middleware) => app.use(middleware));
  return app;
};

export const getExpressRouter = (
  middlewares: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[] = []
): Router => {
  const router = Router();
  middlewares.forEach((middleware) => router.use(middleware));
  return router;
};
