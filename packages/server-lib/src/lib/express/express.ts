import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';

import { getCorseHandler } from './middlewares/corsHandler';
import { getErrorReporterHandler } from './middlewares/errorReporter';

export const getRawExpressServer = () => {
  return express();
};

export const getBasicExpressServer = () => {
  const app = getRawExpressServer();
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  return app;
};

export const getExpressServer = (
  middlewares: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[] = []
): Express => {
  const app = getBasicExpressServer();
  app.use(getCorseHandler());

  middlewares.forEach((middleware) => app.use(middleware));

  app.use(getErrorReporterHandler());
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
