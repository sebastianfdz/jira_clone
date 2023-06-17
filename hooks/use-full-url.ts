"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useFullURL = (): [string] => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("/");
  useEffect(() => {
    // eslint-disable-next-line
    setUrl(`${pathname}?${searchParams}`);
  }, [pathname, searchParams]);
  return [url];
};
