import { redirect } from "next/navigation";
import TestcaseListPanel from "@/components/Problems/Testcase/TestcaseListPanel";
import { getProblemInfo } from "@/utils/dbUtils";
import { getIsMyProblem, getServerUser } from "@/utils/serverUtils";
import { headers } from "next/headers";

const EditTestCasePage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const header = headers();
  const user = await getServerUser();
  const nextUrl = "https://" + header.get("host") + "/profile";

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=" + encodeURIComponent(nextUrl));
  }

  const problems = await getProblemInfo(params.id);
  const isMine = getIsMyProblem(problems, user);

  if (!isMine) {
    redirect("/problems");
  }

  return <TestcaseListPanel initProblems={problems} />;
};

export default EditTestCasePage;
