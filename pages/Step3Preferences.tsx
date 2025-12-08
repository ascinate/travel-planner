"use client";
import { useState } from "react";

export default function Step3Preferences({
  next
}) {
  const [budget, setBudget] = useState("");
  const [travelMode, setTravelMode] = useState("car");
  const [mealPreference, setMealPreference] = useState("");

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>

      {/* Budget */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Budget (₹)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter your estimated budget"
        />
      </div>

      {/* Travel Mode */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Preferred Travel Mode</label>
        <select
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="car">Car</option>
          <option value="flight">Flight</option>
          <option value="train">Train</option>
          <option value="bus">Bus</option>
        </select>
      </div>

      {/* Meal Preference */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Meal Preference</label>
        <input
          type="text"
          value={mealPreference}
          onChange={(e) => setMealPreference(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Veg / Non-Veg / Any"
        />
      </div>

      <button
        onClick={next}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Continue
      </button>
    </div>
  );
}
