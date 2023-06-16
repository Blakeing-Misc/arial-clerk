"use client";

import React from "react";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { APIResponseError, parseError } from "@/lib/errors";
import { SignInCode } from "@/components/sign-in-code";

import { SignInPassword } from "@/components/sign-in-password";
import { VerificationSwitcher } from "@/components/verification-switcher";
import { EmailCodeFactor, OAuthStrategy } from "@clerk/types";

import { Validations } from "@/lib/validators/form-validations";
import { Input } from "@/components/common/input";
import Link from "next/link";

interface SignInInputs {
  emailAddress: string;
}

export enum SignInFormSteps {
  EMAIL,
  CODE,
  PASSWORD,
}

export function SignInForm() {
  const { isLoaded, signIn, setSession } = useSignIn();
  const router = useRouter();
  const [firstName, setFirstName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const [formStep, setFormStep] = React.useState(SignInFormSteps.EMAIL);
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<SignInInputs>();

  if (!isLoaded) {
    return null;
  }

  const signInGoogle = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  const sendSignInCode = async function () {
    const emailAddress = getValues("emailAddress");
    const signInAttempt = await signIn.create({
      identifier: emailAddress,
    });

    const emailCodeFactor = signInAttempt.supportedFirstFactors.find(
      (factor) => factor.strategy === "email_code"
    ) as EmailCodeFactor;

    setFirstName(signInAttempt.userData.firstName || "");
    await signInAttempt.prepareFirstFactor({
      strategy: "email_code",
      emailAddressId: emailCodeFactor.emailAddressId,
    });
  };

  const verifyEmail = async function () {
    try {
      setIsLoading(true);
      await sendSignInCode();
      setFormStep(SignInFormSteps.CODE);
    } catch (err) {
      setError("emailAddress", {
        type: "manual",
        message: parseError(err as APIResponseError),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUpComplete = async (createdSessionId: string) => {
    /** Couldn't the signin be updated and have the createdSessionId ? */
    setSession(createdSessionId, () => router.push("/"));
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {formStep === SignInFormSteps.EMAIL && (
            <form
              onSubmit={handleSubmit(verifyEmail)}
              className="space-y-6"
              action="#"
              method="POST"
            >
              <Input
                label="Email"
                {...register("emailAddress", Validations.emailAddress)}
                errorText={errors.emailAddress?.message}
                autoFocus
              />
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
          {formStep === SignInFormSteps.CODE && (
            <SignInCode
              onDone={signUpComplete}
              emailAddress={getValues("emailAddress")}
            />
          )}
          {formStep === SignInFormSteps.PASSWORD && (
            <SignInPassword onDone={signUpComplete} />
          )}
          {formStep !== SignInFormSteps.EMAIL && (
            <BackButton onClick={() => setFormStep(SignInFormSteps.EMAIL)} />
          )}
          <VerificationSwitcher
            formStep={formStep}
            onSwitchVerificationMethod={setFormStep}
          />
          <div className="relative mt-10">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white px-6 text-gray-900">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => signInGoogle("oauth_google")}
              className="flex w-full items-center justify-center gap-3 rounded-md border-gray-300 border px-3 py-1.5 text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
            >
              {/* <svg
              className="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
            </svg> */}
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                />
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
              <span className="text-sm font-semibold leading-6">Google</span>
            </button>

            <button
              disabled
              className="flex cursor-not-allowed w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-semibold leading-6">GitHub</span>
            </button>
          </div>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

type BackButtonProps = { onClick: () => void };

function BackButton({ onClick }: BackButtonProps): JSX.Element {
  return (
    <div className="mt-6 ">
      <button
        type="submit"
        onClick={onClick}
        className="flex w-full justify-center rounded-md border-indigo-600 border bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-indigo-500 shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <span className="text-sm font-semibold leading-6">Back</span>
      </button>
    </div>
  );
}
