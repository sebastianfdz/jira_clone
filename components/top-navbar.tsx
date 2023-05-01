"use client";
import { SignInButton, useUser, useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "./ui/button";
import { AiFillGithub } from "react-icons/ai";

const TopNavbar: React.FC = () => {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  return (
    <div className="flex h-12 w-full items-center justify-between border-b px-4">
      <div className="flex items-center gap-x-2">
        <Image
          src="https://cdn.worldvectorlogo.com/logos/jira-3.svg"
          alt="Jira logo"
          width={25}
          height={25}
        />
        <span className="text-sm font-medium text-zinc-600">Jira Clone</span>
        <Button
          href="https://github.com/sebastianfdz/jira_clone"
          target="_blank"
          className="ml-3 flex gap-x-2"
        >
          <AiFillGithub />
          <span className="text-sm font-medium">Github Repo</span>
        </Button>
      </div>
      {isSignedIn ? (
        <div className="flex items-center gap-x-2">
          <span className="text-sm font-medium text-zinc-600">
            {user?.fullName ?? user?.emailAddresses[0]?.emailAddress ?? "Guest"}
          </span>
          <UserButton />
        </div>
      ) : (
        <div className="flex items-center gap-x-3">
          <span className="text-xs text-zinc-400">
            Currently using guest account
          </span>
          <Button
            customColors
            className="bg-blue-500 text-sm text-white hover:bg-blue-600"
          >
            <SignInButton />
          </Button>
        </div>
      )}
    </div>
  );
};

export { TopNavbar };
