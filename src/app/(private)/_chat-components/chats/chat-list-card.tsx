import ChatSkeleton from "@/components/skeletons/chatSkeleton";
import { ChatType } from "@/interfaces";
import { ChatState, SetSelectedChat } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";

interface ChatListCardProps {
  chat: ChatType;
}

const ChatListCard = ({ chat }: ChatListCardProps) => {
  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  let chatName = "";
  let chatImage = "";

  //about messages
  let lastMessag = "";
  let lastMessageSenderName = "";
  let lastMessageTime = "";

  if (chat.isGroupChat) {
    chatName = chat.groupName;
    chatImage = chat.groupImage;
  } else {
    const recipient = chat.users.find(
      (user) => user._id !== currentUserData?._id
    );
    chatName = recipient?.name!;
    chatImage = recipient?.profilePic!;
  }

  const isSelected = selectedChat?._id === chat._id;

  return (
    <div
      className={`flex justify-between hover:bg-gray-100 transition-all duration-300 easy-in-out cursor-pointer  py-3 px-2 rounded ${
        isSelected && "bg-gray-100  border border-gray-300 border-solid"
      }`}
      onClick={() => dispatch(SetSelectedChat(chat))}
    >
      <div className="flex gap-5 items-center">
        <img
          src={chatImage}
          alt="chatImage"
          className="w-10 h-10 rounded-full"
        />
        <span className="text-gray-700 text-sm">{chatName}</span>
        <div>
          <span>{lastMessageTime}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatListCard;
