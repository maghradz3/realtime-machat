"use client";
import { uploadImageToFireBaseAndGetUrl } from "@/helpers/image-upload";
import { UserType } from "@/interfaces";
import { UserState } from "@/redux/userSlice";
import { CreateNewChat, updateChat } from "@/server-actions/chats";
import { Button, Form, Input, Upload } from "antd";
import { init } from "next/dist/compiled/webpack/webpack";

import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const GroupForm = ({
  users,
  initialData = null,
}: {
  users: UserType[];
  initialData?: any;
}) => {
  const router = useRouter();
  const { currentUserData }: UserState = useSelector(
    (state: any) => state.user
  );
  const [selectedUserIds = [], setSelectedUserIds] = React.useState<string[]>(
    initialData?.users.filter(
      (userid: string) => userid !== currentUserData?._id
    ) || []
  );
  const [selectedProfilePic, setSelectedProfilePic] = React.useState<File>();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const payload = {
        groupName: values.groupName,
        groupBio: values.groupBio,
        users: [...selectedUserIds, currentUserData?._id!],
        createdBy: currentUserData?._id!,
        isGroupChat: true,
        groupImage: initialData?.groupImage || "",
      };
      if (selectedProfilePic) {
        payload.groupImage = await uploadImageToFireBaseAndGetUrl(
          selectedProfilePic
        );
      }

      let response;
      console.log("initial", initialData);
      console.log("payload", payload);
      if (initialData) {
        console.log("aq shemovida");
        response = await updateChat({
          chatId: initialData._id,
          payload: payload,
        });
      }

      if (!initialData) response = await CreateNewChat(payload);

      if (response?.error) throw new Error(response?.error);
      toast.success(
        `Group ${initialData ? "updated" : "created"} successfully!`
      );
      router.refresh();
      router.push("/");
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col gap-5">
        <span className="text-gray-500 text-sm">
          Select users to add to group
        </span>
        {users.map((user) => {
          if (user._id === currentUserData?._id) return null;
          return (
            <div className="flex gap-5 items-center " key={user._id}>
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user._id)}
                onChange={() => {
                  if (selectedUserIds.includes(user._id)) {
                    setSelectedUserIds(
                      selectedUserIds.filter((id) => id !== user._id)
                    );
                  } else {
                    setSelectedUserIds([...selectedUserIds, user._id]);
                  }
                }}
              />
              <img
                src={user.profilePic}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover object-center"
              />
              <span className="text-gray-500 font-bolt text-sm">
                {user.name}
              </span>
            </div>
          );
        })}
      </div>
      <div>
        <Form layout="vertical" onFinish={onFinish} initialValues={initialData}>
          <Form.Item
            name="groupName"
            label="Group Name"
            rules={[{ required: true, message: "Please enter group Name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="groupBio" label="Group Description">
            <Input.TextArea />
          </Form.Item>
          <Upload
            beforeUpload={(file) => {
              setSelectedProfilePic(file);
              return false;
            }}
            maxCount={1}
            listType="picture-card"
          >
            <span className="p-1">Upload profile picture</span>
          </Upload>
          <div className="flex justify-end gap-3">
            <Button>Cancel</Button>
            <Button
              type="primary"
              className="ml-2"
              htmlType="submit"
              loading={loading}
            >
              {initialData ? "Update Group" : "Create Group"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default GroupForm;
