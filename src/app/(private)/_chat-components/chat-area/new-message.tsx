"use client";
import { ChatState } from "@/redux/chatSlice";
import { SendNewMessage } from "@/server-actions/messages";
import { RootState } from "@reduxjs/toolkit/query";
import { Button, Input } from "antd";
import React from "react";
import { useSelector } from "react-redux";

const NewMessage = () => {
  const [text, setText] = React.useState("");
  const { currentUserData } = useSelector((state: any) => state.user);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  console.log(text);
  const onSend = async () => {
    try {
      const dbPayload = {
        text,
        image: "",
        sender: currentUserData?._id!,
        chat: selectedChat?._id!,
        readBy: currentUserData?._id,
      };
      const response = await SendNewMessage(dbPayload);
      if (response?.error) throw new Error(response.error);
      setText("");
    } catch (error: any) {
      error(error.message);
    }
  };
  return (
    <div className="p-3 bg-gray-100 border-0 border-t border-solid border-gray-300 flex gap-5 items-center">
      <div>Emoji</div>
      <div className="flex-1">
        <Input
          onChange={onFormChange}
          type="text"
          placeholder="Type a text.."
          className="h-14 px-3"
        />
      </div>
      <Button onClick={onSend} type="primary" className="h-14">
        Send
      </Button>
    </div>
  );
};

export default NewMessage;
