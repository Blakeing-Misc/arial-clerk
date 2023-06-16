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
        <svg
          className="mx-auto h-10 w-auto fill-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="80.53 173.82 616.4 271.39"
        >
          <path d="M620.345 294.03a75.357 75.357 0 0 0-53.545 22.285 75.353 75.353 0 0 0-53.279-22.281v.017c-.437-.008-.873-.021-1.312-.021a75.146 75.146 0 0 0-30.446 6.416V173.823h-44.091v165.785a75.534 75.534 0 0 0-122.912-23.293 75.449 75.449 0 0 0-96.986-8.518q-2.709 1.909-5.238 4.047-2.488 2.1-4.792 4.4-2.265 2.269-4.331 4.729-2.044 2.424-3.888 5.016-1.826 2.574-3.434 5.3-1.6 2.706-2.979 5.55t-2.51 5.819a75.546 75.546 0 0 0 0 53.913q1.138 2.971 2.51 5.82t2.979 5.55q1.609 2.726 3.434 5.3t3.888 5.017q2.067 2.452 4.331 4.727 2.3 2.3 4.792 4.4 2.528 2.133 5.238 4.047a75.449 75.449 0 0 0 96.986-8.518 75.546 75.546 0 0 0 126.024-31.846 75.716 75.716 0 0 0 72.477 54.131c.087 0 .174 0 .262-.005a75.358 75.358 0 0 0 53.277-22.271 75.574 75.574 0 1 0 53.545-128.893Zm-138.58 13.361a68.866 68.866 0 0 1 30.446-7.062c.439 0 .875.012 1.312.021v-.017a69.077 69.077 0 0 1 49.022 20.633q2.234 2.262 4.257 4.721 2.064 2.51 3.893 5.211 1.9 2.8 3.522 5.8a69.021 69.021 0 0 1 8.333 32.921 37.836 37.836 0 1 0 4.27-17.419 74.894 74.894 0 0 0-2.405-8.092 43.936 43.936 0 1 1-8.164 25.511A62.905 62.905 0 0 0 562.91 330.9a63.555 63.555 0 0 0-4.259-4.908 62.809 62.809 0 0 0-45.128-19.358v.016c-.437-.009-.873-.02-1.312-.02a62.59 62.59 0 0 0-30.446 7.87Zm107.084 62.228a31.5 31.5 0 1 1 31.5 31.495 31.531 31.531 0 0 1-31.5-31.495Zm-107.084-47.792a56.345 56.345 0 0 1 30.446-8.9c.439 0 .875.011 1.312.021v-.017a56.689 56.689 0 0 1 56.429 56.688 50.066 50.066 0 0 0 7.415 26.285 50.4 50.4 0 1 0 4.261-58.5q-1.446-3.058-3.154-5.961a56.692 56.692 0 1 1 0 76.36 56.866 56.866 0 0 1-8.15-11.523 56.376 56.376 0 0 1-6.671-26.657 50.066 50.066 0 0 0-7.415-26.285 50.539 50.539 0 0 0-42.715-24.1v.017c-.436-.011-.873-.02-1.312-.02a50.123 50.123 0 0 0-30.446 10.265Zm62.991 47.792a31.53 31.53 0 0 1-31.233 31.489h-.262a31.5 31.5 0 1 1 0-62.99h.262a31.529 31.529 0 0 1 31.233 31.501Zm-75.589-189.5h6.3v189.5a37.837 37.837 0 0 0 37.795 37.794h.262a37.826 37.826 0 0 0 33.262-20.371 74.961 74.961 0 0 0 2.405 8.092 44.058 44.058 0 0 1-35.667 18.578h-.262a44.144 44.144 0 0 1-44.094-44.094Zm-12.6 0h6.3v189.5a50.45 50.45 0 0 0 50.393 50.393h.262a50.307 50.307 0 0 0 38.454-18.17q1.446 3.057 3.154 5.961a56.555 56.555 0 0 1-41.608 18.508h-.262a56.756 56.756 0 0 1-56.692-56.692Zm-195.349 258.79a68.881 68.881 0 0 1-38.205-11.515q-2.712-1.8-5.239-3.84-2.488-2.009-4.785-4.237-2.271-2.205-4.338-4.608-2.051-2.387-3.885-4.955t-3.432-5.315q-1.611-2.758-2.968-5.674-1.4-3.014-2.519-6.177a69.286 69.286 0 0 1 0-45.938q1.113-3.16 2.519-6.177 1.356-2.913 2.968-5.674 1.6-2.739 3.432-5.315t3.885-4.955q2.064-2.4 4.338-4.608 2.293-2.226 4.785-4.237 2.526-2.039 5.239-3.84a69.156 69.156 0 0 1 87.49 9.122q2.234 2.262 4.257 4.721 2.064 2.51 3.893 5.211 1.9 2.8 3.522 5.8a69.021 69.021 0 0 1 8.333 32.921 37.836 37.836 0 1 0 4.27-17.419 74.673 74.673 0 0 0-2.406-8.092 43.939 43.939 0 1 1-8.163 25.511 62.905 62.905 0 0 0-13.341-38.719 63.555 63.555 0 0 0-4.259-4.908 62.991 62.991 0 1 0 0 87.258q1.841 2.6 3.894 5.024a69.08 69.08 0 0 1-49.285 20.635Zm65.214-107.47a56.692 56.692 0 1 1 0 76.36 56.866 56.866 0 0 1-8.15-11.523 56.376 56.376 0 0 1-6.671-26.657 50.066 50.066 0 0 0-7.415-26.285 50.4 50.4 0 1 0-4.262 58.5q1.447 3.057 3.155 5.961a56.617 56.617 0 1 1 14.821-38.18 50.066 50.066 0 0 0 7.415 26.285 50.4 50.4 0 1 0 4.261-58.5q-1.446-3.058-3.154-5.961Zm10.375 38.18a31.5 31.5 0 1 1 31.5 31.495 31.531 31.531 0 0 1-31.5-31.495Zm31.5 69.29a69.08 69.08 0 0 1-49.284-20.637q-2.233-2.262-4.258-4.721-2.062-2.511-3.892-5.211-1.9-2.8-3.522-5.8a69.021 69.021 0 0 1-8.333-32.921 37.836 37.836 0 1 0-4.27 17.419 74.961 74.961 0 0 0 2.405 8.092 43.936 43.936 0 1 1 8.164-25.511 63.069 63.069 0 1 0 17.6-43.629q-1.842-2.6-3.894-5.024A69.275 69.275 0 1 1 368.3 438.909Zm-75.588-69.29a31.5 31.5 0 1 1-31.5-31.5 31.531 31.531 0 0 1 31.495 31.5Zm220.809 69.286h-.262a69.368 69.368 0 0 1-69.29-69.29v-189.5h6.3v189.5a63.062 63.062 0 0 0 62.991 62.991h.262a62.813 62.813 0 0 0 45.128-19.358q1.842 2.6 3.894 5.024a69.077 69.077 0 0 1-49.028 20.633Zm106.822 0a69.08 69.08 0 0 1-49.285-20.637q-2.233-2.262-4.258-4.721-2.062-2.511-3.892-5.211-1.9-2.8-3.522-5.8a69.021 69.021 0 0 1-8.333-32.921 37.832 37.832 0 0 0-37.532-37.79h-.262a37.785 37.785 0 0 0-31.5 16.934v-10.991a43.927 43.927 0 0 1 30.446-12.242c.439 0 .876.008 1.312.021v-.017a44.134 44.134 0 0 1 43.831 44.089A62.878 62.878 0 0 0 570.7 408.34a63.555 63.555 0 0 0 4.259 4.908 62.991 62.991 0 1 0 0-87.258q-1.842-2.6-3.894-5.024a69.275 69.275 0 1 1 49.285 117.943Z" />
          <path d="M170.71 397.542a31.5 31.5 0 1 1 .507-55.574c.4.3.794.616 1.162.94L195.1 304.87a76.993 76.993 0 0 0-5.524-3.036 75.59 75.59 0 1 0 .047 135.545q2.832-1.4 5.523-3.038l-22.77-38.114a19.776 19.776 0 0 1-1.666 1.315Zm15.668 34.4a69.29 69.29 0 1 1-.048-124.669l-3.241 5.425a62.991 62.991 0 1 0 .048 113.819Zm-6.484-10.853a56.692 56.692 0 1 1-.048-102.962l-3.251 5.441a50.393 50.393 0 1 0 .049 92.08Zm-23.733-7.376a44.094 44.094 0 1 1 17.173-84.686l-3.265 5.465a37.794 37.794 0 1 0 .05 70.234l3.265 5.465a43.74 43.74 0 0 1-17.223 3.522ZM542.9 216.878a15.554 15.554 0 0 0-12.493 6.214 15.662 15.662 0 0 0-28.153 9.446v22.855h6.548v-22.855a9.113 9.113 0 1 1 18.226 0v22.855h6.759v-22.855a9.113 9.113 0 1 1 18.226 0v22.855h6.548v-22.855a15.678 15.678 0 0 0-15.661-15.66ZM592.057 219.719a20.184 20.184 0 0 0-19.917-.074c-5.844 3.341-9.068 9.253-9.079 16.61-.389 10.374 7.133 16.81 14.761 18.586a20.906 20.906 0 0 0 4.732.541 18.133 18.133 0 0 0 17.1-10.947l.38-.85-5.5-2.935-.443.964a12.926 12.926 0 0 1-15.022 7.233 11.846 11.846 0 0 1-9.41-11.332h31.212l.01-.99c.073-7.455-3.06-13.425-8.824-16.806Zm-21.666 11.961c1.729-6.175 7.283-8.43 11.691-8.372 4.776.017 10.057 2.622 11.664 8.372ZM635.8 221.51a19.158 19.158 0 1 0 6.9 14.721v-31.843h-6.9Zm-2.685 7.138a12.088 12.088 0 0 1 2.651 7.586 12.248 12.248 0 1 1-3.381-8.431s.693.807.734.845ZM677.774 216.878a19.162 19.162 0 1 0 12.257 33.881v4.429h6.9v-19.152a19.18 19.18 0 0 0-19.157-19.158Zm8.846 27.585a12.363 12.363 0 1 1 .726-.841c-.046.038-.726.841-.726.841ZM647.541 218.427h6.47v36.774h-6.47zM650.76 204.131a4.255 4.255 0 0 0-3.9 2.113 5.223 5.223 0 0 0 0 5.135 4.289 4.289 0 0 0 3.8 2.139h.088a4.375 4.375 0 0 0 3.952-2.147 5.208 5.208 0 0 0 0-5.115 4.289 4.289 0 0 0-3.94-2.125Z" />
        </svg>
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
                  className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
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
            className="font-semibold leading-6 text-orange-600 hover:text-orange-500"
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
        className="flex w-full justify-center rounded-md border-orange-600 border bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-orange-500 shadow-sm hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        <span className="text-sm font-semibold leading-6">Back</span>
      </button>
    </div>
  );
}
