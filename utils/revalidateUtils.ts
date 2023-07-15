import { revalidatePath } from "next/cache";

export const revalidateProblems = () => {
  revalidatePath("/problems");
  revalidatePath("/my-problems");
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
