"use client";
import React from "react";
import Recipient from "./recipient";
import { useSelector } from "react-redux";
import { ChatState } from "@/redux/chatSlice";
import Image from "next/image";
import chatLogo from "../../../../../public/chatlogo2.png";
import Messages from "./messages";
import NewMessage from "./new-message";

function ChatArea() {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  console.log(selectedChat);
  if (!selectedChat) {
    return (
      <div className=" flex  flex-1 flex-col justify-center items-center gap-10 h-full">
        <Image
          priority
          className="w-56 h-56"
          src={chatLogo}
          alt="chat logo"
          width={96}
          height={96}
        />
        <span className="font-semibold text-gray-500">
          Select a chat and start messaging
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between ">
      <Recipient />
      <Messages />
      <NewMessage />
    </div>
  );
}

export default ChatArea;
