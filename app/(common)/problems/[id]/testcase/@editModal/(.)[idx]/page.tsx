import { getIsAdmin } from "@/utils/serverUtils";
import { redirect } from "next/navigation";

const EditTestcaseModalPage = async ({
  params,
}: {
  params: {
    id: string;
    idx: string;
  };
}) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    redirect("/problems");
  }
};

export default EditTestcaseModalPage;
