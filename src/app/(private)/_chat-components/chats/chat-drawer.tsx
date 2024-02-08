"use client";
import React, { useState } from "react";
import { Button, Drawer } from "antd";

import ChatHeader from "./chats-header";
import ChatsList from "./chats-list";

const ChatDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);

  const showDrawerWindow = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showDrawerWindow}
        size="small"
        className="flex flex-col py-4 justify-center items-center rounded-md"
      >
        Open Chats
      </Button>
      <Drawer
        className="w-[30px] "
        title="Select User and Start Chat"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <div className="relative">
          <Button
            onClick={() => setOpen(false)}
            size="small"
            className="absolute left-1 top-[-20px]"
          >
            <i className="ri-xrp-line"></i>
          </Button>
          <ChatHeader />
          <ChatsList />
        </div>
      </Drawer>
    </>
  );
};

export default ChatDrawer;
