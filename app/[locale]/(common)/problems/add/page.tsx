import { getServerUser } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import AddProblemForm from "@/components/Problems/AddProblem/AddProblemForm";

const AddProblemPage = async () => {
  const user = await getServerUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <AddProblemForm />;
};

export default AddProblemPage;
