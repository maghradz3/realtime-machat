import { formatDateTime } from "@/helpers/date-formats";
import { MessageType } from "@/interfaces";
import { ChatState } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import dayjs from "dayjs";
import React from "react";
import { useSelector } from "react-redux";

interface MessagePropsType {
  message: MessageType;
}

function Message({ message }: MessagePropsType) {
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  const isLoggedUserMessage = message.sender._id === currentUserData?._id;
  if (isLoggedUserMessage) {
    return (
      <div className="flex justify-end gap-1">
        <div className="flex flex-col gap-1">
          {message.text && (
            <p className="bg-primary text-white p-2 px-5 rounded-xl rounded-tl-none rounded-br-none m-0">
              {message.text}
            </p>
          )}
          {message.image && (
            <img
              src={message.image}
              alt="messageImage"
              className="w-30 h-30 lg:w-60 h-60 rounded-xl rounded-tl-none rounded-br-none object-cover object-center"
            />
          )}
          <span className=" text-gray-500 text-xs">
            {formatDateTime(message.createdAt)}
          </span>
        </div>
        <img
          src={message.sender.profilePic}
          alt="profilePic"
          className="w-6 h-6 rounded-full"
        />
      </div>
    );
  } else {
    return (
      <div className="flex justify-start gap-1">
        <img
          src={message.sender.profilePic}
          alt="profilePic"
          className="w-6 h-6 rounded-full object-cover object-center"
        />
        <div className="flex flex-col gap-1">
          <div className="bg-gray-300 p-2 px-5 rounded-xl rounded-tl-none rounded-br-none ">
            <p className="text-blue-500 text-xs font-semibold">
              {message.sender.name}
            </p>
            {message.text && (
              <p className=" text-black m-0 mt-1  ">{message.text}</p>
            )}
            {message.image && (
              <img
                src={message.image}
                alt="messageImage"
                className="w-30 h-30 lg:w-60 h-60 rounded-xl rounded-tl-none rounded-br-none object-cover object-center"
              />
            )}
          </div>
          <span className=" text-gray-500 text-xs">
            {formatDateTime(message.createdAt)}
          </span>
        </div>
      </div>
    );
  }
}

export default Message;
