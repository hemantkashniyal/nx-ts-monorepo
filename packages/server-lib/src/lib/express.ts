import express, { Express, Router } from 'express';

import { authenticator } from './middlewares/authenticator';
import { corsHandler } from './middlewares/corsHandler';
import requestIdHandler from './middlewares/requestIdHandler';
import { requestLogger } from './middlewares/requestLogger';
import { requestTracer } from './middlewares/tracer';

export const getExpressServer = (): Express => {
  const app = express();
  app.use(requestIdHandler());
  app.use(requestTracer);
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(corsHandler);
  app.use(requestLogger);
  return app;
};

export const getExpressRouter = (): Router => {
  return Router();
};

export const getExpressAuthenticatedRouter = (): Router => {
  const router = Router();
  router.use(authenticator);
  return router;
};
