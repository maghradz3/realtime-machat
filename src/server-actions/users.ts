"use server";
import { connectMongoDB } from "@/config/db-config";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs";

connectMongoDB();

export const GetCurrentUser = async () => {
  //if already exists
  try {
    const clerckUser = await currentUser();
    const mongoUser = await UserModel.findOne({ clerckUserId: clerckUser?.id });

    if (mongoUser) {
      return JSON.parse(JSON.stringify(mongoUser));
    }
    //create new user

    let email = "";
    if (clerckUser?.emailAddresses[0]) {
      email = clerckUser?.emailAddresses[0].emailAddress || "";
    }

    const newUserPayload = {
      clerckUserId: clerckUser?.id,
      name: clerckUser?.firstName + " " + clerckUser?.lastName,
      userName: clerckUser?.username,
      email: email,
      profilePic: clerckUser?.imageUrl,
    };

    const newUser = await UserModel.create(newUserPayload);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
