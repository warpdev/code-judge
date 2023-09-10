import { pageWithOptions } from "@/utils/serverUtils";
import { ProblemPageParamsSchema } from "@/types/schema";
import { serverGetProblemInfo } from "@/utils/dbUtils";
import { notFound } from "next/navigation";
import AddProblemForm from "@/components/Problems/AddProblem/AddProblemForm";
import { LOCALES } from "@/constants/common";

const EditProblemPage = pageWithOptions({
  withAuth: true,
  paramsSchema: ProblemPageParamsSchema,
})(async ({ user, params: { id }, locale }) => {
  const problemInfo = await serverGetProblemInfo(id);
  if (!problemInfo) {
    return notFound();
  }

  return <AddProblemForm locale={locale} initProblem={problemInfo} />;
});

export default EditProblemPage;
