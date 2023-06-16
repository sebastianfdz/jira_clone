"use client";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "./ui/button";
import { AiFillGithub } from "react-icons/ai";

const TopNavbar: React.FC = () => {
  const { user } = useUser();
  return (
    <div className="flex h-12 w-full items-center justify-between border-b px-4">
      <div className="flex items-center gap-x-2">
        <Image
          src="https://cdn.worldvectorlogo.com/logos/jira-3.svg"
          alt="Jira logo"
          width={25}
          height={25}
        />
        <span className="text-sm font-medium text-gray-600">Jira Clone</span>
        <Button
          href="https://github.com/sebastianfdz/jira_clone"
          target="_blank"
          className="ml-3 flex gap-x-2"
        >
          <AiFillGithub />
          <span className="text-sm font-medium">Github Repo</span>
        </Button>
      </div>
      {user ? (
        <div className="flex items-center gap-x-2">
          <span className="text-sm font-medium text-gray-600">
            {user?.fullName ?? user?.emailAddresses[0]?.emailAddress ?? "Guest"}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <div className="flex items-center gap-x-3">
          <div className="rounded-sm bg-inprogress px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600">
            <SignInButton />
          </div>
        </div>
      )}
    </div>
  );
};

export { TopNavbar };
