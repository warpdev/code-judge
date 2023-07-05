"use client";

import {
  Control,
  Controller,
  FieldError,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { actionToDark, baseInput, roundButton } from "@/style/baseStyle";
import { problemInputs } from "@/constants/problem";
import { IProblemInput } from "@/types/common";
import React from "react";
import Editor from "@/components/Editor/Editor";
import { twJoin } from "tailwind-merge";

/*
  title String
  description String
  difficulty String
  tags String[]
  memoryLimit Int
  timeLimit Int
  input String
  output String
  sampleInput String
  sampleOutput String
 */
type InputValue = Record<
  (typeof problemInputs)[number]["id"],
  IProblemInput["type"]
>;

const inputStyle = baseInput;

const InputRow = ({
  control,
  inputProps: { id, label, placeholder, options, type, inputMode },
  register,
  error,
}: {
  control: Control<InputValue>;
  inputProps: IProblemInput;
  register: UseFormRegister<InputValue>;
  error?: FieldError;
}) => {
  return (
    <span className="flex flex-col gap-2">
      <label htmlFor={id}>{label}</label>
      {type === "editor" ? (
        <div className={inputStyle}>
          <Controller
            control={control}
            render={({ field: { onChange } }) => (
              <Editor id={id} onChange={onChange} />
            )}
            name={id}
          />
        </div>
      ) : type === "multiline" ? (
        <textarea
          id={id}
          className={inputStyle}
          {...register(id, options)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={inputStyle}
          placeholder={placeholder}
          inputMode={inputMode}
          {...register(id, options)}
        />
      )}
      {error && <span className="text-sm text-red-400">{error.message}</span>}
    </span>
  );
};

const AddProblemForm = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InputValue>();

  const router = useRouter();

  const onSubmit: SubmitHandler<InputValue> = async (data) => {
    const { data: problem } = await axios.post("/api/problem", data);
    router.push(`/problems/${problem.id}`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* register your input into the hook by invoking the "register" function */}
      {problemInputs.map((input) => (
        <InputRow
          key={input.id}
          register={register}
          control={control}
          inputProps={input}
          error={errors[input.id]}
        />
      ))}

      <button
        onClick={handleSubmit(onSubmit)}
        className={twJoin(
          roundButton,
          "bg-emerald-500 py-2 font-bold text-white",
          actionToDark
        )}
      >
        Submit
      </button>
    </div>
  );
};

export default AddProblemForm;
