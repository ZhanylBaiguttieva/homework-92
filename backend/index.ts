import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config';
import usersRouter from "./routers/users";

const app = express();
expressWs(app);
const port = 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
const router = express.Router();

router.ws('/chatRoom', (ws, req) => {
    console.log('client connected');
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