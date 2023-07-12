import { getTranslator } from "next-intl/server";
import { twJoin } from "tailwind-merge";

const Home = async ({
  params,
}: {
  params: {
    locale: string;
  };
}) => {
  const t = await getTranslator(params.locale, "main");

  return (
    <div
      className={twJoin(
        "flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 p-24 md:min-h-[calc(100vh-5rem)]",
        "bg-neutral-200",
      )}
    >
      <h1 className="text-3xl font-black">{t("title")}</h1>
      <h2 className="text-2xl">{t("subTitle")}</h2>
    </div>
  );
};

export default Home;
