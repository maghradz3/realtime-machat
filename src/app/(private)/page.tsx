import { Divider } from "antd";

import ChatArea from "./_chat-components/chat-area";
import Chats from "./_chat-components/chats";
import { connectMongoDB } from "@/config/db-config";
connectMongoDB();
export default async function Home() {
  return (
    <div className="flex h-[85vh]">
      <Chats />
      <Divider type="vertical" className="h-full border-gray-300 px-0 mx-0" />
      <ChatArea />
    </div>
  );
}
