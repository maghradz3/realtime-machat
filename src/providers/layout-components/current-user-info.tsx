"use client";

import { Button, Divider, Drawer, Upload, message } from "antd";

import React, { use, useState } from "react";
import dayjs from "dayjs";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser, UserState } from "@/redux/userSlice";
import { uploadImageToFireBaseAndGetUrl } from "@/helpers/image-upload";
import { UpdateUserProfile } from "@/server-actions/users";
import toast from "react-hot-toast";

interface CurrentUserInfoProps {
  setShowCurrentUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
  showCUrrentUserInfo: boolean;
}

const CurrentUserInfo = ({
  setShowCurrentUserInfo,
  showCUrrentUserInfo,
}: CurrentUserInfoProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
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

  const onProfilePicUpdate = async () => {
    try {
      setLoading(true);
      const url: string = await uploadImageToFireBaseAndGetUrl(selectedFile!);
      const response = await UpdateUserProfile(currentUserData?._id!, {
        profilePic: url,
      });

      if (response.error) throw new Error(response.error);
      dispatch(SetCurrentUser(response));
      toast.success("Profile Picture Updated");
      setShowCurrentUserInfo(false);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <Drawer
      open={showCUrrentUserInfo}
      onClose={() => setShowCurrentUserInfo(false)}
      title="Profile"
    >
      {currentUserData && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 justify-center items-center">
            {!selectedFile && (
              <img
                alt="profile-pic"
                src={currentUserData.profilePic}
                className="w-28 h-28 rounded-full object-cover object-center"
              />
            )}
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false;
              }}
              listType={selectedFile ? "picture-circle" : "text"}
              maxCount={1}
            >
              {" "}
              Change Profile picture
            </Upload>
          </div>
          <Divider className="my-1 border-gray-200" />
          <div className="flex flex-col gap-5">
            {getUserInfo("Name", currentUserData.name)}
            {getUserInfo("ID", currentUserData._id)}
            {getUserInfo("Email", currentUserData.email)}
            {getUserInfo("Username", currentUserData.userName)}
            {getUserInfo(
              "Joined",
              dayjs(currentUserData.createdAt).format("DD/MM/YYYY hh:mm A")
            )}
          </div>
          <div className="mt-5 flex flex-col gap-5">
            <Button
              className="w-full"
              danger
              block
              loading={loading && !selectedFile}
              onClick={onProfilePicUpdate}
              disabled={!selectedFile}
            >
              Update Profile Picture
            </Button>
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
      )}
    </Drawer>
  );
};

export default CurrentUserInfo;
