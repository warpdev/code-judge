import { redirect } from "next/navigation";
import TestcaseListPanel from "@/components/Problems/Testcase/TestcaseListPanel";
import { getProblemInfo } from "@/utils/dbUtils";
import { getIsMyProblem, getServerUser } from "@/utils/serverUtils";

const EditTestCasePage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const user = await getServerUser();

  if (!user) {
    redirect("/api/auth/signin");
  }

  const problems = await getProblemInfo(params.id);
  const isMine = getIsMyProblem(problems, user);

  if (!isMine) {
    redirect("/problems");
  }

  return <TestcaseListPanel initProblems={problems} />;
};

export default EditTestCasePage;
