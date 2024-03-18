import {WebSocket} from 'ws';
import {Model} from "mongoose";
import User from "./models/User";

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
    isActive: boolean;
}

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

type UserModel = Model<UserFields, {}, UserMethods>;
