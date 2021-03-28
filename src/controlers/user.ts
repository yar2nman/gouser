import express from "express";
import { IController } from "nodels/models";
import * as admin from 'firebase-admin';

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

    }
    getAllItems(request: express.Request, response: express.Response) {

        var users: admin.auth.UserRecord[] = [];
        // List All Users.
        admin
        .auth()
        .listUsers()
        .then((listUsersResult) => {
            listUsersResult.users.forEach((userRecord) => {
                users.push(userRecord);
            console.log('user', userRecord.toJSON());
            });
        }).then(() => {
            response.send(users);
        })
        .catch((error) => {
            console.log('Error listing users:', error);
        });
    }

    getItemById(request: express.Request, response: express.Response) {
        const id = request.params.id;
        admin
            .auth()
            .getUser(id)
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                response.send(userRecord)
                console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
            })
            .catch((error) => {
                console.log('Error fetching user data:', error);
            });
    }
    getItemByEmail(request: express.Request, response: express.Response) {
        const email = request.params.email;
        admin
            .auth()
            .getUserByEmail(email)
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                response.send(userRecord)
                console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
            })
            .catch((error) => {
                console.log('Error fetching user data:', error);
            });
    }


    modifyItem(request: express.Request, response: express.Response) {
        throw new Error("Method not implemented.");
    }

    deleteItem(request: express.Request, response: express.Response) {
        const uid = request.params.id;
        admin
            .auth()
            .deleteUser(uid)
            .then(() => {
            console.log('Successfully deleted user');
            response.status(200).send(uid);
            })
            .catch((error) => {
            console.log('Error deleting user:', error);
            });
    }
    
    createItem(request: express.Request, response: express.Response) {
        const user: any = request.body;
        admin
            .auth()
            .createUser(user)
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                response.send(userRecord.uid)
                console.log('Successfully created new user:', userRecord.uid);
            })
            .catch((error) => {
                console.log('Error creating new user:', error);
            });
    }

} 