import {WebSocket} from 'ws';
import {Model} from "mongoose";

export interface ActiveConnections  {
    [id: string]: WebSocket;
}

export interface IncomingMessage {
    type: string;
    payload: string;
}

export interface UserFields {
    email: string;
    password: string;
    token: string;
    role: string;
    displayName?: string;
    googleId?: string;
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;
