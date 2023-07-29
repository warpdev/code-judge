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
import { IInputContent } from "@/types/input";
import { ILocale } from "@/types/common";
import InputRow from "@/components/Shared/InputRow";
import { lectureInputs } from "@/constants/lecture";

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
  IInputContent["type"]
> & {
  locale?: string;
};

const AddLectureForm = ({ locale }: { locale: ILocale }) => {
  const t = useTranslations();
  const {
    storedValue: content,
    setValue: setContent,
    rawGet,
  } = useStorage<InputValue>("add.lecture");
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

  const onSubmit: SubmitHandler<InputValue> = async (data) => {};

  return (
    <div className="flex flex-col gap-4 p-4">
      {lectureInputs.map((inputs, index) => {
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
                namespace="lecture"
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
        {t("lecture.input.submit")}
      </button>
    </div>
  );
};

export default AddLectureForm;
