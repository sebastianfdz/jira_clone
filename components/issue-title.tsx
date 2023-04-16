import React, { Fragment, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MdCheck, MdClose } from "react-icons/md";

type IssueTitleProps = {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
};

const IssueTitle = React.forwardRef<HTMLInputElement, IssueTitleProps>(
  ({ isEditing, setIsEditing, title }, ref) => {
    const [currentTitle, setCurrentTitle] = useState(title);
    useEffect(() => {
      if (isEditing) {
        (ref as React.RefObject<HTMLInputElement>).current?.focus();
      }
    }, [isEditing, ref]);
    return (
      <Fragment>
        {isEditing ? (
          <div
            data-state={isEditing ? "editing" : "not-editing"}
            className="relative flex w-fit [&[data-state=editing]]:w-full"
          >
            <input
              type="text"
              ref={ref}
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              className="h-7 w-full min-w-[500px] px-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditing(false);
                }
              }}
            />
            <div
              data-state={isEditing ? "editing" : "not-editing"}
              className="absolute -bottom-10 right-0 z-10 hidden gap-x-1 [&[data-state=editing]]:flex"
            >
              <Button
                className="aspect-square shadow-md"
                onClick={() => setIsEditing(false)}
              >
                <MdClose className="text-sm" />
              </Button>
              <Button
                className="aspect-square shadow-md"
                onClick={() => setIsEditing(false)}
              >
                <MdCheck className="text-sm" />
              </Button>
            </div>
          </div>
        ) : (
          <div className=" whitespace-nowrap">{title}</div>
        )}
      </Fragment>
    );
  }
);

IssueTitle.displayName = "IssueTitle";

export { IssueTitle };
