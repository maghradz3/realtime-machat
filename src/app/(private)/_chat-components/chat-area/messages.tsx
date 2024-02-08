"use client";
import { MessageType } from "@/interfaces";
import { ChatState, SetChats } from "@/redux/chatSlice";
import { GetChatMessages, ReadAllMessages } from "@/server-actions/messages";

import React, { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./message";
import { UserState } from "@/redux/userSlice";
import socket from "@/config/socket-config";

function Messages() {
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const { selectedChat, chats }: ChatState = useSelector(
    (state: any) => state.chat
  );
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  const messagesDIvRef = React.useRef<HTMLDivElement>(null);
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
    const newChat = chats.map((chat) => {
      if (chat._id === selectedChat?._id) {
        let chatData = { ...chat };
        chatData.unreadCounts = { ...chatData.unreadCounts };
        chatData.unreadCounts[currentUserData?._id!] = 0;
        return chatData;
      } else return chat;
    });

    dispatch(SetChats(newChat));
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

  interface UnreadCounts {
    [key: string]: number;
  }
  interface ChatType {
    unreadCounts: UnreadCounts;
  }

  React.useEffect(() => {
    if (messagesDIvRef.current) {
      messagesDIvRef.current.scrollTop = messagesDIvRef.current.scrollHeight;
    }
    ReadAllMessages({
      userId: currentUserData?._id!,
      chatId: selectedChat?._id!,
    });
    const newChat = chats.map((chat) => {
      if (chat._id === selectedChat?._id) {
        let chatData = { ...chat };
        chatData.unreadCounts = { ...chatData.unreadCounts };
        chatData.unreadCounts[currentUserData?._id!] = 0;
        return chatData;
      } else return chat;
    });

    dispatch(SetChats(newChat));
  }, [messages]);

  return (
    <div className="flex-1 p-3 overflow-y-scroll " ref={messagesDIvRef}>
      <div className="flex flex-col gap-3">
        {messages.map((message) => {
          return <Message key={message._id} message={message} />;
        })}
      </div>
    </div>
  );
}

export default Messages;
