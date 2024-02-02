"use client";

import { UserType } from "@/interfaces";
import { GetCurrentUser } from "@/server-actions/users";
import { Avatar } from "antd";
import { useEffect, useState } from "react";
import CurrentUserInfo from "./current-user-info";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { SetCurrentUser, UserState } from "@/redux/userSlice";

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
      console.log(response);
      if (response.error) throw new Error(response.error);
      dispatch(SetCurrentUser(response as UserType));
    } catch (error: any) {
      return { error: error.message };
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <div className="bg-gray-200 w-full py-2 px-10 flex justify-between items-center border-b border-solid border-gray-300">
      <div>
        <h1 className="text-2xl font-bold text-primary uppercase">MaChat</h1>
      </div>
      <div className="flex gap-5 items-center">
        <span className="text-sm">{currentUserData?.name}</span>
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
  );
};

export default Header;
