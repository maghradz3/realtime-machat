"use client";
import React, { useState } from "react";
import { Button, Drawer } from "antd";

import ChatHeader from "./chats-header";
import ChatsList from "./chats-list";
import { useDispatch, useSelector } from "react-redux";
import { SetDrawer, UserState } from "@/redux/userSlice";
import { set } from "mongoose";

const ChatDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { setDrawer }: UserState = useSelector((state: any) => state.user);

  const showDrawerWindow = () => {
    dispatch(SetDrawer(true));
  };

  const onClose = () => {
    dispatch(SetDrawer(false));
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
        open={setDrawer}
      >
        <div className="relative">
          <Button
            onClick={() => dispatch(SetDrawer(false))}
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
