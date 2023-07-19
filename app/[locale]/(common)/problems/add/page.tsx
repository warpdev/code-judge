import { getServerUser } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import AddProblemForm from "@/components/Problems/AddProblem/AddProblemForm";
import { ILocale } from "@/types/common";

const AddProblemPage = async ({
  params,
}: {
  params: {
    locale: ILocale;
  };
}) => {
  const user = await getServerUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <AddProblemForm locale={params.locale} />;
};

export default AddProblemPage;
