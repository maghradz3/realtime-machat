"use client";
import { ChatState } from "@/redux/chatSlice";
import React, { use } from "react";
import { useSelector } from "react-redux";
import RecipientInfo from "./recipient-info";
import socket from "@/config/socket-config";
import { ChatType } from "@/interfaces";
import { set } from "mongoose";

function Recipient() {
  const [typing = false, setTyping] = React.useState<boolean>(false);
  const [showRecipientInfo, setShowRecipientInfo] =
    React.useState<boolean>(false);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  let chatName = "";
  let chatImage = "";
  if (selectedChat?.isGroupChat) {
    chatName = selectedChat.groupName;
    chatImage = selectedChat.groupImage;
  } else {
    const recipient = selectedChat?.users.find(
      (user) => user._id !== selectedChat?._id
    );
    chatName = recipient?.name!;
    chatImage = recipient?.profilePic!;
  }

  const typingAnimation = () => {
    if (typing)
      return (
        <span className="text-green-700 font-semibold text-xs">Typing...</span>
      );
  };

  React.useEffect(() => {
    socket.on("typing", (chat: ChatType) => {
      if (selectedChat?._id === chat._id) setTyping(true);
      setTimeout(() => {
        setTyping(false);
      }, 2000);
    });

    return () => {
      socket.off("typing");
    };
  }, [selectedChat]);

  return (
    <div className="flex justify-between py-3 px-5 border-0 border-b border-gray-200 border-solid bg-gray-400/5 cursor-pointer">
      <div className="flex gap-5 items-center">
        <img
          onClick={() => setShowRecipientInfo(true)}
          src={chatImage}
          alt="chat image "
          className="w-10 h-10 rounded-full object-cover object-center"
        />
        <div className="flex flex-col gap-1">
          {" "}
          <span
            className="text-gray-700 text-sm"
            onClick={() => setShowRecipientInfo(true)}
          >
            {chatName}
          </span>
          {typingAnimation()}
        </div>
      </div>
      {showRecipientInfo && (
        <RecipientInfo {...{ showRecipientInfo, setShowRecipientInfo }} />
      )}
    </div>
  );
}

export default Recipient;
