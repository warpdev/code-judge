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
import { getErrorData } from "@/utils/errorMap";

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
  const errorT = useTranslations("error");
  const t = useTranslations("problem.input");
  const {
    storedValue: content,
    setValue: setContent,
    rawGet,
  } = useStorage<IInput>("add.problem");
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IInput>({
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
    resolver: zodResolver(InputSchema, {
      errorMap: (issue, _ctx) => {
        const errorData = getErrorData(issue);
        if (errorData) {
          return {
            message: errorT(errorData.key, {
              ...errorData.data,
              label: t(`${issue.path.join(".")}.label` as any),
            }),
          };
        } else {
          return { message: _ctx.defaultError };
        }
      },
    }),
  });

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
        <TextInput
          id="title"
          {...register("title")}
          label={t("title.label")}
          error={errors.title?.message}
        />
        <SelectInput
          id="locale"
          {...register("locale")}
          label={t("locale.label")}
          error={errors.locale?.message}
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
          error={errors.timeLimit?.message}
        />
        <TextInput
          id="memoryLimit"
          {...register("memoryLimit")}
          label={t("memoryLimit.label")}
          placeholder={t("memoryLimit.placeholder")}
          error={errors.memoryLimit?.message}
        />
      </div>
      <EditorInput
        id="description"
        control={control}
        label={t("description.label")}
      />
      <EditorInput
        id="inputFormat"
        control={control}
        label={t("inputFormat.label")}
      />
      <EditorInput
        id="outputFormat"
        control={control}
        label={t("outputFormat.label")}
      />
      <div className={rowStyle}>
        <TextareaInput
          id="sampleInput"
          {...register("sampleInput")}
          label={t("sampleInput.label")}
          error={errors.sampleInput?.message}
        />
        <TextareaInput
          id="sampleOutput"
          {...register("sampleOutput")}
          label={t("sampleOutput.label")}
          error={errors.sampleOutput?.message}
        />
      </div>
      <div className="flex items-center justify-end">
        <button
          type="button"
          className={twJoin(greenButton)}
          onClick={handleSubmit(onSubmit)}
        >
          {t("submit")}
        </button>
      </div>
    </form>
  );
};

export default AddProblemForm;
