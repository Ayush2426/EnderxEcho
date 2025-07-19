import Users from '../models/user.model.js';
import Messages from '../models/message.model.js';
export const getUsersforSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await Users.find({ _id: { $ne: loggedInUserId }}).select('-password');

        res.status(200).json({
            filteredUsers
        })
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Messages.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json({
            messages
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: "Internal server error" });        
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageurl;   
        if(image){
            const uploadRes = await cloudinary.uploader.upload(image);
            imageurl = uploadRes.secure_url;
        }

        const newMessage = await Messages({
            senderId,
            receiverId,
            text,
            image: image ? imageurl : null
        })

        await newMessage.save();

        // Socket functionality to emit the new message
        res.status(200).json({
           newMessage
        });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal server error" });        
    }
}