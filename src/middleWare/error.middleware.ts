
import * as express from 'express';
 
export function errorMiddleware(error: HttpException, request: express.Request, response: express.Response, next: express.NextFunction) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  response
    .status(status)
    .send({
      status,
      message,
    })
}
 







export class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.message = message;
    }
  }


export class ItemNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Item with id ${id} not found`);
  }
}
   
