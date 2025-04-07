import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Flashcard, { Card } from "./components/Flashcard.tsx";
import Scroll from "./components/Scroll.tsx";
import ScrollButton from "./components/ScrollButton.tsx";

function App() {
  const [scrollAmounts, setScrollAmounts] = useState<number[]>([0]);
  const [scrolls, setScrolls] = useState<Card[][]>([[]]);
  const [currentScroll, setCurrentScroll] = useState(0);

  const [loading, setLoading] = useState(true);

  const colors = ["#FCE4EC", "#FFF9C4", "#D0EBFF", "#D8F3DC", "#FFD8B1"];

  useEffect(() => {
    setLoading(true);
    const endpoint = `http://localhost:5000/api/start`;

    fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        return response.json();
      })
      .then((data) => {
        const nodes = data.nodes;
        setScrolls([
          nodes.map((node) => ({
            title: node.title,
            content: node.content,
            link: node.url,
          })),
        ]);
        setScrollAmounts([0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const finalScrollAmount = useMemo(
    () => scrollAmounts[currentScroll],
    [scrollAmounts, currentScroll]
  );

  const finalCards = useMemo(
    () => scrolls[currentScroll] ?? [],
    [scrolls, currentScroll]
  );

  const atTop = useMemo(() => finalScrollAmount === 0, [finalScrollAmount]);

  const atBottom = useMemo(
    () => finalScrollAmount === finalCards.length - 1,
    [finalScrollAmount, finalCards]
  );

  const atStart = useMemo(() => currentScroll === 0, [currentScroll]);

  const [cached, setCached] = useState(false);

  const scrollUp = useCallback(() => {
    setScrollAmounts((prev) => {
      const next = [...prev];
      next[currentScroll] = Math.max(next[currentScroll] - 1, 0);
      next.splice(currentScroll + 1);
      return next;
    });
    if (currentScroll < scrolls.length - 1) {
      setScrolls((prev) => {
        const next = [...prev];
        next.splice(currentScroll + 1);
        return next;
      });
      setCached(false);
    }
  }, [currentScroll, scrolls.length]);

  const scrollDown = useCallback(() => {
    setScrollAmounts((prev) => {
      const next = [...prev];
      next[currentScroll] = Math.min(
        next[currentScroll] + 1,
        finalCards.length - 1
      );
      next.splice(currentScroll + 1);
      return next;
    });
    if (currentScroll < scrolls.length - 1) {
      setScrolls((prev) => {
        const next = [...prev];
        next.splice(currentScroll + 1);
        return next;
      });
      setCached(false);
    }
  }, [currentScroll, finalCards.length, scrolls.length]);

  const scrollLeft = useCallback(() => {
    setCurrentScroll((prev) => Math.max(prev - 1, 0));
    setCached(true);
  }, []);

  const scrollRight = useCallback(
    async (url: string) => {
      if (cached) {
        setCurrentScroll((prev) => prev + 1);
        return;
      }

      const encodedUrl = encodeURIComponent(url);
      const endpoint = `http://localhost:5000/api/prevents?url=${encodedUrl}`;

      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();
        const nodes = data.nodes;

        setFuture(undefined);
        setHasOpened(true);

        setScrolls((prev) => {
          const next = [...prev];
          next.push(
            nodes.map((node) => ({
              title: node.title,
              content: node.content,
              link: node.url,
            }))
          );
          return next;
        });

        setScrollAmounts((prev) => {
          const next = [...prev];
          next.push(0);
          return next;
        });

        setCurrentScroll((prev) => prev + 1);
      } catch (error) {
        console.error(error);
      }
    },
    [cached]
  );

  const [future, setFuture] = useState<string | undefined>(undefined);
  const [futureShown, setFutureShown] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const showFuture = useCallback(() => {
    setFutureShown(true);
    if (future !== undefined) {
      return;
    }
    const endpoint = "http://localhost:5000/api/explore-future";

    fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        setFuture(data.future);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [future]);

  return (
    <div
      className="relative h-full transition-colors duration-1000 ease-in-out"
      style={{
        backgroundColor: colors[currentScroll % colors.length],
      }}
    >
      <div className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center gap-8">
        <div className="z-10 h-12">
          {!atTop && (
            <ScrollButton icon="keyboard_arrow_up" onClick={scrollUp} />
          )}
        </div>
        <div className="h-card"></div>
        <div className="z-10 h-12">
          {!atBottom && (
            <ScrollButton icon="keyboard_arrow_down" onClick={scrollDown} />
          )}
        </div>
      </div>
      <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center pr-64">
        <div className="z-10">
          {!atStart && (
            <ScrollButton icon="keyboard_arrow_left" onClick={scrollLeft} />
          )}
        </div>
        <div className="w-card"></div>
      </div>
      <div className="flex justify-center absolute top-0 w-full h-full">
        <div
          className="transition-transform duration-300 w-card"
          style={{
            transform: `translateX(-${currentScroll * 60}rem)`,
          }}
        >
          {scrolls.map((cards, i) => (
            <div
              className="absolute top-0 h-full"
              style={{
                left: `${i * 60}rem`,
              }}
              key={i}
            >
              <Scroll scrollAmount={scrollAmounts[i]}>
                {cards.map((card, j) => (
                  <Flashcard card={card} key={j} scrollRight={scrollRight} />
                ))}
              </Scroll>
            </div>
          ))}
        </div>
      </div>
      {hasOpened && (
        <button
          className="absolute right-8 top-8 bg-emerald-600 cursor-pointer rounded-lg py-1.5 px-6 text-white font-semibold"
          onClick={showFuture}
        >
          Glimpse into the future
        </button>
      )}
      {futureShown && (
        <div className="absolute w-full h-full bg-black/15 flex items-center justify-center">
          {future ? (
            <div className="bg-white p-4 pb-8 rounded-xl w-card h-card flex flex-col">
              <div className="flex mb-5 items-center justify-between">
                <h1 className="font-semibold text-lg ml-4">
                  A Glimpse into the Future...
                </h1>
                <button
                  className="h-10 w-8"
                  onClick={() => setFutureShown(false)}
                >
                  <span className="text-2xl material-symbols-rounded">
                    close
                  </span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {future.split("\n").map((p) => (
                  <p className="mb-2 px-4">{p}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="loader"></div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
