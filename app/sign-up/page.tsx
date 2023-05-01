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
              "bg-iskrive hover:bg-iskrive hover:brightness-95 text-sm normal-case",

            formButtonSecondary: "bg-iskrive text-sm normal-case",
            footerActionText: " text-md",
            footerActionLink:
              "text-iskrive hover:text-iskrive hover:brightness-95 font-semibold text-md",
          },
        }}
      />
    </div>
  );
};

export default Signup;
