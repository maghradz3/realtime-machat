import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerckUserId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
    },
    profilePic: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models["users"]) {
  mongoose.deleteModel("users");
}

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
