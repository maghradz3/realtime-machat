export interface UserType {
  _id: string;
  clerckUserId: string;
  name: string;
  userName: string;
  email: string;
  profilePic: string;

  createdAt: string;
  updatedAt: string;
}

export interface ChatType {
  _id: string;
  users: UserType[];
  createdBy: UserType;
  lastMessage: MessageType;
  isGroupChat: boolean;
  groupName: string;
  groupImage: string;
  groupBio: string;
  admins: UserType[];
  unreadCounts: any;
  createdAt: string;
  updatedAt: string;
}

export interface MessageType {
  _id: string;
  socketMessageId: string;
  chat: ChatType;
  sender: UserType;
  text: string;
  image: string;
  readBy: UserType[];
  createdAt: string;
  updatedAt: string;
}
