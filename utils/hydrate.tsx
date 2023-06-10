"use client";
import { Hydrate as RQHydrate, type HydrateProps } from "@tanstack/react-query";

function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}

export { Hydrate };
