import { getServerUser } from "@/utils/serverUtils";
import { twJoin } from "tailwind-merge";
import { title } from "@/style/baseStyle";
import { redirect } from "next/navigation";
import Image from "next/image";
import SubmissionsListPanel from "@/components/Submissions/SubmissionsListPanel";
import SignOutButton from "@/components/Auth/SignOutButton";
import { getTranslator } from "next-intl/server";
import { headers } from "next/headers";
import { getAllSubmissions } from "@/utils/dbUtils";
import Navigator from "@/components/Navigator";

const UserProfilePage = async ({
  searchParams,
  params: { locale },
}: {
  searchParams: {
    page?: string;
    locale?: string;
  };
  params: { locale: string };
}) => {
  const currentPage =
    searchParams.page && +searchParams.page > 0 ? +searchParams.page : 1;
  const t = await getTranslator(locale, "profile");
  const user = await getServerUser();
  const header = headers();

  const nextUrl = "https://" + header.get("host") + "/profile";

  if (!user) {
    redirect("/api/auth/signin?callbackUrl=" + encodeURIComponent(nextUrl));
  }

  const submissions = await getAllSubmissions({
    pageIndex: currentPage,
    onlyMy: true,
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
      <h2 className={twJoin(title, "mt-8")}>{t("mySubmissions")}</h2>
      <SubmissionsListPanel submissions={submissions} locale={locale} />
      <Navigator />
      <div className="flex justify-end">
        <SignOutButton
          locale={locale}
          className="border-2 border-neutral-400"
          callbackUrl="/"
        />
      </div>
    </div>
  );
};

export default UserProfilePage;
