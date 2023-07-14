import { Problem } from "@prisma/client";
import BaseModal from "@/components/Modal/BaseModal";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { redButton } from "@/style/baseComponent";

const DeleteProblemModal = ({
  onClose,
  problem,
}: {
  onClose: () => void;
  problem: Problem;
}) => {
  const router = useRouter();
  const handleDelete = async () => {
    await axios.delete(`/api/problem/${problem.id}`);
    toast("Problem deleted");
    router.replace("/problems");
  };

  return (
    <BaseModal onClose={onClose}>
      <div>
        <h4>Delete?</h4>
        <p>Are you sure you want to delete this problem?</p>
        <button className={redButton} onClick={handleDelete}>
          Delete Problem
        </button>
      </div>
    </BaseModal>
  );
};

export default DeleteProblemModal;
