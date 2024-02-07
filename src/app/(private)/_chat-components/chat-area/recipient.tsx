"use client";
import { ChatState } from "@/redux/chatSlice";
import React from "react";
import { useSelector } from "react-redux";
import RecipientInfo from "./recipient-info";

function Recipient() {
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

  return (
    <div className="flex justify-between py-3 px-5 border-0 border-b border-gray-200 border-solid bg-gray-400/5 cursor-pointer">
      <div className="flex gap-5 items-center">
        <img
          onClick={() => setShowRecipientInfo(true)}
          src={chatImage}
          alt="chat image "
          className="w-10 h-10 rounded-full object-cover object-center"
        />
        <span
          className="text-gray-700 text-sm"
          onClick={() => setShowRecipientInfo(true)}
        >
          {chatName}
        </span>
      </div>
      {showRecipientInfo && (
        <RecipientInfo {...{ showRecipientInfo, setShowRecipientInfo }} />
      )}
    </div>
  );
}

export default Recipient;
