import Link from "next/link";
import { twJoin } from "tailwind-merge";
import { actionToDark, roundButton } from "@/style/baseStyle";

const AddProblemButton = () => {
  return (
    <Link
      href={"/problems/add"}
      className={twJoin(roundButton, "bg-purple-300 font-bold", actionToDark)}
    >
      Add Problem
    </Link>
  );
};

export default AddProblemButton;
