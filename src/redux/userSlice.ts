import { UserType } from "@/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUserData: null,
    currentUserId: "",
    onlineUsers: [],
    setDrawer: false,
  },
  reducers: {
    SetCurrentUser: (state, action) => {
      state.currentUserData = action.payload;
    },
    SetCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    SetOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    SetDrawer: (state, action) => {
      state.setDrawer = action.payload;
    },
  },
});

export const { SetCurrentUser, SetCurrentUserId, SetOnlineUsers, SetDrawer } =
  userSlice.actions;
export default userSlice;

export interface UserState {
  currentUserData: UserType | null;
  currentUserId: string;
  onlineUsers: string[];
  setDrawer: boolean;
}
