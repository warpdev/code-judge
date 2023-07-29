"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { twJoin } from "tailwind-merge";
import useStorage from "@/utils/hooks/useStorage";
import { useDebouncedCallback } from "use-debounce";
import { useTranslations } from "next-intl";
import { greenButton } from "@/style/baseComponent";
import { ILocale } from "@/types/common";
import InputRow from "@/components/Shared/InputRow";
import { lectureInputs } from "@/constants/lecture";
import axios from "axios";

type InputValue = Partial<
  Record<
    (typeof lectureInputs)[number][number]["id"],
    (typeof lectureInputs)[number][number]["type"]
  >
>;

const AddLectureForm = ({ locale }: { locale: ILocale }) => {
  const t = useTranslations("lecture");
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

  const onSubmit: SubmitHandler<InputValue> = async (data) => {
    const { data: lecture } = await axios.post("/api/lecture", data);
    setContent({});
    console.log(lecture);
  };

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
        {t("input.submit")}
      </button>
    </div>
  );
};

export default AddLectureForm;
