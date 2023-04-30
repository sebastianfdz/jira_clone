"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { IssueSelectType } from "../issue-select-type";
import { Button } from "../ui/button";
import { MdCheck, MdClose } from "react-icons/md";
import { Spinner } from "../ui/spinner";
import { type Issue as IssueType } from "@prisma/client";

const EmtpyIssue: React.FC<{
  className?: string;
  onCreate: (payload: { name: string; type: IssueType["type"] }) => void;
  onCancel: () => void;
  isCreating: boolean;
}> = ({ onCreate, onCancel, isCreating, className, ...props }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<IssueType["type"]>("TASK");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    focusInput();
  }, [props]);

  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function handleCreateIssue(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onCreate({ name, type });
    }
  }

  return (
    <div
      {...props}
      className={clsx(
        "relative flex items-center gap-x-2 border-2 border-blue-400 bg-white p-1.5",
        className
      )}
    >
      <IssueSelectType
        currentType={type}
        dropdownIcon
        onSelect={(type) => {
          setType(type);
          setTimeout(() => focusInput(), 50);
        }}
      />
      <input
        ref={inputRef}
        autoFocus
        type="text"
        placeholder="What needs to be done?"
        className=" w-full pl-2 pr-20 text-sm focus:outline-none"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        onKeyDown={handleCreateIssue}
      />
      {isCreating ? (
        <div className="absolute right-2 z-10">
          <Spinner size="md" />
        </div>
      ) : (
        <div className="absolute right-2 z-10 flex gap-x-1">
          <Button
            className="aspect-square shadow-md"
            onClick={() => onCancel()}
          >
            <MdClose className="text-sm" />
          </Button>
          <Button
            className="aspect-square shadow-md"
            onClick={() => onCreate({ name, type })}
          >
            <MdCheck className="text-sm" />
          </Button>
        </div>
      )}
    </div>
  );
};

export { EmtpyIssue };
