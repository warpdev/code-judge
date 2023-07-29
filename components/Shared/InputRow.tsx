"use client";
import {
  Control,
  Controller,
  FieldError,
  UseFormRegister,
} from "react-hook-form";
import { IInputContent } from "@/types/input";
import { useTranslations } from "next-intl";
import Editor from "@/components/Editor/Editor";
import { twJoin, twMerge } from "tailwind-merge";
import { baseSelect } from "@/style/baseComponent";
import { handleNumberInput } from "@/utils/commonUtils";
import React from "react";
import { baseInput, miniLabel } from "@/style/baseStyle";

const InputRow = ({
  namespace,
  control,
  inputProps,
  register,
  error,
}: {
  namespace: keyof IntlMessages;
  control: Control<any>;
  inputProps: IInputContent;
  register: UseFormRegister<any>;
  error?: FieldError;
}) => {
  const t = useTranslations();
  const {
    id,
    allowDecimal,
    options,
    type,
    inputMode,
    className,
    hasPlaceholder,
    hasHint,
  } = inputProps;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between gap-2">
        <label
          htmlFor={id}
          className="after:ml-1 after:text-red-500 data-[required=true]:after:content-['*']"
          data-required={!!options.required}
        >
          {t(`${namespace}.input.${id}` as any)}
        </label>
        {hasHint && (
          <span
            className={twMerge(
              miniLabel,
              "text-neutral-600 dark:text-neutral-400",
            )}
          >
            {t(`${namespace}.inputHint.${id}` as any, {
              min: ((options.minLength ?? options.min) as any)?.value,
              max: ((options.maxLength ?? options.max) as any)?.value,
            })}
          </span>
        )}
      </div>
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
          className={twJoin("h-40 resize-none", baseInput, className)}
          {...register(id, options)}
          placeholder={
            hasPlaceholder
              ? t(`${namespace}.placeholder.${id}` as any)
              : undefined
          }
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
                className={twJoin(baseInput, className)}
                placeholder={
                  hasPlaceholder
                    ? t(`${namespace}.placeholder.${id}` as any)
                    : undefined
                }
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
            label: t(`${namespace}.view.${id}` as any),
            min: ((options.minLength ?? options.min) as any)?.value,
            max: ((options.maxLength ?? options.max) as any)?.value,
          })}
        </span>
      )}
    </div>
  );
};

export default InputRow;
