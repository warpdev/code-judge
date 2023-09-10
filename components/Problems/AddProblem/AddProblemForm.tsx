"use client";
import { ILocale } from "@/types/common";
import { z } from "zod";
import { ProblemSchema } from "@/types/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/Shared/TextInput";
import { useTranslations } from "next-intl";
import { Problem } from "@prisma/client";
import { twJoin } from "tailwind-merge";
import SelectInput from "@/components/Shared/SelectInput";
import EditorInput from "@/components/Shared/EditorInput";
import TextareaInput from "@/components/Shared/TextareaInput";
import { greenButton } from "@/style/baseComponent";
import { useEffect, useMemo } from "react";
import { LOCALES } from "@/constants/common";
import useStorage from "@/utils/hooks/useStorage";
import { useDebouncedCallback } from "use-debounce";
import { api } from "@/lib/apiClient";
import { useRouter } from "next-intl/client";

const InputSchema = ProblemSchema.extend({
  memoryLimit: z.coerce.number().min(2).max(512),
  timeLimit: z.coerce
    .number()
    .min(0.01)
    .max(5)
    .refine((v) => v * 1000),
});

type IInput = z.infer<typeof InputSchema>;

const rowStyle = twJoin(
  "grid gap-4 md:auto-cols-fr md:grid-flow-col",
  "grid-flow-row",
);

const AddProblemForm = ({
  locale,
  initProblem,
}: {
  locale: ILocale;
  initProblem?: Problem;
}) => {
  const t = useTranslations("problem.input");
  const {
    storedValue: content,
    setValue: setContent,
    rawGet,
  } = useStorage<IInput>("add.problem");
  const router = useRouter();

  const { control, register, handleSubmit, watch, getValues } = useForm<IInput>(
    {
      defaultValues: async () => {
        if (initProblem) {
          return {
            ...initProblem,
            locale: LOCALES[initProblem.locale],
            timeLimit: initProblem.timeLimit / 1000,
          } as IInput;
        } else {
          return {
            locale,
            ...(((await rawGet()) as any) ?? {}),
          } as IInput;
        }
      },
      resolver: zodResolver(InputSchema),
    },
  );

  const setDebouncedContent = useDebouncedCallback((value: any) => {
    if (initProblem) {
      return;
    }
    setContent(value);
  }, 1500);

  useEffect(() => {
    watch(setDebouncedContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async () => {
    const data = getValues();
    const { data: problem } = await api.post(
      initProblem ? `/problem/${initProblem.id}` : "/problem",
      data,
    );
    if (!initProblem) {
      setContent({} as any);
    }
    router.push(`/problems/${problem.id}`);
  };

  return (
    <form className="flex flex-col gap-8">
      <div className={rowStyle}>
        <TextInput id="title" {...register("title")} label={t("title")} />
        <SelectInput
          id="locale"
          {...register("locale")}
          label={t("locale.label")}
        >
          <option value="ko">{t("locale.options.ko")}</option>
          <option value="en">{t("locale.options.en")}</option>
        </SelectInput>
      </div>
      <div className={rowStyle}>
        <TextInput
          id="timeLimit"
          {...register("timeLimit")}
          label={t("timeLimit.label")}
          placeholder={t("timeLimit.placeholder")}
        />
        <TextInput
          id="memoryLimit"
          {...register("memoryLimit")}
          label={t("memoryLimit.label")}
          placeholder={t("memoryLimit.placeholder")}
        />
      </div>
      <EditorInput
        id="description"
        control={control}
        label={t("description")}
      />
      <EditorInput
        id="inputFormat"
        control={control}
        label={t("inputFormat")}
      />
      <EditorInput
        id="outputFormat"
        control={control}
        label={t("outputFormat")}
      />
      <div className={rowStyle}>
        <TextareaInput
          id="sampleInput"
          {...register("sampleInput")}
          label={t("sampleInput")}
        />
        <TextareaInput
          id="sampleOutput"
          {...register("sampleOutput")}
          label={t("sampleOutput")}
        />
      </div>
      <div className="flex items-center justify-end">
        <button
          type="button"
          className={twJoin(greenButton)}
          onClick={onSubmit}
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
};

export default AddProblemForm;
