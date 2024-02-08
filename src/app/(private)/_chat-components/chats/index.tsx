import React from "react";
import ChatHeader from "./chats-header";
import ChatsList from "./chats-list";

function Chats() {
  return (
    <div className="lg:w-[400px] w-[350px] h-full p-3">
      <ChatHeader />
      <ChatsList />
    </div>
  );
}

export default Chats;
