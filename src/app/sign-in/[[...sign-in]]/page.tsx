import { SignedOut } from "@clerk/nextjs";
import type { NextPage } from "next";

import { SignInForm } from "@/components/sign-in-form";

const SignIn: NextPage = () => {
  return (
    <SignedOut>
      <SignInForm />
    </SignedOut>
  );
};

export default SignIn;
