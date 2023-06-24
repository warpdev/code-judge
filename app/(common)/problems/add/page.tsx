import { getServerUser } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import AddProblemForm from "@/components/AddProblem/AddProblemForm";

const AddProblemPage = async () => {
  const user = await getServerUser();

  if (!user || user.role !== "admin") {
    redirect("/api/auth/signin");
  }

  return <AddProblemForm />;
};

export default AddProblemPage;
