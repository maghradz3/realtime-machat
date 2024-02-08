"use client";
import { ChatState, SetChats, SetSelectedChat } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { getAllChats } from "@/server-actions/chats";
import { set } from "mongoose";
import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatListCard from "./chat-list-card";
import ChatSkeleton from "@/components/skeletons/chatSkeleton";
import { ChatType, MessageType } from "@/interfaces";
import socket from "@/config/socket-config";
import chatModel from "@/models/chat-model";
import store from "@/redux/store";

const ChatsList = () => {
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const [loading, setLoading] = React.useState(false);
  const { chats }: ChatState = useSelector((state: any) => state.chat);

  const dispatch = useDispatch();
  const getChat = async () => {
    try {
      setLoading(true);
      const response = await getAllChats(currentUserData?._id!);
      console.log(response);
      if (response.error) throw new Error(response.error);
      dispatch(SetChats(response));
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserData) getChat();
  }, [currentUserData]);

  useEffect(() => {
    socket.on("new-message-recieved", (newMessage: MessageType) => {
      let { chats }: ChatState = store.getState().chat;
      let prevChats = [...chats];

      let indexOfChatToUpdate = prevChats.findIndex(
        (chat) => chat._id === newMessage.chat._id
      );
      if (indexOfChatToUpdate === -1) return;

      let chatToUpdate = prevChats[indexOfChatToUpdate];
      if (
        chatToUpdate.lastMessage.socketMessageId === newMessage.socketMessageId
      )
        return;
      let chatToUpdateCopy: ChatType = { ...chatToUpdate };
      chatToUpdateCopy.lastMessage = newMessage;
      chatToUpdateCopy.updatedAt = newMessage.createdAt;
      chatToUpdateCopy.unreadCounts = { ...chatToUpdateCopy.unreadCounts };
      if (
        newMessage.sender._id !== currentUserData?._id! &&
        selectedChat?._id !== newMessage.chat._id
      ) {
        chatToUpdateCopy.unreadCounts[currentUserData?._id!] =
          (chatToUpdateCopy.unreadCounts[currentUserData?._id!] || 0) + 1;
      }

      prevChats[indexOfChatToUpdate] = chatToUpdateCopy;

      prevChats = [
        prevChats[indexOfChatToUpdate],
        ...prevChats.filter((chat) => chat._id !== newMessage.chat._id),
      ];
      dispatch(SetChats(prevChats));
    });
  }, [selectedChat]);

  return (
    <div>
      {chats.length > 0 && (
        <div className="flex flex-col gap-5 mt-5">
          {chats.map((chat) => {
            return <ChatListCard key={chat._id} chat={chat} />;
          })}
        </div>
      )}
      {loading && (
        <div>
          <div>
            <ChatSkeleton />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatsList;
