import UserModel from "@/models/user-model";
import Link from "next/link";
import React from "react";
import GroupForm from "../components/group-form";
import { UserType } from "@/interfaces";

const CreateGroupPage = async () => {
  const users: UserType[] = await UserModel.find({});
  return (
    <div className="p-5">
      <Link
        href="/"
        className="text-primary border border-primary px-5 py-2 no-underline border-solid text-sm"
      >
        Back to Chats
      </Link>
      <h1 className="text-primary text-xl font-bold uppercase">
        Create Group Chat
      </h1>
      <GroupForm users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
};

export default CreateGroupPage;
