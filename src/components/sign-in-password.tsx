import { useSignIn } from "@clerk/nextjs";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { APIResponseError, parseError } from "@/lib/errors";

type SignInPasswordProps = {
  onDone: (sessionId: string) => void;
};

export function SignInPassword({ onDone }: SignInPasswordProps) {
  const { isLoaded, signIn } = useSignIn();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ password: string }>();

  if (!isLoaded) {
    return null;
  }

  const verifyPassword: SubmitHandler<{ password: string }> = async function ({
    password,
  }) {
    try {
      setIsLoading(true);
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "password",
        password,
      });
      if (signInAttempt.status === "complete") {
        onDone(signInAttempt.createdSessionId!);
      }
    } catch (err) {
      setError("password", {
        type: "manual",
        message: parseError(err as APIResponseError),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(verifyPassword)}>
      <label
        htmlFor="password"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Password
      </label>
      <input
        className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
        type="password"
        {...register("password")}
      />
      <div className="mt-6 ">
        <button
          className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          type="submit"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
