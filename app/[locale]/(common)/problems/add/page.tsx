import { getServerUser } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import { ILocale } from "@/types/common";
import AddProblemForm from "@/components/Problems/AddProblem/AddProblemForm";

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
