import { getServerUser } from "@/utils/serverUtils";
import supabase from "@/lib/supabase";
import Accordion from "@/components/Accordions/Accordion";
import CodeEditor from "@/components/CodeEditor";
import { getTranslator } from "next-intl/server";
import { IAllDetailedSubmissions } from "@/types/dbTypes";
import SetToAnswerButton from "@/components/Submissions/SetToAnswerButton";

const SubmissionCodePanel = async ({
  submission,
  locale,
}: {
  submission: IAllDetailedSubmissions;
  locale: string;
}) => {
  const userInfo = await getServerUser();
  const t = await getTranslator(locale, "submission");
  const isMine = userInfo?.id === submission.userId;

  if (!isMine) {
    return <></>;
  }

  const { data } = await supabase.storage
    .from("usercodes")
    .download(`${userInfo.id}/${submission.problemId}/${submission.id}`);

  const code = await data?.text();

  return (
    <div className="mt-8 flex flex-col gap-4">
      <Accordion
        contents={[
          {
            title: t("yourCode"),
            content: (
              <CodeEditor
                height={300}
                theme="vs-dark"
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
      {code && <SetToAnswerButton submission={submission} />}
    </div>
  );
};

export default SubmissionCodePanel;
