import { SignedOut } from "@clerk/nextjs";
import type { NextPage } from "next";

import { SignInForm } from "@/components/sign-in-form";
import Navbar from "@/components/navbar";

const SignIn: NextPage = () => {
  return (
    <SignedOut>
      <Navbar className="fixed w-full" />
      <SignInForm />
    </SignedOut>
  );
};

export default SignIn;
