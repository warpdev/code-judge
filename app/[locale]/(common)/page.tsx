import HeroSection from "@/components/Home/HeroSection";

const Home = async ({
  params,
}: {
  params: {
    locale: string;
  };
}) => {
  return (
    <div>
      <HeroSection locale={params.locale} />
    </div>
  );
};

export default Home;
