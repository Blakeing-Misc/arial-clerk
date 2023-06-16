import { useSignUp } from "@clerk/nextjs";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { VerifyCodeNotice } from "@/components/common/verify-code-notice";

import { APIResponseError, parseError } from "@/lib/errors";

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
      <input {...register("code")} autoFocus />
      <div>
        <button type="submit">Verify</button>
      </div>
    </form>
  );
}
