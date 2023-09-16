"use client";
import { BaseProps } from "@/types/common";

const TimeText = ({ time, className }: BaseProps & { time: Date }) => {
  return (
    <time dateTime={time.toISOString()} className={className}>
      {time.toLocaleString()}
    </time>
  );
};

export default TimeText;
