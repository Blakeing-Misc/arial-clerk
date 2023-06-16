import { cn } from "@/lib/utils";
import { CSSTransition } from "react-transition-group";

export function ErrorMessage({ message }: { message: string }): JSX.Element {
  return (
    <CSSTransition
      in={Boolean(message)}
      timeout={200}
      classNames="errorDisplay"
    >
      <span
        className={cn(
          "block text-xs leading-6 mt-2 text-red-500",
          "errorDisplay"
        )}
      >
        {message}
      </span>
    </CSSTransition>
  );
}
