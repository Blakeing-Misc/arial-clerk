import { SignedOut } from "@clerk/nextjs";
import type { NextPage } from "next";

import { SignUpForm } from "@/components/sign-up-form";
import Navbar from "@/components/navbar";

const SignIn: NextPage = () => {
  return (
    <SignedOut>
      <Navbar className="fixed w-full" />
      <SignUpForm />
    </SignedOut>
  );
};

export default SignIn;
