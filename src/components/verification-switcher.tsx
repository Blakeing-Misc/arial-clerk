import { SignInFormSteps } from "@/components/sign-in-form";

type VerificationSteps = SignInFormSteps.CODE | SignInFormSteps.PASSWORD;

type VerificationSwitcherProps = {
  formStep: SignInFormSteps;
  onSwitchVerificationMethod: (step: VerificationSteps) => void;
};

export function VerificationSwitcher({
  formStep,
  onSwitchVerificationMethod,
}: VerificationSwitcherProps): JSX.Element | null {
  const alternateFormStep =
    formStep === SignInFormSteps.CODE
      ? SignInFormSteps.PASSWORD
      : SignInFormSteps.CODE;

  if (formStep === SignInFormSteps.EMAIL) {
    return null;
  }

  return (
    <div>
      <p className="mt-10 text-center text-sm text-gray-500">
        Not a working?{" "}
        <button
          className="font-semibold leading-6 text-orange-600 hover:text-orange-500"
          onClick={() => onSwitchVerificationMethod(alternateFormStep)}
        >
          Try another method
        </button>
      </p>
    </div>
  );
}
