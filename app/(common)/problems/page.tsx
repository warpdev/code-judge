import prisma from "@/lib/prisma";
import ProblemsList from "@/components/Problems/ProblemsList";
import { title } from "@/style/baseStyle";
import AddProblemButton from "@/components/Problems/AddProblemButton";

const ProblemListPage = async ({
  searchParams,
}: {
  searchParams: {
    page?: string;
  };
}) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page) - 1 : 0;
  const problems = await prisma.problem.findMany({
    take: 10,
  });

  return (
    <div>
      <h1 className={title}>All Problems</h1>
      <ProblemsList initIndex={currentPage} />
      <div className="mt-4 flex justify-end">
        <AddProblemButton />
      </div>
    </div>
  );
};

export default ProblemListPage;
