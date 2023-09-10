import { baseInput, miniLabel } from "@/style/baseStyle";
import { IInputExtraData } from "@/types/input";
import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & IInputExtraData;

const TextInput = React.forwardRef<HTMLInputElement, Props>(
  ({ id, label, hint, error, ...inputProps }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <label htmlFor={id} className={miniLabel}>
            {label}
          </label>
          {hint && <span className="text-sm text-neutral-500">{hint}</span>}
        </div>
        <input id={id} className={baseInput} {...inputProps} ref={ref} />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export default TextInput;
