"use client";
import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignUp
        path="/sign-up"
        redirectUrl={"/project/backlog"}
        signInUrl="/sign-in"
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-inprogress hover:bg-inprogress hover:brightness-95 text-sm normal-case",

            formButtonSecondary: "bg-inprogress text-sm normal-case",
            footerActionText: " text-md",
            footerActionLink:
              "text-inprogress hover:text-inprogress hover:brightness-95 font-semibold text-md",
          },
        }}
      />
    </div>
  );
};

export default Signup;
