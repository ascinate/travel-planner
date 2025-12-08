"use client";
import { useState } from "react";

export default function Step4Interests({
result
}) {
  const [interests, setInterests] = useState<string[]>([]);

  const items = [
    "Nature",
    "Historical Places",
    "Adventure",
    "Shopping",
    "Food & Restaurants",
    "Beaches",
    "Photography",
    "Culture",
  ];

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Select Your Interests</h2>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => toggleInterest(item)}
            className={`px-3 py-2 border rounded text-sm transition ${
              interests.includes(item)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Display selected interests */}
      <div className="mt-4">
        <h3 className="font-medium mb-1">Selected:</h3>
        {interests.length > 0 ? (
          <p className="text-gray-700">{interests.join(", ")}</p>
        ) : (
          <p className="text-gray-500 text-sm">No interests selected yet.</p>
        )}
      </div>
      <button
        onClick={result}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Continue
      </button>
    </div>
  );
}
