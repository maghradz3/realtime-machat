"use client";
import { ChatType, UserType } from "@/interfaces";
import { ChatState, SetChats } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { CreateNewChat } from "@/server-actions/chats";
import { GetAllUsers } from "@/server-actions/users";
import { Button, Divider, Modal, Spin } from "antd";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface NewChatModelProps {
  showNewChatModal: boolean;
  setShowNewChatModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function NewChatModal({
  showNewChatModal,
  setShowNewChatModal,
}: NewChatModelProps) {
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const dispatch = useDispatch();

  const getUsers = async () => {
    setLoading(true);
    const response = await GetAllUsers();
    if (!response) throw new Error("No users found");
    console.log(response);
    setUsers(response);
    try {
    } catch (error: any) {
      error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onAddToChat = async (userId: string) => {
    try {
      setSelectedUserId(userId);
      setLoading(true);
      const response = await CreateNewChat({
        users: [userId, currentUserData?._id],
        createdBy: currentUserData?._id,
        isGroup: false,
      });
      if (response.error) throw new Error(response.error);
      toast.success("Chat created successfully");
      dispatch(SetChats(response));
      setShowNewChatModal(false);
    } catch (error: any) {
      error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  const { chats }: ChatState = useSelector((state: any) => state.chat);

  console.log(currentUserData, "current user data");
  return (
    <Modal
      open={showNewChatModal}
      onCancel={() => setShowNewChatModal(false)}
      footer={null}
      centered
      title={null}
    >
      <div className="flex flex-col gap-5">
        <h1 className="text-primary text-center text-xl font-bold uppercase">
          Create New Chat
        </h1>
        {loading && !selectedUserId && (
          <div className="flex justify-center mt-20">
            <Spin />
          </div>
        )}
        {!loading && users.length > 0 && (
          <div className="flex flex-col gap-5">
            {users.map((user) => {
              const chatAlreadyCreated = chats.find((chat) =>
                chat.users.find((chatmember) => chatmember._id === user._id)
              );
              if (user._id === currentUserData?._id || chatAlreadyCreated)
                return null;
              return (
                <>
                  <div
                    key={user._id}
                    className="flex justify-between items-center"
                  >
                    <div className=" flex gap-5 items-center">
                      <img
                        src={user.profilePic}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="text-gray-500">{user.name}</span>
                    </div>
                    <Button
                      loading={selectedUserId === user._id && loading}
                      onClick={() => onAddToChat(user._id)}
                      type="primary"
                      size="small"
                    >
                      {" "}
                      Add To Chat
                    </Button>
                  </div>
                  <Divider className="border-gray-300 my-[1px]" />
                </>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default NewChatModal;
