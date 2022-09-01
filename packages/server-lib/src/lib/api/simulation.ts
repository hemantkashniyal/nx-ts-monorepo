import { Request, Response } from 'express';
import { getExpressRouter, getExpressServer } from '../express/express';
import { requestIdHandler } from '../express/middlewares/requestIdHandler';
import { requestLogger } from '../express/middlewares/requestLogger';
import { requestTracer } from '../express/middlewares/tracer';

export const simulationsApp = getExpressServer([
  requestIdHandler(),
  requestTracer,
  requestLogger,
]);

const router = getExpressRouter();

router.get('/', async (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hey there from simulation!' });
});

router.get('/success', async (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hello there! simulation successful!' });
});

router.get('/failure', async (req: Request, res: Response) => {
  res.status(500).send({ message: 'Hello there! simulation failed!' });
});

router.get('/exception', async (req: Request, res: Response) => {
  JSON.parse('{"malformedJson": true');
});

simulationsApp.use(router);
