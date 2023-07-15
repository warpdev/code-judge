"use client";
import { BaseProps } from "@/types/common";

const TimeText = ({ time, className }: BaseProps & { time: Date }) => {
  return <span className={className}>{time.toLocaleString()}</span>;
};

export default TimeText;
