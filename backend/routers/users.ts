import {Router} from "express";
import mongoose from "mongoose";
import User from "../models/User";
import {UserFields} from "../types";

const usersRouter = Router();

usersRouter.post('/', async (req, res, next) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            displayName: req.body.displayName,
            isActive: true,
        });
        user.generateToken();
        await user.save();
        res.send({ message: 'ok!', user });
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(422).send(e);
        }
        next(e);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(422).send({ error: 'User not found' });
        }

        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            return res.status(422).send({ error: 'Password is wrong' });
        }
        user.generateToken();
        user.isActive = true;
        await user.save();

        return res.send({ message: 'Email and password are correct!', user });
    } catch (e) {
        next(e);
    }
});


usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const headerValue = req.get('Authorization');
        const successMessage = { message: 'Success!' };

        if (!headerValue) {
            return res.send({ ...successMessage, stage: 'No header' });
        }

        const [_bearer, token] = headerValue.split(' ');
        if (!token) {
            return res.send({ ...successMessage, stage: 'No token' });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res.send({ ...successMessage, stage: 'No user' });
        }

        user.generateToken();
        user.isActive = false;
        await user.save();

        return res.send({ ...successMessage, stage: 'Success' });
    } catch (e) {
        next(e);
    }
});

export default usersRouter;