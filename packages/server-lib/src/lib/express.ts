import express, {
  Express,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';

import { corsHandler } from './middlewares/corsHandler';

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
