"use server";

import messageModel from "@/models/message-model";
import chatModel from "@/models/chat-model";

export const SendNewMessage = async (payload: {
  text?: string;
  image?: string;
  chat: string;
  sender: string;
  readBy: string;
}) => {
  try {
    const newMessage = new messageModel(payload);
    await newMessage.save();
    await chatModel.findByIdAndUpdate(payload.chat, {
      lastMessage: newMessage._id,
    });
  } catch (error: any) {
    return { error: error.message };
  }
};
