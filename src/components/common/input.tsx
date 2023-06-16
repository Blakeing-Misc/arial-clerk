import { cn } from "@/lib/utils";
import React from "react";
import { ErrorMessage } from "@/components/common/error-message";

const Input = React.forwardRef<
  HTMLInputElement,
  {
    label: string;
    errorText?: string;
    onPaste?: React.ClipboardEventHandler<HTMLInputElement>;
    autoFocus?: boolean;
    type?: string;
    badge?: React.ReactNode | string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(
  (
    {
      autoFocus = true,
      type = "text",
      //   badge,
      label,
      errorText,
      onPaste,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        {label && (
          <div>
            <label
              htmlFor={label}
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {label}
            </label>
            <div className="mt-2">
              <input
                autoFocus={autoFocus}
                onPaste={onPaste}
                className={cn(
                  "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
                  // badge && styles.inputWithBadge,
                  errorText && " ring-red-500"
                )}
                ref={ref}
                type={type}
                {...rest}
              />
            </div>
            {<ErrorMessage message={errorText || ""} />}
          </div>
        )}
      </>
    );
  }
);

Input.displayName = "Input";

export { Input };
