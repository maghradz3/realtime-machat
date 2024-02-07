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
      .populate({ path: "lastMessage", populate: { path: "sender" } })
      .sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(users));
  } catch (error: any) {
    return { error: error.message };
  }
};
