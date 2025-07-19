import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
{
        senderId:{
        type: String,
        required: true,
        ref: 'User'
    },
    recieverId:{
        type: String,
        required: true,
        ref: 'User'
    },
    text:{
        type: String,
    },
    image:{
        type: String,
    }
},
    {timestamps: true},
)

const Message = mongoose.model('Message', messageSchema);
export default Message;