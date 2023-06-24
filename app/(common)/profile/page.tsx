import { getServerUser } from "@/utils/serverUtils";
import { twJoin } from "tailwind-merge";
import { title } from "@/style/baseStyle";
import { redirect } from "next/navigation";
import Image from "next/image";
import SubmissionsListPanel from "@/components/Submissions/SubmissionsListPanel";
import prisma from "@/lib/prisma";
import SignOutButton from "@/components/Auth/SignOutButton";

const UserProfilePage = async () => {
  const user = await getServerUser();

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=" + window.location.href);
  }

  const submissions = await prisma.submission.findMany({
    where: {
      userId: user.id,
    },
    include: {
      problem: true,
      user: true,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className={twJoin(title, "mb-4")}>{user.name}</h1>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
      {user.image && (
        <Image
          className="rounded-full"
          src={user.image}
          unoptimized
          alt="user image"
          width={250}
          height={250}
        />
      )}
      <h2 className={twJoin(title, "mt-8")}>My Submissions</h2>
      <SubmissionsListPanel submissions={submissions} />
      <div className="flex justify-end">
        <SignOutButton
          className="border-2 border-neutral-400"
          callbackUrl="/"
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
