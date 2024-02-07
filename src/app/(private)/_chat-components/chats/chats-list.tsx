"use client";
import { ChatState, SetChats } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { getAllChats } from "@/server-actions/chats";
import { set } from "mongoose";
import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatListCard from "./chat-list-card";
import ChatSkeleton from "@/components/skeletons/chatSkeleton";

const ChatsList = () => {
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
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
      error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserData) getChat();
  }, [currentUserData]);

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
