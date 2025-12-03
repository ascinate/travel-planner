import { useEffect, useState } from "react";

export default function ResultPage() {
  const [tripData, setTripData] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tripResult");
    if (saved) setTripData(saved);
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Itinerary</h1>

      {!tripData ? (
        <p>No data found. Please generate your itinerary again.</p>
      ) : (
        <div className="whitespace-pre-line bg-gray-100 p-6 rounded-lg">
          {tripData}
        </div>
      )}
    </div>
  );
}
