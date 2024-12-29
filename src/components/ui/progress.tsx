import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = ({ value, className }: ProgressPrimitive.ProgressProps) => {
  return (
    <>
      <small>Progress: {value}%</small>
    </>
  );
};

export { Progress };
