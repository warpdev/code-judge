import { getIsAdmin } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import TestcaseListPanel from "@/components/Problems/Testcase/TestcaseListPanel";

const EditTestCasePage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    redirect("/problems");
  }

  return <TestcaseListPanel problemId={params.id} />;
};

export default EditTestCasePage;
