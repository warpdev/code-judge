import { title } from "@/style/baseStyle";
import SubmissionsListPanel from "@/components/Submissions/SubmissionsListPanel";
import prisma from "@/lib/prisma";

const SubmissionsPage = async () => {
  const allSubmissions = await prisma.submission.findMany({
    include: {
      user: true,
      problem: true,
      language: true,
    },
  });

  return (
    <div>
      <h1 className={title}>Submissions</h1>
      <SubmissionsListPanel submissions={allSubmissions} />
    </div>
  );
};

export default SubmissionsPage;
