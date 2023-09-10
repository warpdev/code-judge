import { baseSelect } from "@/style/baseComponent";
import React from "react";
import { IInputExtraData } from "@/types/input";
import { baseInput, miniLabel } from "@/style/baseStyle";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> &
  IInputExtraData & {
    children: React.ReactNode;
  };

const SelectInput = React.forwardRef<HTMLSelectElement, Props>(
  ({ id, label, children, hint, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between">
          <label htmlFor={id} className={miniLabel}>
            {label}
          </label>
          {hint && <span className="text-sm text-neutral-500">{hint}</span>}
        </div>
        <select id={id} className={baseSelect} {...props} ref={ref}>
          {children}
        </select>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  },
);

SelectInput.displayName = "SelectInput";

export default SelectInput;
