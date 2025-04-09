import React from "react";

export type Card = {
  title: string;
  content: string;
  link: string;
};

export default function Flashcard({
  card,
  onMouseEnter,
}: {
  card: Card;
  onMouseEnter: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" onMouseEnter={onMouseEnter}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">{card.title}</h2>
        <div className="relative overflow-hidden" style={{ maxHeight: "200px" }}>
          <div>
            {card.content.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-2 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-transparent to-white"></div>
        </div>
      </div>
      <div className="flex justify-center p-4 bg-gray-50 border-t">
        <a
          href={card.link}
          className="cursor-pointer bg-slate-400 rounded-lg py-1.5 px-6 text-white font-semibold"
          target="_blank"
          rel="noreferrer"
        >
          View Article
        </a>
      </div>
    </div>
  );
}