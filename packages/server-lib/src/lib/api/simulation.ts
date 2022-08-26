import { Request, Response } from 'express';
import { getExpressRouter, getExpressServer } from '../express';

export const simulationsApp = getExpressServer();

const router = getExpressRouter();

router.get('/', async (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hey there from simulation!' });
});

router.get('/simulate', async (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hello there! simulation successful!' });
});

router.get('/failure', async (req: Request, res: Response) => {
  res.status(500).send({ message: 'Hello there! simulation failed!' });
});

simulationsApp.use(router);
