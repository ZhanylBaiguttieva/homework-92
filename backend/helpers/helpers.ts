import {UserFields} from "../types";
import User from "../models/User";
import Message from "../models/Message";

export const checkToken = async (token: string) : Promise<UserFields | undefined> => {
    const user = await User.findOne({token: token});

    if(!user) return;

    return  {
        email: user?.email,
        displayName: user?.displayName,
        token: user?.token,
        role: user?.role,
        password: user?.password,
        isActive: true,
    };
};

export const getActiveUsers = async() => {
    const activeUsers = await User.find({isActive: true});
    if(!activeUsers) return;
    return activeUsers;
}

export const getLastMessages = async () => {
    const lastMessages = await Message
        .find()
        .limit(30)
        .populate('user', 'displayName')
        .sort('asc');
    return lastMessages;
};

interface ChatMessage {
    user: UserFields;
    message: string;
}
export const saveMessage = async(chatMessage: ChatMessage) => {
    const user = await User.findOne({user:chatMessage.user});
    if(!user) return;
    const newMessage = new Message({
        user: user.displayName,
        message: chatMessage.message,
        datetime: new Date(),
    });
    await newMessage.save();
};