import { UserButton, currentUser } from "@clerk/nextjs";

import { connectMongoDB } from "@/config/db-config";
import { getCurrentUser } from "@/server-actions/users";
connectMongoDB();

export default async function Home() {
  const loggedInUserData = await getCurrentUser();

  return (
    <div className="p-10">
      <h1>homepage</h1>
    </div>
  );
}
