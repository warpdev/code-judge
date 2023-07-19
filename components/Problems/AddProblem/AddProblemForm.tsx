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
import { baseInput } from "@/style/baseStyle";
import { problemInputs } from "@/constants/problem";
import React, { useEffect } from "react";
import Editor from "@/components/Editor/Editor";
import { twJoin } from "tailwind-merge";
import useStorage from "@/utils/hooks/useStorage";
import { useDebouncedCallback } from "use-debounce";
import { useTranslations } from "next-intl";
import { baseSelect, greenButton } from "@/style/baseComponent";
import { handleNumberInput } from "@/utils/commonUtils";
import { IProblemInput } from "@/types/input";
import { ILocale } from "@/types/common";

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
  (typeof problemInputs)[number][number]["id"],
  IProblemInput["type"]
> & {
  locale?: string;
};

const inputStyle = baseInput;

const InputRow = ({
  control,
  inputProps,
  register,
  error,
}: {
  control: Control<InputValue>;
  inputProps: IProblemInput;
  register: UseFormRegister<InputValue>;
  error?: FieldError;
}) => {
  const t = useTranslations();
  const {
    id,
    label,
    allowDecimal,
    placeholder,
    options,
    type,
    inputMode,
    className,
  } = inputProps;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id}>{t(`input.${label}` as any)}</label>
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
          className={twJoin("h-40 resize-none", inputStyle, className)}
          {...register(id, options)}
          placeholder={placeholder && t(placeholder as any)}
        />
      ) : type === "select" ? (
        <select id={id} {...register(id, options)} className={baseSelect}>
          {inputProps.selectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.label as any)}
            </option>
          ))}
        </select>
      ) : (
        <Controller
          control={control}
          rules={options}
          render={({ field: { onChange, value } }) => {
            return (
              <input
                id={id}
                className={twJoin(inputStyle, className)}
                placeholder={placeholder && t(placeholder as any)}
                inputMode={inputMode}
                defaultValue={value}
                onChange={(e) =>
                  type === "number"
                    ? handleNumberInput(e, onChange, allowDecimal)
                    : onChange(e)
                }
              />
            );
          }}
          name={id}
        />
      )}
      {error && (
        <span className="text-sm text-red-400">
          {t(error.message as any, {
            label: t(`problem.${label}` as any),
            minLength: (options.minLength as any)?.value,
            maxLength: (options.maxLength as any)?.value,
            min: (options.min as any)?.value,
            max: (options.max as any)?.value,
          })}
        </span>
      )}
    </div>
  );
};

const AddProblemForm = ({ locale }: { locale: ILocale }) => {
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
    defaultValues: async () => {
      return {
        locale,
        ...(((await rawGet()) as InputValue) ?? {}),
      } as InputValue;
    },
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
      {problemInputs.map((inputs, index) => {
        return (
          <div
            className={twJoin(
              "grid gap-4 p-4 md:auto-cols-fr md:grid-flow-col",
              "grid-flow-row",
            )}
            key={index}
          >
            {/* register your input into the hook by invoking the "register" function */}
            {inputs.map((input) => (
              <InputRow
                key={input.id}
                register={register}
                control={control}
                inputProps={input}
                error={errors[input.id]}
              />
            ))}
          </div>
        );
      })}
      <button onClick={handleSubmit(onSubmit)} className={greenButton}>
        {t("input.submit")}
      </button>
    </div>
  );
};

export default AddProblemForm;
