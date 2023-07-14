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
import React, { useEffect } from "react";
import Editor from "@/components/Editor/Editor";
import { twJoin } from "tailwind-merge";
import useStorage from "@/utils/hooks/useStorage";
import { useDebouncedCallback } from "use-debounce";
import { useTranslations } from "next-intl";
import { LOCALE_MAP, LOCALES } from "@/constants/common";
import { baseSelect, greenButton } from "@/style/baseComponent";

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
> & {
  locale?: string;
};

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
  const t = useTranslations("problem");

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{t(label as any)}</label>
      {type === "editor" ? (
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => {
            return <Editor id={id} onChange={onChange} defaultValue={value} />;
          }}
          name={id}
        />
      ) : type === "multiline" ? (
        <textarea
          id={id}
          className={twJoin("h-40", inputStyle)}
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
    </div>
  );
};

const AddProblemForm = () => {
  const t = useTranslations();
  const {
    storedValue: content,
    setValue: setContent,
    rawGet,
  } = useStorage<InputValue>("add.problem");
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<InputValue>({
    defaultValues: async () => ((await rawGet()) as InputValue) ?? {},
  });

  const setDebouncedContent = useDebouncedCallback((value: any) => {
    setContent(value);
  }, 1500);

  useEffect(() => {
    watch(setDebouncedContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  const onSubmit: SubmitHandler<InputValue> = async (data) => {
    const { data: problem } = await axios.post("/api/problem", data);
    setContent({});
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
      <div className="flex flex-col gap-2">
        <label htmlFor="locale">{t("problem.language")}</label>
        <select id="locale" {...register("locale")} className={baseSelect}>
          {LOCALES.map((locale) => (
            <option key={locale} value={locale}>
              {t(`common.${LOCALE_MAP[locale].name}` as any)}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSubmit(onSubmit)} className={greenButton}>
        Submit
      </button>
    </div>
  );
};

export default AddProblemForm;
