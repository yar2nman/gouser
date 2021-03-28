import express from "express";
import * as mongoose from 'mongoose';


export interface IController {
    path: string;
    router: express.Router;
    intializeRoutes: Function;
}

export interface Post{
    author: String,
    content: String,
    title: String,
}

 
const postSchema = new mongoose.Schema({
  author: String,
  content: String,
  title: String,
});
 
export const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);


export interface User {
  uid:                  string;
  email:                string;
  emailVerified:        boolean;
  disabled:             boolean;
  metadata:             Metadata;
  passwordHash:         string;
  passwordSalt:         string;
  tokensValidAfterTime: string;
  providerData:         ProviderDatum[];
}

export interface Metadata {
  lastSignInTime: null;
  creationTime:   string;
}

export interface ProviderDatum {
  uid:        string;
  email:      string;
  providerId: string;
}

