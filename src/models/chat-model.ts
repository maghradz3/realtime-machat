import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },

    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: "",
    },
    groupImage: {
      type: String,
      default: "",
    },
    groupBio: {
      type: String,
      default: "",
    },
    admins: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    unreadCounts: {
      type: Object,
      default: {},
    },
    lastMessageAt: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["chats"]) {
  mongoose.deleteModel("chats");
}

if (!mongoose.models["messages"]) {
  require("./message-model");
}

const chatModel = mongoose.model("chats", chatSchema);

export default chatModel;
