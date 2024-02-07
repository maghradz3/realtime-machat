import { formatDateTime } from "@/helpers/date-formats";
import { ChatState, SetSelectedChat } from "@/redux/chatSlice";
import { UserState } from "@/redux/userSlice";
import { Button, Divider, Drawer } from "antd";
import { get } from "http";
import { useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";

const RecipientInfo = ({
  showRecipientInfo,
  setShowRecipientInfo,
}: {
  showRecipientInfo: boolean;
  setShowRecipientInfo: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const { selectedChat }: ChatState = useSelector((state: any) => state.chat);

  let chatName = "";
  let chatImage = "";
  if (selectedChat?.isGroupChat) {
    chatName = selectedChat.groupName;
    chatImage = selectedChat.groupImage;
  } else {
    const recipient = selectedChat?.users.find(
      (user) => user._id !== currentUserData?._id
    );
    chatName = recipient?.name!;
    chatImage = recipient?.profilePic!;
  }

  const getUserInfo = (key: string, value: string | undefined) => {
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-700">{key}</span>
        <span className="text-gray-600">{value}</span>
      </div>
    );
  };
  return (
    <Drawer
      open={showRecipientInfo}
      onClose={() => setShowRecipientInfo(false)}
      title={chatName}
    >
      <div className="flex justify-center flex-col items-center gap-5">
        <img
          src={chatImage}
          alt="userimg"
          className="w-28 h-28 rounded-full object-cover object-center"
        />
        <span className="text-gray-700">{chatName}</span>
      </div>
      <Divider className="m-3 border-gray-200" />

      {selectedChat?.isGroupChat && (
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">
              {selectedChat.users.length} Members
            </span>
            <Button
              onClick={() =>
                router.push(`/groups/edit-group/${selectedChat._id}`)
              }
              size="small"
            >
              Edit Group
            </Button>
          </div>
          {selectedChat.users.map((user) => (
            <div className="flex gap-5 items-center " key={user._id}>
              <img
                src={user.profilePic}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover object-center"
              />
              <span className="text-gray-500 font-bold text-sm">
                {user.name}
              </span>
            </div>
          ))}
        </div>
      )}
      <Divider className="m-3 border-gray-200" />
      <div className="flex flex-col gap-5">
        {getUserInfo("Created On", formatDateTime(selectedChat?.createdAt!))}
        {getUserInfo("CreatedBy", selectedChat?.createdBy?.name!)}
      </div>
    </Drawer>
  );
};

export default RecipientInfo;
