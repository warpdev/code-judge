import { getIsAdmin } from "@/utils/serverUtils";
import { redirect } from "next/navigation";

const EditTestcasePage = async ({
  params,
}: {
  params: {
    id: string;
    idx: number;
  };
}) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    redirect("/problems");
  }

  return <div>Test</div>;
};

export default EditTestcasePage;
