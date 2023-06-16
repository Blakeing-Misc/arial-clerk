import { useSignUp } from "@clerk/nextjs";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { VerifyCodeNotice } from "@/components/common/verify-code-notice";

import { APIResponseError, parseError } from "@/lib/errors";

import { Validations } from "@/lib/validators/form-validations";
import { Input } from "./common/input";

export function SignUpCode({
  emailAddress,
  onDone,
}: {
  emailAddress: string;
  onDone: (sessionId: string) => void;
}) {
  const { isLoaded, signUp } = useSignUp();
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

  const verifySignUpCode: SubmitHandler<{ code: string }> = async function ({
    code,
  }) {
    try {
      setIsLoading(true);
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        onDone(signUpAttempt.createdSessionId!);
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

  const resendSignUpCode = async function () {
    await signUp.prepareEmailAddressVerification();
  };

  return (
    <form onSubmit={handleSubmit(verifySignUpCode)}>
      <VerifyCodeNotice
        onResendClick={resendSignUpCode}
        emailAddress={emailAddress}
      />
      <Input
        label="Code"
        {...register("code", Validations.oneTimeCode)}
        errorText={errors.code?.message}
        autoFocus
      />
      <div className="mt-6">
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Verify
        </button>
      </div>
    </form>
  );
}
