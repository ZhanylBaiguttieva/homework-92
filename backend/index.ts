import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';
import usersRouter from "./routers/users";
import {ActiveConnections, IncomingMessage, UserFields} from "./types";
import {checkToken, getActiveUsers, getLastMessages, saveMessage} from "./helpers/helpers";

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
    activeConnections[id] = ws;

    let user: UserFields;

    ws.on('message',async(message) => {

        const parsedMessage = JSON.parse(message.toString()) as IncomingMessage;
        if  (parsedMessage.type === 'LOGIN') {
             user = await checkToken(parsedMessage.payload) as UserFields;
             const activeUsers = await getActiveUsers();
             const lastMessages = await getLastMessages();
             ws.send(JSON.stringify({
                 type: 'LAST_UPDATES',
                 payload: {
                     activeUsers: activeUsers,
                     messages: lastMessages,
                 }}));
        } else if (parsedMessage.type === 'SEND_MESSAGE' ) {
            await saveMessage({user: user, message: parsedMessage.payload});
            Object.values(activeConnections).forEach(connection => {
                const outgoingMsg = {
                    type: 'NEW_MESSAGE',
                    payload: {
                        user: user,
                        text: parsedMessage.payload,
                        datetime: new Date(),
                    }};
                connection.send(JSON.stringify(outgoingMsg));
            });
        }
    });

    ws.on('close', async()=> {
        console.log('Client disconnected', id);
        delete activeConnections[id];
        const activeUsers = await getActiveUsers();
        Object.values(activeConnections).forEach(connection => {
            const outgoingMsg = {
                type: 'ACTIVE_USERS',
                payload: {
                    activeUsers: activeUsers,
                }};
            connection.send(JSON.stringify(outgoingMsg));
        });
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
