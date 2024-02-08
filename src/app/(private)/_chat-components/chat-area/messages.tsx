"use client";
import { MessageType } from "@/interfaces";
import { ChatState } from "@/redux/chatSlice";
import { GetChatMessages, ReadAllMessages } from "@/server-actions/messages";

import React, { use } from "react";
import { useSelector } from "react-redux";
import Message from "./message";
import { UserState } from "@/redux/userSlice";
import socket from "@/config/socket-config";

function Messages() {
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const getMessages = async () => {
    try {
      setLoading(true);
      const response = await GetChatMessages(selectedChat?._id!);
      if (response.error) throw new Error(response.error);
      console.log("response", response);
      setMessages(response);
    } catch (error: any) {
      error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getMessages();
    ReadAllMessages({
      userId: currentUserData?._id!,
      chatId: selectedChat?._id!,
    });
  }, [selectedChat]);

  React.useEffect(() => {
    socket.on("new-message-recieved", (message: MessageType) => {
      if (selectedChat?._id === message.chat._id) {
        setMessages((prev) => {
          const isMessageAlreadyExists = prev.find(
            (msg) => msg.socketMessageId === message.socketMessageId
          );
          if (isMessageAlreadyExists) return prev;
          else return [...prev, message];
        });
      }
    });
  }, [selectedChat]);
  return (
    <div className="flex-1 p-3 overflow-y-scroll ">
      <div className="flex flex-col gap-3">
        {messages.map((message) => {
          return <Message key={message._id} message={message} />;
        })}
      </div>
    </div>
  );
}

export default Messages;
