import { Request, Response } from 'express';
import { getExpressRouter, getExpressServer } from '../express';

export const notificationsApp = getExpressServer();

const router = getExpressRouter();

router.get('/', async (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hey there from notification!' });
});

router.get('/success', async (req: Request, res: Response) => {
  res.status(200).send({ message: 'Hello there! notification successful!' });
});

router.get('/failure', async (req: Request, res: Response) => {
  res.status(500).send({ message: 'Hello there! notification failed!' });
});

notificationsApp.use(router);