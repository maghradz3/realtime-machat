"use server";
import chatModel from "@/models/chat-model";

export const CreateNewChat = async (payolad: any) => {
  try {
    await chatModel.create(payolad);
    const newChats = await chatModel
      .find({
        users: {
          $in: [payolad?.createdBy],
        },
      })
      .populate("users")
      .sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(newChats));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const getAllChats = async (userId: string) => {
  try {
    const users = await chatModel
      .find({
        users: {
          $in: [userId],
        },
      })
      .populate("users")
      .populate("lastMessage")
      .populate("createdBy")
      .populate({ path: "lastMessage", populate: { path: "sender" } })
      .sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getChatById = async (chatId: string) => {
  try {
    const chat = await chatModel
      .findById(chatId)
      .populate("users")
      .populate("lastMessage")
      .populate("createdBy")
      .populate({ path: "lastMessage", populate: { path: "sender" } });
    return JSON.parse(JSON.stringify(chat));
  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateChat = async ({
  chatId,
  payload,
}: {
  chatId: string;
  payload: any;
}) => {
  try {
    await chatModel.findByIdAndUpdate({ _id: chatId }, payload);
  } catch (error: any) {
    return { error: error.message };
  }
};
