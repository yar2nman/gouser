import express from "express";
import { IController } from "nodels/models";
import * as admin from 'firebase-admin';
import { HttpException } from "../middleWare/error.middleware";

export class UserController implements IController {

    public path = '/user';
    public router = express.Router();
    public app: admin.app.App;


    /**
     *
     */
    constructor() {
        this.intializeRoutes();
        this.app = admin.initializeApp({
            credential: admin.credential.cert('./adminservicekey.json'),
        });

        
    }


    intializeRoutes() {
        this.router.get(this.path, this.getAllItems);
        this.router.get(`${this.path}/id/:id`, this.getItemById);
        this.router.get(`${this.path}/email/:email`, this.getItemByEmail);
        this.router.patch(`${this.path}/:id`, this.modifyItem);
        this.router.delete(`${this.path}/:id`, this.deleteItem);
        this.router.post(this.path, this.createItem);
        this.router.post(`${this.path}/:id/customclaim`, this.setCustomClaim);

    }
    getAllItems(request: express.Request, response: express.Response, next: express.NextFunction) {

        var users: admin.auth.UserRecord[] = [];
        // List All Users.
        admin
        .auth()
        .listUsers()
        .then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
                users.push(userRecord);
            });
        }).then(() => {
            response.send(users);
        })
        .catch((error) => {
            console.log('Error listing users:', error);
            next(new HttpException(404, `Error Listing users: ${error.errorInfo.message}`));
        });
    }

    getItemById(request: express.Request, response: express.Response, next: express.NextFunction) {
        const id = request.params.id;
        admin
            .auth()
            .getUser(id)
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                response.send(userRecord)
            })
            .catch((error) => {
                next(new HttpException(404, `Can not get user ${id}: ${error.errorInfo.message}`));
                console.log('Error fetching user data:', error);
            });
    }
    getItemByEmail(request: express.Request, response: express.Response, next: express.NextFunction) {
        const email = request.params.email;
        admin
            .auth()
            .getUserByEmail(email)
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                response.send(userRecord)
            })
            .catch((error) => {
                console.log('Error fetching user data:', error);
                next(new HttpException(404, `Can not get user ${email}: ${error.errorInfo.message}`));
            });
    }


    modifyItem(request: express.Request, response: express.Response, next: express.NextFunction) {
        console.log('batch reached');
        
        const uid = request.params.id;
        console.log(uid);
        
        const user: admin.auth.UpdateRequest = request.body;        

        console.log(user);
        // response.send(user);
        // return;

        admin.auth()
        .updateUser(uid, user)
        .then(r => response.send(r))
        .catch((error) => {
            console.log('Error updating user:', error);
            next(new HttpException(404, `Could not update user: ${error.errorInfo.message}`));
        });
    }

    deleteItem(request: express.Request, response: express.Response, next: express.NextFunction) {
        const uid = request.params.id;
        admin
            .auth()
            .deleteUser(uid)
            .then(() => {
            response.status(200).send(uid);
            })
            .catch((error) => {
            console.log('Error deleting user:', error);
            next(new HttpException(404, `Can not delete user ${uid}: ${error.errorInfo.message}`));
            });
    }
    
    createItem(request: express.Request, response: express.Response, next: express.NextFunction) {
        const user: any = request.body;
        admin
            .auth()
            .createUser(user)
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                response.send(userRecord.uid)
            })
            .catch((error) => {
                console.log('Error creating new user:', error);
                next(new HttpException(404, `Could not create user: ${error.errorInfo.message}`));
            });
    }

    setCustomClaim(request: express.Request, response: express.Response, next: express.NextFunction) {
        
        const uid = request.params.id;
        
        const customClaims: any = request.body;
        admin
            .auth()
            .setCustomUserClaims(uid, customClaims)
            .then(() => {
                // See the UserRecord reference doc for the contents of userRecord.
                response.send(customClaims);
            })
            .catch((error) => {
                console.log('Error setting user claims:', error.errorInfo.message);
                next(new HttpException(404,  error.errorInfo.message));
            });
    }

} 