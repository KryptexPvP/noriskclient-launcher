"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";

interface LaunchProgressBarProps {
  /** Progress of the current launch step (0–1). Anything outside (0, 1) shows the indeterminate state. */
  progress: number | null;
  className?: string;
}

/**
 * Thin progress bar for the Play button. The backend reports progress per
 * launch step, so the bar fills up for long steps (assets, libraries, mods)
 * and shows a sliding segment for steps that only report start and end.
 */
export function LaunchProgressBar({ progress, className }: LaunchProgressBarProps) {
  const { t } = useTranslation();
  const previous = useRef(0);

  const determinate = progress !== null && progress > 0 && progress < 1;
  const value = determinate ? progress : 0;
  // A new step starts lower than the last one ended: jump back instead of animating backwards.
  const animate = value >= previous.current;
  previous.current = value;

  return (
    <div
      role="progressbar"
      aria-label={t("launch.progress_label")}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={determinate ? Math.round(value * 100) : undefined}
      className={cn("h-[3px] overflow-hidden rounded-full bg-black/30", className)}
    >
      {determinate ? (
        <div
          className={cn("h-full rounded-full bg-white/90", animate && "transition-[width] duration-300 ease-out")}
          style={{ width: `${value * 100}%` }}
        />
      ) : (
        <div className="h-full w-[30%] rounded-full bg-white/70 animate-progress-indeterminate motion-reduce:animate-none motion-reduce:w-full motion-reduce:bg-white/40" />
      )}
    </div>
  );
}
