import { SignUp } from '@clerk/clerk-react';

export const Register = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SignUp
        path="/sign-up"
        redirectUrl={'/app'}
        signInUrl="/sign-in"
        appearance={{
          elements: {
            formButtonPrimary:
              'bg-iskrive hover:bg-iskrive hover:brightness-95 text-sm normal-case',

            formButtonSecondary: 'bg-iskrive text-sm normal-case',
            footerActionText: ' text-md',
            footerActionLink:
              'text-iskrive hover:text-iskrive hover:brightness-95 font-semibold text-md',
          },
        }}
      />
    </div>
  );
};
