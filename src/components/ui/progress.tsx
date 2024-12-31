import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = ({ value }: ProgressPrimitive.ProgressProps) => {
  return (
    <>
      <small>Progress: {value}%</small>
    </>
  );
};

export { Progress };
