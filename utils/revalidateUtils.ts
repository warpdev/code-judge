import { revalidatePath } from "next/cache";

export const revalidateProblems = () => {
  revalidatePath("/[locale]/(common)/problems");
  revalidatePath("/[locale]/(common)/problems/[id]");
};

export const revalidateSubmissions = () => {
  revalidatePath("/submissions");
  revalidatePath("/profile");
};

export const revalidateProblem = (id: string) => {
  revalidatePath(`/problem/${id}`);
};

export const revalidateSubmission = (id: string) => {
  revalidatePath(`/submission/${id}`);
};
