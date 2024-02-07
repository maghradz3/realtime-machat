"use client";
import { Dropdown, Input, MenuProps, Modal } from "antd";
import React, { useState } from "react";

import NewChatModal from "./new-chat-model";
import { useRouter } from "next/navigation";

const ChatHeader = () => {
  const router = useRouter();
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const items: MenuProps["items"] = [
    {
      label: "New Chat",
      key: "1",
      onClick: () => setShowNewChatModal(true),
    },
    {
      label: "New Group",
      key: "2",
      onClick: () => router.push("/groups/create-group"),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-gray-500 font-bold uppercase">My Chats</h1>
        <Dropdown.Button className="w-max" size="small" menu={{ items }}>
          New
        </Dropdown.Button>
      </div>
      <Input
        type="text"
        placeholder="Search Chats"
        className="w-full mt-5  rounded-md px-3 py-2 border border-gray-500 h-14 bg-blue-100/40 "
      />
      {showNewChatModal && (
        <NewChatModal
          showNewChatModal={showNewChatModal}
          setShowNewChatModal={setShowNewChatModal}
        />
      )}
    </div>
  );
};

export default ChatHeader;
