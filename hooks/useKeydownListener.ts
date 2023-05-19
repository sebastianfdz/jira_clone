import { useRef, useEffect, type RefObject } from "react";

export const useKeydownListener = (
  ref: RefObject<HTMLElement>,
  targetKey: string | string[],
  callback: (ref: RefObject<HTMLElement>) => void
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (typeof targetKey === "string") {
        if (event.key === targetKey) {
          event.preventDefault();
          callback(ref);
        }
      } else if (Array.isArray(targetKey)) {
        if (targetKey.includes(event.key)) {
          event.preventDefault();
          callback(ref);
        }
      }
    };

    const currentRef = ref.current;
    if (currentRef) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (currentRef) {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [ref, targetKey, callback]);

  return [inputRef];
};
