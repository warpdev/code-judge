"use client";
import BaseModal from "@/components/Modal/BaseModal";
import { Problem } from "@prisma/client";
import useSWRImmutable from "swr/immutable";
import { twJoin, twMerge } from "tailwind-merge";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  actionNeutral,
  actionOpacity,
  actionToDark,
  baseInput,
  miniLabel,
  roundButton,
} from "@/style/baseStyle";
import axios from "axios";
import { useSWRConfig } from "swr";
import { useTranslations } from "next-intl";

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

  return (
    <BaseModal onClose={handleClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(submitData)}>
        <ul className={twJoin("flex w-full flex-col gap-4", "md:flex-row")}>
          <li className={twJoin("flex flex-col gap-2", "w-full", "md:w-1/2")}>
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
          </li>
          <li className={twJoin("flex flex-col gap-2", "w-full", "md:w-1/2")}>
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
          </li>
        </ul>
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
