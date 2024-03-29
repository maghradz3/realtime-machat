"use client";

import { UserType } from "@/interfaces";
import { GetCurrentUser } from "@/server-actions/users";
import { Avatar, Button } from "antd";
import { use, useEffect, useState } from "react";
import CurrentUserInfo from "./current-user-info";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { SetCurrentUser, SetOnlineUsers, UserState } from "@/redux/userSlice";
import socket from "@/config/socket-config";
import ChatDrawer from "@/app/(private)/_chat-components/chats/chat-drawer";

const Header = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isPublicRoute =
    pathname.includes("/sign-in") || pathname.includes("/sign-up");
  if (isPublicRoute) return null;
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const [showCurrentUserInfo, setShowCurrentUserInfo] =
    useState<boolean>(false);

  const getCurrentUser = async () => {
    try {
      const response = await GetCurrentUser();

      if (response.error) throw new Error(response.error);
      dispatch(SetCurrentUser(response as UserType));
    } catch (error: any) {
      return { error: error.message };
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserData) {
      socket.emit("join", currentUserData._id);

      socket.on("online-users-updated", (onlineUsers: string[]) => {
        dispatch(SetOnlineUsers(onlineUsers));
      });
    }
  }, [currentUserData]);
  return (
    <>
      <div className="bg-gray-200 w-full py-2 px-2 md:p-10 flex justify-between items-center border-b border-solid border-gray-300">
        <div>
          <h1 className="text-sm md:text-2xl font-bold text-primary uppercase">
            MaChat
          </h1>
        </div>
        <div className="md:hidden">
          <ChatDrawer />
        </div>
        <div className="flex gap-1 md:gap-5 items-center">
          <span className="text-sm">{currentUserData?.name.split(" ")[0]}</span>
          <Avatar
            className="cursor-pointer"
            src={currentUserData?.profilePic}
            onClick={() => setShowCurrentUserInfo(true)}
          />
        </div>

        {showCurrentUserInfo && (
          <CurrentUserInfo
            setShowCurrentUserInfo={setShowCurrentUserInfo}
            showCUrrentUserInfo={showCurrentUserInfo}
          />
        )}
      </div>
    </>
  );
};

export default Header;
