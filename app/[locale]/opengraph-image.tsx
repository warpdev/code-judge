import { ImageResponse } from "next/server";
import AppLogo from "@/components/AppLogo";
import { LogoIcon } from "@/components/Icons";
import { twJoin } from "tailwind-merge";
import OGDefault from "@/components/OgImage/OGDefault";

export const size = {
  width: 1200,
  height: 630,
};

const OpengraphImage = () => {
  return new ImageResponse(<OGDefault />, {
    ...size,
  });
};

export default OpengraphImage;
