import supabase from "@/lib/supabase";
import { getServerUser } from "@/utils/serverUtils";

export const getUserCode = async (
  userId: string,
  problemId: string,
  submitId: string
) => {
  const user = await getServerUser();
  const { data, error } = await supabase.storage
    .from("usercodes")
    .download(`${userId}/${problemId}/${submitId}`);

  const code = await data?.text();

  if (error) {
    throw error;
  }
  return code;
};
