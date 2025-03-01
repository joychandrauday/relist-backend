import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage & Document>(
    {
        senderID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        receiverID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Message = mongoose.model<IMessage & Document>('Message', messageSchema);

export default Message;