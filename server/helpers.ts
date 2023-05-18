import type { User as ClerkUser } from "@clerk/nextjs/dist/api";
import { type User } from "@/server/db";

export function filterUserForClient(user: ClerkUser) {
  return <User>{
    id: user.id,
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
    email: user?.emailAddresses[0]?.emailAddress ?? "",
    avatar: user.profileImageUrl,
  };
}
