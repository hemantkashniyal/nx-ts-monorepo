import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';

export async function authenticator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  console.log(authorization);

  if (!authorization) return res.status(401).send({ message: 'Unauthorized' });

  if (!authorization.startsWith('Bearer'))
    return res.status(401).send({ message: 'Unauthorized' });

  const split = authorization.split('Bearer ');
  if (split.length !== 2)
    return res.status(401).send({ message: 'Unauthorized' });

  const token = split[1];

  try {
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);
    console.log('decodedToken', JSON.stringify(decodedToken));
    res.locals = {
      ...res.locals,
      uid: decodedToken.uid,
      role: decodedToken['role'],
      email: decodedToken.email,
    };
    return next();
  } catch (err) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
}
