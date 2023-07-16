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
import ProfileDashboard from "@/components/Profile/ProfileDashboard";

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

  return (
    <div className="flex flex-col gap-4">
      <div
        className={twJoin(
          "flex flex-col md:flex-row md:items-center",
          "gap-4 md:gap-8",
        )}
      >
        <span className="flex items-center gap-2">
          {user.image && (
            <Image
              className="rounded-full"
              src={user.image}
              unoptimized
              alt="user image"
              width={40}
              height={40}
            />
          )}
          <h1 className={twJoin(title)}>{user.name}</h1>
        </span>
        <span className="text-sm text-neutral-400 dark:text-neutral-500">
          {user.email}
        </span>
      </div>
      <ProfileDashboard />
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
