import User from "../models/user.model.js";
import { Conversation } from "../models/conversation.model.js";
import { Counter } from "../models/counter.model.js";
import Message from "../models/message.model.js"; // Make sure Message is imported

// This is the updated function
export const getAppStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const siteVisitsCounter = await Counter.findOne({ name: "siteVisits" });

    // --- NEW LOGIC FOR COUNTING CONVERSATIONS ---
    // This counts unique pairs of people who have exchanged messages
    const uniqueConversations = await Message.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              { $gt: ["$senderId", "$receiverId"] },
              { users: ["$senderId", "$receiverId"] },
              { users: ["$receiverId", "$senderId"] },
            ],
          },
        },
      },
      {
        $count: "totalConversations",
      },
    ]);

    const totalConversations =
      uniqueConversations.length > 0
        ? uniqueConversations[0].totalConversations
        : 0;
    // --- END OF NEW LOGIC ---

    res.status(200).json({
      totalUsers,
      totalConversations, // Use the new calculated value
      totalVisits: siteVisitsCounter ? siteVisitsCounter.count : 0,
    });
  } catch (error) {
    console.error("Error in getAppStats: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Your logSiteVisit function remains the same
export const logSiteVisit = async (req, res) => {
  try {
    await Counter.findOneAndUpdate(
      { name: "siteVisits" },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Visit logged successfully" });
  } catch (error) {
    console.error("Error in logSiteVisit: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
