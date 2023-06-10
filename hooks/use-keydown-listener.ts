"use client";
import { useRef, useEffect, type RefObject } from "react";

export const useKeydownListener = (
  ref: RefObject<HTMLElement>,
  targetKey: string | string[],
  callback: (ref: RefObject<HTMLElement>, event?: KeyboardEvent) => void
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isInsideContentEditable = () =>
    !!document.activeElement?.getAttribute("contenteditable") ||
    (document.activeElement?.tagName &&
      ["TEXTAREA", "INPUT"].includes(document.activeElement?.tagName));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isInsideContentEditable())
        if (typeof targetKey === "string") {
          if (event.key === targetKey) {
            event.preventDefault();
            callback(ref, event);
          }
        } else if (Array.isArray(targetKey)) {
          if (targetKey.includes(event.key)) {
            event.preventDefault();
            callback(ref, event);
          }
        }
    };

    const currentRef = ref.current;
    if (currentRef) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (currentRef) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [ref, targetKey, callback]);

  return [inputRef];
};
