import { IMessage } from "./message.interface";
import Message from "./message.model";

const sendMessage = async (messageData: IMessage) => {
    return await Message.create(messageData);
};

const getUserMessages = async (userId: string) => {
    return await Message.find({
        $or: [{ senderID: userId }, { receiverID: userId }]
    }).populate('senderID receiverID').sort({ timestamp: -1 });
};

export default {
    sendMessage,
    getUserMessages
};
