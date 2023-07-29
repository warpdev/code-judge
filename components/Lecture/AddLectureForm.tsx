"use client";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
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
import RelatedProblemSelector from "@/components/Lecture/RelatedProblemSelector";
import { Problem } from "@prisma/client";
import RelatedProblemCard from "@/components/Lecture/RelatedProblemCard";
import { X } from "lucide-react";
import { useRouter } from "next-intl/client";

type InputValue = Partial<
  Record<
    (typeof lectureInputs)[number][number]["id"],
    (typeof lectureInputs)[number][number]["type"]
  >
> & {
  relatedProblems?: Problem[];
};

const AddLectureForm = ({ locale }: { locale: ILocale }) => {
  const t = useTranslations("lecture");
  const {
    storedValue: content,
    setValue: setContent,
    rawGet,
  } = useStorage<InputValue>("add.lecture");
  const methods = useForm<InputValue>({
    defaultValues: async () => {
      return {
        locale,
        ...(((await rawGet()) as InputValue) ?? {}),
      } as InputValue;
    },
  });

  const { handleSubmit, watch, setValue } = methods;
  const router = useRouter();

  const currentRelatedProblems = watch("relatedProblems");

  const setDebouncedContent = useDebouncedCallback((value: any) => {
    setContent(value);
  }, 1500);

  useEffect(() => {
    watch(setDebouncedContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<InputValue> = async (data) => {
    const { data: lecture } = await axios.post("/api/lecture", {
      ...data,
      relatedProblems: data.relatedProblems?.map((problem) => problem.id),
    });
    setContent({});
    router.push(`/lectures/${lecture.id}`);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <FormProvider {...methods}>
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
                  inputProps={input}
                />
              ))}
            </div>
          );
        })}
        <div className={twJoin("flex flex-col gap-2 p-4")}>
          <label htmlFor="relatedProblems">{t("input.relatedProblems")}</label>
          <RelatedProblemSelector id="relatedProblems" />
          <ul className={twJoin("flex flex-wrap gap-4")}>
            {currentRelatedProblems?.map((problem) => (
              <li key={problem.id} className="group relative rounded-lg">
                <RelatedProblemCard problem={problem} />
                <button
                  className={twJoin(
                    "absolute inset-0 text-center opacity-0 backdrop-blur-sm",
                    "flex items-center justify-center rounded-lg",
                    "transition duration-300",
                    "group-hover:opacity-100",
                  )}
                  onClick={() => {
                    setValue(
                      "relatedProblems",
                      currentRelatedProblems.filter(
                        (currentProblem) => currentProblem.id !== problem.id,
                      ) as any,
                    );
                  }}
                >
                  <X className="h-6 w-6" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          className={twJoin(greenButton, "mt-16")}
        >
          {t("input.submit")}
        </button>
      </FormProvider>
    </div>
  );
};

export default AddLectureForm;
