"use client";
import { SignIn } from "@clerk/clerk-react";

const Signin = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6">
      <SignIn
        path="/sign-in"
        redirectUrl={"/project/backlog"}
        signUpUrl="/sign-up"
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

export default Signin;
