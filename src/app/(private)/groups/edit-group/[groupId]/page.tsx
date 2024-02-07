import { UserType } from "@/interfaces";
import chatModel from "@/models/chat-model";
import UserModel from "@/models/user-model";
import { getChatById } from "@/server-actions/chats";
import Link from "next/link";
import React from "react";
import GroupForm from "../../components/group-form";

const EditGroup = async ({ params }: { params: any }) => {
  const id = params.groupId;
  const chat = await chatModel.findById(id);
  const users: UserType[] = await UserModel.find({});
  return (
    <div className="p-5">
      <Link
        href="/"
        className="text-primary border border-primary px-5 py-2 no-underline border-solid text-sm"
      >
        Back to Chats
      </Link>
      <h1 className="text-primary text-xl font-bold uppercase">Update Group</h1>
      <GroupForm
        initialData={JSON.parse(JSON.stringify(chat))}
        users={JSON.parse(JSON.stringify(users))}
      />
    </div>
  );
};

export default EditGroup;
