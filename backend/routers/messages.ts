import {Router} from "express";
import auth, {RequestWithUser} from "../middleware/auth";
import Message from "../models/Message";

const messagesRouter = Router();

messagesRouter.get('/', auth, async (req: RequestWithUser,res,next) => {
    try {
        const messages = await Message
            .find()
            .limit(30)
            .populate('user', 'displayName')
            .sort('asc');
        res.send(messages);

    } catch(e) {
        next(e);
    }
});

export default messagesRouter;