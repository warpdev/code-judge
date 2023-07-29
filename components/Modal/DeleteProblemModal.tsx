"use client";
import { Problem } from "@prisma/client";
import BaseModal from "@/components/Modal/BaseModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { redButton } from "@/style/baseComponent";
import { useTranslations } from "next-intl";
import { twJoin } from "tailwind-merge";
import { actionOpacity, roundButton } from "@/style/baseStyle";

const DeleteProblemModal = ({
  onClose,
  problem,
}: {
  onClose: () => void;
  problem: Problem;
}) => {
  const router = useRouter();
  const t = useTranslations();
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/problem/${problem.id}`);
      toast.success(t("toast.deleteProblem.success"));
      router.replace("/problems");
    } catch (e) {
      toast.error(t("toast.deleteProblem.fail"));
    }
  };

  return (
    <BaseModal onClose={onClose} className="max-w-xl">
      <div className="flex flex-col gap-4">
        <h4 className="text-lg font-bold">{t("modal.deleteModal.title")}</h4>
        <p>{t("modal.deleteModal.content")}</p>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            className={twJoin(
              roundButton,
              "px-4 py-2",
              "bg-neutral-900 font-bold text-white",
              "dark:bg-neutral-800",
              actionOpacity,
            )}
            onClick={onClose}
          >
            {t("modal.deleteModal.cancel")}
          </button>
          <button className={redButton} onClick={handleDelete}>
            {t("modal.deleteModal.confirm")}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteProblemModal;
