import express from "express";

export function looger(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log(`${req.method} ${req.path} ${JSON.stringify(req.body)}`);
    next();
    
}