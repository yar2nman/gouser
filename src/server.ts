import express from 'express';
import mongoose = require("mongoose");
import cors = require('cors');
import 'dotenv/config';

// middle wares
import {json} from 'body-parser';
import {looger} from './middleWare/mymiddlewares'

// models
import { IController } from 'nodels/models';


// controllers
import { mytest } from './controlers/test';
import PostsController from './controlers/posts';
import { UserController } from './controlers/user';
import {errorMiddleware} from './middleWare/error.middleware';


//#region mongo start
const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_PATH,
  } = process.env;
   
  mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}?authSource=admin`);

//#endregion


const PORT = process.env.PORT;

const app = express();

const controllers: IController[] = [new mytest(),
                                    new PostsController(),
                                    new UserController()];

app.route('/')
.get((request, response) => {
  response.send('Hello world!');
});

app.post('/', (request, response) => {
    response.send(request.body);
  });


initializeMiddlewares();
initializeControllers(controllers);
initializeErroHandling();
 

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);

});


function initializeControllers(controllers: IController[]) {
    controllers.forEach((controller: IController) => {
        app.use('/api', controller.router);
      });
}

function initializeMiddlewares() {
  app.use(cors());
    app.use(json());
    app.use(looger);
}




function initializeErroHandling() {
    app.use(errorMiddleware);
}

