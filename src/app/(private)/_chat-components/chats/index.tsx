import React from "react";
import ChatHeader from "./chats-header";
import ChatsList from "./chats-list";
import ChatDrawer from "./chat-drawer";

function Chats() {
  return (
    <div className="hidden md:block md:w-[350px] h-full p-3 ">
      <ChatHeader />
      <ChatsList />
    </div>
  );
}

export default Chats;
