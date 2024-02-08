import { time } from "console";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    socketMessageId: {
      type: String,
      default: "",
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
  },

  { timestamps: true }
);

if (mongoose.models && mongoose.models["messages"]) {
  mongoose.deleteModel("messages");
}

const messageModel = mongoose.model("messages", messageSchema);
export default messageModel;
