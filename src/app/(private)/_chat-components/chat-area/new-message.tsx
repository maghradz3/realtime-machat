"use client";
import socket from "@/config/socket-config";
import { ChatState } from "@/redux/chatSlice";
import { SendNewMessage } from "@/server-actions/messages";
import { current } from "@reduxjs/toolkit";

import { Button, Input } from "antd";
import dayjs from "dayjs";
import EmojiPicker from "emoji-picker-react";
import { set } from "mongoose";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ImageSelector from "./image-selector";
import { uploadImageToFireBaseAndGetUrl } from "@/helpers/image-upload";

const NewMessage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = React.useState("");
  const { currentUserData } = useSelector((state: any) => state.user);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showImageSelection, setShowImageSelection] = React.useState(false);
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);
  const [loading, setLoading] = React.useState(false);
  const [selectedImageFile, setSelectedImageFile] = React.useState<File | null>(
    null
  );

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onSend = async () => {
    try {
      if (!text && !selectedImageFile) return;
      setLoading(true);
      let image = "";
      if (selectedImageFile) {
        image = await uploadImageToFireBaseAndGetUrl(selectedImageFile);
      }
      const commonPayload = {
        text,
        image,
        socketMessageId: dayjs().unix(),
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      };

      const socketPayload = {
        ...commonPayload,
        chat: selectedChat,
        sender: currentUserData,
      };
      socket.emit("send-new-message", socketPayload);
      setText("");
      setSelectedImageFile(null);
      setShowImageSelection(false);
      setShowEmojiPicker(false);
      const dbPayload = {
        ...commonPayload,
        sender: currentUserData?._id!,
        chat: selectedChat?._id!,
        readBy: currentUserData?._id,
      };
      await SendNewMessage(dbPayload);
    } catch (error: any) {
      error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.emit("typing", {
      chat: selectedChat,
      senderId: currentUserData?._id!,
      senderName: currentUserData?.name.split(" ")[0]!,
    });
  }, [selectedChat, text]);
  return (
    <div className="p-3 bg-gray-100 border-0 border-t border-solid border-gray-300 flex gap-5 items-center relative">
      <div className="flex gap-2 items-center">
        {showEmojiPicker && (
          <div className="absolute left-5 bottom-20">
            <EmojiPicker
              height={400}
              onEmojiClick={(emojiObject: any) => {
                setText((prevText) => prevText + emojiObject.emoji);
                inputRef.current?.focus();
              }}
            />
          </div>
        )}

        <Button
          className="border-gray-300"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          {!showEmojiPicker ? (
            <i className="ri-emoji-sticker-line"></i>
          ) : (
            <i className="ri-close-circle-line"></i>
          )}
        </Button>
        <Button
          className="border-gray-300"
          onClick={() => setShowImageSelection(!showImageSelection)}
        >
          <i className="ri-folder-image-line"></i>
        </Button>
      </div>
      <div className="flex-1 ">
        <Input
          value={text}
          onChange={onFormChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend();
          }}
          type="text"
          placeholder="Type a text.."
          className="h-14 px-3"
        />
      </div>
      <Button onClick={onSend} type="primary" className="h-14">
        Send
      </Button>
      {showImageSelection && (
        <ImageSelector
          {...{
            showImageSelection,
            setShowImageSelection,
            setSelectedImageFile,
            selectedImageFile,
            onSend,
            loading,
          }}
        />
      )}
    </div>
  );
};

export default NewMessage;
