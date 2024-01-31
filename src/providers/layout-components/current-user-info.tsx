import { UserType } from "@/interfaces";
import { Button, Divider, Drawer } from "antd";
import Image from "next/image";
import React, { useState } from "react";
import dayjs from "dayjs";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface CurrentUserInfoProps {
  currentUser: UserType;
  setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
  showCUrrentUserInfo: boolean;
}

const CurrentUserInfo = ({
  currentUser,
  setShowCurrentUserInfo,
  showCUrrentUserInfo,
}: CurrentUserInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const getUserInfo = (key: string, value: string) => {
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-700">{key}</span>
        <span className="text-gray-600">{value}</span>
      </div>
    );
  };
  const { signOut } = useClerk();
  const onLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      setShowCurrentUserInfo(false);

      router.push("/sign-in");
    } catch (error: any) {
      error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Drawer
      open={showCUrrentUserInfo}
      onClose={() => setShowCurrentUserInfo(false)}
      title="Profile"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 justify-center items-center">
          <Image
            alt="profile-pic"
            src={currentUser.profilePic}
            width={28}
            height={28}
            className="w-20 h-20 rounded-full"
          />
          <span className="text-gray-500 cursor-pointer">
            Change Profile picture
          </span>
        </div>
        <Divider className="my-1 border-gray-200" />
        <div className="flex flex-col gap-5">
          {getUserInfo("Name", currentUser.name)}
          {getUserInfo("ID", currentUser._id)}
          {getUserInfo("Email", currentUser.email)}
          {getUserInfo("Username", currentUser.userName)}
          {getUserInfo(
            "Joined",
            dayjs(currentUser.createdAt).format("DD/MM/YYYY hh:mm A")
          )}
        </div>
        <div className="mt-5">
          <Button
            className="w-full"
            danger
            block
            loading={loading}
            onClick={onLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CurrentUserInfo;
