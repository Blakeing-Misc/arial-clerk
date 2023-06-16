import React from "react";

export function VerifyCodeNotice({
  emailAddress,
  onResendClick,
}: {
  emailAddress: string;
  onResendClick: () => void;
}): JSX.Element {
  const [resendCodeDisabled, setResendCodeDisabled] = React.useState(false);

  const handleResendClick = async function () {
    try {
      setResendCodeDisabled(true);
      await onResendClick();
    } finally {
      setResendCodeDisabled(false);
    }
  };

  return (
    <div className="text-center text-sm text-gray-500">
      Enter the 6-digit code sent to <br />
      <span>{emailAddress}</span>
      <br />
      <button
        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        type="button"
        disabled={resendCodeDisabled}
        onClick={handleResendClick}
      >
        Resend code
      </button>
    </div>
  );
}
