import { getIsAdmin } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import TestcaseListPanel from "@/components/Problems/Testcase/TestcaseListPanel";
import { getProblemInfo } from "@/utils/dbUtils";

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

  const problems = await getProblemInfo(params.id);

  return <TestcaseListPanel initProblems={problems} />;
};

export default EditTestCasePage;
