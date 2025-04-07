import React from "react";

export default function ScrollButton({
  icon,
  onClick,
}: {
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      className="w-16 h-12 rounded-xl flex items-center justify-center"
      onClick={onClick}
    >
      <span className="text-3xl material-symbols-rounded">{icon}</span>
    </button>
  );
}
