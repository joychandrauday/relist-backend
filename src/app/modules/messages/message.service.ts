import { IMessage } from "./message.interface";
import Message from "./message.model";

const sendMessage = async (messageData: IMessage) => {
    return await Message.create(messageData);
};

const getUserMessages = async (userId: string, receiverId: string) => {
    return await Message.find({
        $or: [
            { senderID: userId, receiverID: receiverId },
            { senderID: receiverId, receiverID: userId }
        ]
    })
        .populate('senderID receiverID', '-password')
        .sort({ timestamp: -1 })
        .select("-password");
};


export default {
    sendMessage,
    getUserMessages
};
