import React, { useEffect, useState } from "react";
import "./App.css";
import { Card } from "./components/Flashcard";

function App() {
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [future, setFuture] = useState<string | undefined>(undefined);
  const [futureShown, setFutureShown] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

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
        setAllCards(
          nodes.map((node) => ({
            title: node.title,
            content: node.content,
            link: node.url,
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const fetchRelatedCards = async (url: string) => {
    setLoading(true);
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

      // Add new cards to the existing ones without duplicates
      setAllCards((prevCards) => {
        const newCards = nodes.map((node) => ({
          title: node.title,
          content: node.content,
          link: node.url,
        }));
        
        // Filter out duplicates based on link property
        const existingLinks = new Set(prevCards.map(card => card.link));
        const uniqueNewCards = newCards.filter(card => !existingLinks.has(card.link));
        
        setHasOpened(true);
        return [...prevCards, ...uniqueNewCards];
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showFuture = () => {
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
        setFuture(data.future);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">NewsStitch</h1>
          {hasOpened && (
            <button
              className="bg-emerald-600 cursor-pointer rounded-lg py-1.5 px-6 text-white font-semibold"
              onClick={showFuture}
            >
              Glimpse into the future
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                <div className="flex justify-between p-4 bg-gray-50 border-t">
                  <a
                    href={card.link}
                    className="cursor-pointer bg-slate-400 rounded-lg py-1.5 px-6 text-white font-semibold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Article
                  </a>
                  <button
                    className="cursor-pointer bg-sky-500 rounded-lg py-1.5 px-6 text-white font-semibold flex items-center"
                    onClick={() => fetchRelatedCards(card.link)}
                  >
                    Related News
                    <span className="material-symbols-rounded ml-2">sync</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {futureShown && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          {future ? (
            <div className="bg-white p-6 rounded-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
              <div className="flex mb-4 items-center justify-between">
                <h1 className="font-semibold text-lg">A Glimpse into the Future...</h1>
                <button
                  className="h-10 w-8 flex items-center justify-center"
                  onClick={() => setFutureShown(false)}
                >
                  <span className="text-2xl material-symbols-rounded">close</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {future.split("\n").map((p, i) => (
                  <p key={i} className="mb-3 text-gray-700">{p}</p>
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