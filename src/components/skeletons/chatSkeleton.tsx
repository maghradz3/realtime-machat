import { Skeleton } from "antd";
import React from "react";

const ChatSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-1 h-20">
      <Skeleton active className="h-screen/3 w-full" />
      <Skeleton active className="h-14 w-full" />
      <Skeleton active className="h-14 w-full" />
    </div>
  );
};

export default ChatSkeleton;
