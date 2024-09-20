// controllers/chatController.js
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

//Function to get all conversation
const getConversations = async (req, res) => {
    try {
        // Find all conversations where the current user's ID is in the 'members' array, sorted by creation date
        const conversations = await Conversation.find({
            members: { $in: [req.user.id] } 
        }).sort({ createdAt: -1 });

        // Create an array of promises to populate each conversation with recipient info
        const conversationsWithReceipientInfo = await Promise.all(
            conversations.map(async (conversation) => {
                // Assuming that `members` is an array with at least two user IDs
                const receipientId = conversation.members.find((memberId) => memberId !== req.user.id);

                // Fetch the recipient user data from the User schema
                const receipient = await User.findById(receipientId).select('firstName picturePath'); // Select only required fields

                // Return a new object combining the conversation and recipient info
                return {
                    ...conversation.toObject(), // Spread conversation data
                    receipientName: receipient?.firstName, // Add recipient name (optional chaining in case recipient is not found)
                    receipientPicturePath: receipient?.picturePath, // Add recipient profile picture
                };
            })
        );

        // Return the conversations with recipient information
        return res.status(200).json(conversationsWithReceipientInfo);
    } catch (error) {
        console.error("Error fetching conversations: ", error);
        return res.status(500).json({ message: "Failed to fetch conversations" });
    }
};



// Function to create or get a conversation
const createOrGetConversation = async (req, res) => {
    try {
        const { participants } = req.body;

        // Validate participants array
        if (!participants || participants.length === 0) {
            return res.status(400).json({ message: 'Participants are required.' });
        }

        // Find existing conversation with the given participants
        let conversation = await Conversation.findOne({
            members: { $all: participants, $size: participants.length },
        });

        // If conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = new Conversation({ members: participants });
            await conversation.save();
        } else {
            // If conversation exists but some participants are missing, add them
            const newParticipants = participants.filter(p => !conversation.members.includes(p));
            if (newParticipants.length > 0) {
                conversation.members.push(...newParticipants);
                await conversation.save();
            }
        }

        // Respond with the conversation ID
        res.status(200).json({ conversationId: conversation._id });
    } catch (error) {
        console.error('Error creating or getting conversation:', error);
        res.status(500).json({ message: 'Failed to create or get conversation' });
    }
};


// Function to send a message
const sendMessage = async (req, res) => {
    try {
        const { conversationId, senderId, text } = req.body;
        if (!conversationId || !senderId || !text) {
            return res.status(400).json({ message: 'conversationId, senderId, and text are required.' });
        }
        const message = new Message({ conversationId, sender: senderId, text });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

// Function to fetch all messages in a conversation
const fetchChat = async (req, res) => {
    try {
        const { id: conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ message: 'conversationId is required.' });
        }
        const messages = await Message.find({ conversationId })
            .populate('sender', 'firstName picturePath')
            .sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

export { createOrGetConversation, sendMessage, fetchChat, getConversations };
