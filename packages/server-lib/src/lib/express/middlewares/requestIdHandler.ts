import { NextFunction, Request, Response } from 'express';

import { v4 as uuidv4 } from 'uuid';

function generateV4UUID(_request: Request) {
  return uuidv4();
}

const ATTRIBUTE_NAME = 'id';

export function requestIdHandler({
  generator = generateV4UUID,
  headerName = 'X-Request-Id',
  setHeader = true,
} = {}) {
  return function requestIdAssigner(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const oldValue = request.get(headerName);
    const id = oldValue === undefined ? generator(request) : oldValue;

    if (setHeader) {
      response.set(headerName, id);
    }

    (request as any)[ATTRIBUTE_NAME] = id;
    next();
  };
}
