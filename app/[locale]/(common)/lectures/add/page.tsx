import { getServerUser } from "@/utils/serverUtils";
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
  const user = await getServerUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <AddLectureForm locale={params.locale} />;
};

export default AddLecturePage;
