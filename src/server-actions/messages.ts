"use server";

import messageModel from "@/models/message-model";
import chatModel from "@/models/chat-model";
import { ObjectId } from "mongodb";

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

    const existingChat = await chatModel.findById(payload.chat);
    const existingUnreadCounts = existingChat?.unreadCounts;

    existingChat?.users.forEach((user: ObjectId | null) => {
      const userIdInString = user?.toString();
      console.log(userIdInString);
      console.log(user);
      console.log("payoload senter", payload.sender);

      if (userIdInString !== payload.sender) {
        existingUnreadCounts[userIdInString!] =
          (existingUnreadCounts[userIdInString!] || 0) + 1;
      }
    });

    await chatModel.findByIdAndUpdate(payload.chat, {
      lastMessage: newMessage._id,
      unreadCounts: existingUnreadCounts,
      lastMessageAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return { error: error.message };
  }
};

export const GetChatMessages = async (chatId: string) => {
  try {
    const messages = await messageModel
      .find({
        chat: chatId,
      })
      .populate("sender")
      .sort({ createdAt: 1 });
    return JSON.parse(JSON.stringify(messages));
  } catch (error: any) {
    return { error: error.message };
  }
};

export const ReadAllMessages = async ({
  chatId,
  userId,
}: {
  chatId: string;
  userId: string;
}) => {
  try {
    await messageModel.updateMany(
      { chat: chatId, sender: { $ne: userId }, readBy: { $nin: [userId] } },
      { $addToSet: { readBy: userId } }
    );
    const existingChat = await chatModel.findById(chatId);
    const existingUnreadCounts = existingChat?.unreadCounts;
    const newUnreadCounts = { ...existingUnreadCounts, [userId]: 0 };
    await chatModel.findByIdAndUpdate(chatId, {
      unreadCounts: newUnreadCounts,
    });
    return { message: "Messages marked as read" };
  } catch (error: any) {
    return { error: error };
  }
};
