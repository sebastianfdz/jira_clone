"use client";

import { useEffect, useState } from "react";

export const useStrictModeDroppable = (): [boolean] => {
  // This is a hack to get around the fact that react-beautiful-dnd doesn't work very well in StrictMode.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  return [enabled];
};
