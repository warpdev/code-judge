"use client";
import BaseModal from "@/components/Modal/BaseModal";
import { Problem } from "@prisma/client";
import useSWRImmutable from "swr/immutable";
import { twJoin, twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  actionBorderNeutral,
  actionNeutral,
  actionOpacity,
  actionToDark,
  actionToLight,
  baseInput,
  miniLabel,
  roundButton,
} from "@/style/baseStyle";
import axios from "axios";
import { useSWRConfig } from "swr";
import { useTranslations } from "next-intl";
import { PlayCircle } from "lucide-react";

const inputStyle = twJoin(baseInput, "h-40");

interface ITestCase {
  input: string;
  output: string;
}

const EditTestcaseModal = ({
  onClose: handleClose,
  problem,
  caseNumber,
  isNew,
}: {
  onClose: () => void;
  problem: Problem;
  caseNumber: number;
  isNew?: boolean;
}) => {
  const t = useTranslations("testcase");
  const { data, isLoading, mutate } = useSWRImmutable<ITestCase>(
    !isNew && `/api/problem/${problem.id}/testcase?idx=${caseNumber}`,
  );

  const { mutate: mutateProblem } = useSWRConfig();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ITestCase>();

  useEffect(() => {
    if (!isNew && data && setValue) {
      setValue("input", data.input);
      setValue("output", data.output);
    }
  }, [data, isNew, setValue]);

  const submitData = async (data: ITestCase) => {
    await axios.post(`/api/problem/${problem.id}/testcase`, {
      idx: isNew ? undefined : caseNumber,
      input: data.input,
      output: data.output,
    });
    mutate(data, {
      revalidate: false,
    });
    mutateProblem(`/api/problem/${problem.id}`);
    handleClose();
  };

  //TODO: merge gpt + run
  const handleRun = async () => {
    const { data } = await axios.post(
      `/api/problem/${problem.id}/testcase/auto`,
    );
    setValue("output", data.output);
    setValue("input", data.input);
  };

  return (
    <BaseModal onClose={handleClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitData)}>
        <div className={twJoin("flex w-full flex-col gap-4", "md:flex-row")}>
          <div className={twJoin("flex flex-col gap-2", "w-full", "md:w-1/2")}>
            <label
              className={twMerge(miniLabel, "text-lg")}
              htmlFor={`input-case-${caseNumber}`}
            >
              {t("input")}
            </label>
            <textarea
              disabled={isLoading}
              className={twJoin(
                inputStyle,
                isLoading && "animate-pulse bg-neutral-300 dark:bg-neutral-300",
              )}
              id={`input-case-${caseNumber}`}
              {...register("input")}
            />
          </div>
          <button
            type="button"
            className={twMerge(
              roundButton,
              "bg-neutral-200 p-2 dark:bg-neutral-800",
              actionBorderNeutral,
              "self-center",
            )}
            onClick={handleRun}
          >
            <PlayCircle className="h-6 w-6" />
          </button>
          <div className={twJoin("flex flex-col gap-2", "w-full", "md:w-1/2")}>
            <label
              className={twMerge(miniLabel, "text-lg")}
              htmlFor={`output-case-${caseNumber}`}
            >
              {t("output")}
            </label>
            <textarea
              disabled={isLoading}
              className={twJoin(
                inputStyle,
                isLoading && "animate-pulse bg-neutral-300 dark:bg-neutral-300",
              )}
              id={`output-case-${caseNumber}`}
              {...register("output")}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button
            type="button"
            className={twJoin(
              roundButton,
              "px-4 py-2",
              "bg-neutral-900 font-bold text-white",
              "dark:bg-neutral-800",
              actionOpacity,
            )}
            onClick={handleClose}
          >
            {t("cancel")}
          </button>
          <button
            className={twJoin(
              roundButton,
              "px-4 py-2",
              "bg-violet-500 font-bold text-white",
              actionToDark,
            )}
          >
            {t("save")}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditTestcaseModal;
