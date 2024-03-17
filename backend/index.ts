import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';
import usersRouter, {checkToken} from "./routers/users";
import {ActiveConnections, IncomingMessage, UserFields} from "./types";

const app = express();
expressWs(app);
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
const router = express.Router();

const activeConnections: ActiveConnections = {};
router.ws('/chat', (ws, req) => {
    const id = crypto.randomUUID();
    console.log('Client connected id=', id);
    activeConnections[id] = ws;

    let user: UserFields;

    ws.on('message',async(message) => {

        const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;
        if  (parsedMessage.type === 'LOGIN') {
             user = await checkToken(parsedMessage.payload);
        } else if (parsedMessage.type === 'SEND_MESSAGE' ) {
            Object.values(activeConnections).forEach(connection => {
                const outgoingMsg = {
                    type: 'NEW_MESSAGE',
                    payload: {
                        user: user.displayName,
                        message: parsedMessage.payload,
                    }};
                connection.send(JSON.stringify(outgoingMsg));
            });
        }
    });

    ws.on('close', ()=> {
        console.log('Client disconnected', id);
        delete activeConnections[id];
    });
});

app.use(router);
app.use('/users', usersRouter);
const run = async () => {
    await mongoose.connect(config.mongoose.db);

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

void run();

