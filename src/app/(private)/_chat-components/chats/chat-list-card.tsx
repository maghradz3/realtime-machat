import ChatSkeleton from "@/components/skeletons/chatSkeleton";
import { formatDateTime } from "@/helpers/date-formats";
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
  const { currentUserData, onlineUsers }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  let chatName = "";
  let chatImage = "";

  //about messages
  let lastMessage = "";
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

  if (chat?.lastMessage) {
    lastMessage = chat.lastMessage.text;
    lastMessageSenderName =
      chat.lastMessage.sender?._id === currentUserData?._id
        ? "You"
        : chat.lastMessage.sender?.name.split(" ")[0];
    lastMessageTime = formatDateTime(chat.lastMessage.createdAt)!;
  }

  const isSelected = selectedChat?._id === chat._id;

  const unreadCounts = () => {
    if (!chat?.unreadCounts || !chat?.unreadCounts[currentUserData?._id!]) {
      return null;
    }
    return (
      <div>
        <span className="bg-green-700 text-white h-5 w-5 rounded-full flex justify-center items-center">
          {chat.unreadCounts[currentUserData?._id]}
        </span>
      </div>
    );
  };

  const onlineIndicator = () => {
    if (chat.isGroupChat) return null;
    const recipientId = chat.users.find(
      (user) => user._id !== currentUserData?._id!
    )?._id;
    console.log(recipientId, onlineUsers);
    if (onlineUsers?.includes(recipientId!)) {
      return <div className="w-3 h-3 rounded-full bg-green-700 "></div>;
    }
  };

  return (
    <div
      className={`flex  justify-between  hover:bg-gray-100 transition-all duration-300 easy-in-out cursor-pointer  py-3 px-2 rounded ${
        isSelected ? "bg-gray-100  border border-gray-300 border-solid" : ""
      }`}
      onClick={() => dispatch(SetSelectedChat(chat))}
    >
      <div className="flex gap-5 items-center">
        <img
          src={chatImage}
          alt="chatImage"
          className="w-10 h-10 rounded-full"
        />

        <div className="flex flex-col gap-1">
          <span className="text-gray-700 text-sm relative flex gap-2 items-center">
            {chatName}
            {onlineIndicator()}
          </span>
          <span className="text-xs text-gray-500">
            {lastMessageSenderName}: {lastMessage}
          </span>
        </div>
      </div>
      <div className=" ">
        {unreadCounts()}
        <span className="text-xs getxt-gray-500">{lastMessageTime}</span>
      </div>
    </div>
  );
};

export default ChatListCard;
