import express from "express";
import { IController } from "nodels/models";


export class mytest implements IController {
    public path = '/tests';
    public router = express.Router();

    constructor() {
        this.intializeRoutes();
    }

    intializeRoutes() {
        this.router.get(this.path, this.getall);
        this.router.post(this.path, this.postrecord)
    }

    postrecord(req: express.Request, res: express.Response) {
        throw new Error("Method not implemented.");
    }


    public getall(req: express.Request, res: express.Response) {
        res.send('Sending from inside our controller');
    }


}


