import { ErrorReporting } from '@google-cloud/error-reporting';
import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';

import { corsHandler } from './middlewares/corsHandler';

const errors = new ErrorReporting();

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
  middlewares.forEach((middleware) => app.use(middleware));

  // Note that express error handling middleware should be attached after all
  // the other routes and use() calls. See the Express.js docs.
  app.use(errors.express);
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

export const enableErrorReporting = (app: Express) => {
  app.use(errors.express);
};
