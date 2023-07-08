import { getIsAdmin } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import AddProblemForm from "@/components/Problems/AddProblem/AddProblemForm";

const AddProblemPage = async () => {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) {
    redirect("/api/auth/signin");
  }

  return <AddProblemForm />;
};

export default AddProblemPage;
