import { baseInput, miniLabel } from "@/style/baseStyle";
import { IInputExtraData } from "@/types/input";
import React from "react";
import { twJoin } from "tailwind-merge";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  IInputExtraData;

const TextareaInput = React.forwardRef<HTMLTextAreaElement, Props>(
  ({ id, label, hint, error, ...inputProps }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <label htmlFor={id} className={miniLabel}>
            {label}
          </label>
          {hint && <span className="text-sm text-neutral-500">{hint}</span>}
        </div>
        <textarea
          id={id}
          className={twJoin(baseInput, "h-40 resize-none")}
          {...inputProps}
          ref={ref}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);

TextareaInput.displayName = "TextareaInput";

export default TextareaInput;
