import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className={cn("skeleton-shimmer rounded-md", className)} {...props} />
  );
}

export { Skeleton };
