import React, { JSX, useCallback, useState } from "react";
import ScrollButton from "./ScrollButton.tsx";

export default function Scroll({
  scrollAmount,
  children,
}: {
  scrollAmount: number;
  children: JSX.Element[];
}) {
  return (
    <div className="flex flex-col justify-center items-center h-full overflow-hidden gap-10">
      <div
        className="w-card h-card relative transition-transform duration-300"
        style={{ transform: `translateY(-${scrollAmount * 40}rem)` }}
      >
        {children.map((child, i) => (
          <div className="absolute left-0" style={{ top: `${i * 40}rem` }}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
