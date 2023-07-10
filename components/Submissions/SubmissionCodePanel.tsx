import { getServerUser } from "@/utils/serverUtils";
import supabase from "@/lib/supabase";
import Accordion from "@/components/Accordions/Accordion";
import CodeEditor from "@/components/CodeEditor";
import { Prisma } from "@prisma/client";
import SubmissionGetPayload = Prisma.SubmissionGetPayload;

const SubmissionCodePanel = async ({
  submission,
}: {
  submission: SubmissionGetPayload<{
    include: {
      problem: true;
      language: true;
    };
  }>;
}) => {
  const userInfo = await getServerUser();
  const isMine = userInfo?.id === submission.userId;

  if (!isMine) {
    return <></>;
  }

  const { data } = await supabase.storage
    .from("usercodes")
    .download(`${userInfo.id}/${submission.problemId}/${submission.id}`);

  const code = await data?.text();

  return (
    <Accordion
      className="mt-8"
      contents={[
        {
          title: "Your Code",
          content: (
            <CodeEditor
              height={300}
              language={submission.language.monacoLanguage}
              value={code || ""}
              defaultValue={code || ""}
              options={{
                readOnly: true,
              }}
            />
          ),
        },
      ]}
    />
  );
};

export default SubmissionCodePanel;
