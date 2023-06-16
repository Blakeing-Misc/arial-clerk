import { useSignIn } from "@clerk/clerk-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { VerifyCodeNotice } from "@/components/common/verify-code-notice";
import { APIResponseError, parseError } from "@/lib/errors";

type SignInCodeProps = {
  emailAddress: string;
  onDone: (sessionId: string) => void;
};

export function SignInCode({ emailAddress, onDone }: SignInCodeProps) {
  const { isLoaded, signIn } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ code: string }>();

  if (!isLoaded) {
    return null;
  }

  const verifySignInCode: SubmitHandler<{ code: string }> = async function ({
    code,
  }) {
    try {
      setIsLoading(true);
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });
      if (signInAttempt.status === "complete") {
        onDone(signInAttempt.createdSessionId!);
      }
    } catch (err) {
      setError("code", {
        type: "manual",
        message: parseError(err as APIResponseError),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendSignInCode = async function () {
    const emailCodeFactor = signIn.supportedFirstFactors.find(
      (factor) => factor.strategy === "email_code"
    );

    await signIn.prepareFirstFactor({
      strategy: "email_code",
      // @ts-ignore
      email_address_id: emailCodeFactor.email_address_id,
    });
  };

  return (
    <form onSubmit={handleSubmit(verifySignInCode)}>
      <VerifyCodeNotice
        emailAddress={emailAddress}
        onResendClick={resendSignInCode}
      />
      <div className="mt-6">
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          {...register("code")}
          autoFocus
        />
      </div>

      <div className="mt-6 ">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span className="text-sm font-semibold leading-6">Continue</span>
        </button>
      </div>
    </form>
  );
}
