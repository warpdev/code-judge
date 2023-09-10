import React from "react";
import { miniLabel } from "@/style/baseStyle";
import { IInputExtraData } from "@/types/input";
import { Control, Controller, FieldValues } from "react-hook-form";
import Editor from "@/components/Editor/Editor";

type Props = React.InputHTMLAttributes<HTMLInputElement> &
  IInputExtraData & {
    control: any;
  };

const EditorInput = ({ id, label, control, hint, error, ...props }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between">
        <label htmlFor={id} className={miniLabel}>
          {label}
        </label>
        {hint && <span className="text-sm text-neutral-500">{hint}</span>}
      </div>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => {
          return <Editor id={id} onChange={onChange} defaultValue={value} />;
        }}
        name={id}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default EditorInput;
