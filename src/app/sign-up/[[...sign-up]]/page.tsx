"use client";

import { useSignUp } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { APIResponseError, parseError } from "@/lib/errors";
import { SignUpCode } from "@/components/sign-up-code";
import { SignedOut } from "@clerk/nextjs";

interface SignUpInputs {
  // name: string;
  // company: string;
  emailAddress: string;
  // country: string;
  // phone: string;
  password: string;
  clerkError?: string;
}

enum SignUpFormSteps {
  FORM,
  CODE,
}

function SignUpPage() {
  const { isLoaded, setSession, signUp } = useSignUp();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const [formStep, setFormStep] = React.useState(SignUpFormSteps.FORM);
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm<SignUpInputs>();

  if (!isLoaded) {
    return null;
  }

  const onSubmit: SubmitHandler<SignUpInputs> = async ({
    emailAddress,
    password,
    // name,
    // phone,
    // country,
    // company,
  }) => {
    try {
      setIsLoading(true);
      // const [firstName, lastName] = name.split(/\s+/);
      const signUpAttempt = await signUp.create({
        emailAddress,
        password,
        // lastName,
        // firstName,
        // unsafeMetadata: {
        //   country,
        //   company,
        //   phone,
        // },
      });
      await signUpAttempt.prepareEmailAddressVerification();
      setFormStep(SignUpFormSteps.CODE);
    } catch (err) {
      setError("clerkError", {
        type: "manual",
        message: parseError(err as APIResponseError),
      });
    } finally {
      setIsLoading(false);
    }
  };

  /** Clerk API related errors on change. */
  watch(() => errors.clerkError && clearErrors("clerkError"));

  const signUpComplete = async (createdSessionId: string) => {
    /** Couldn't the signup be updated and have the createdSessionId ? */
    await setSession(createdSessionId, () => router.push("/"));
  };

  return (
    <SignedOut>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {formStep === SignUpFormSteps.FORM && (
            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    {...register("emailAddress")}
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    {...register("password")}
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}
          {formStep === SignUpFormSteps.CODE && (
            <SignUpCode
              emailAddress={getValues("emailAddress")}
              onDone={signUpComplete}
            />
          )}

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Start a 14 day free trial
            </a>
          </p>
        </div>
      </div>
    </SignedOut>
  );
}

export default SignUpPage;
