import { getIsAdmin, getServerUser } from "@/utils/serverUtils";
import { redirect } from "next/navigation";
import { ILocale } from "@/types/common";
import AddLectureForm from "@/components/Lecture/AddLectureForm";

const AddLecturePage = async ({
  params,
}: {
  params: {
    locale: ILocale;
  };
}) => {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) redirect("/");

  return <AddLectureForm locale={params.locale} />;
};

export default AddLecturePage;
