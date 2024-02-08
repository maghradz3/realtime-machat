"use client";

import { UserState } from "@/redux/userSlice";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const Content = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );

  const isPublicRoute =
    pathName.includes("sign-in") || pathName.includes("sign-up");
  if (isPublicRoute) return children;

  if (!currentUserData) return <div>Loading...</div>;

  return <div>{children}</div>;
};

export default Content;
