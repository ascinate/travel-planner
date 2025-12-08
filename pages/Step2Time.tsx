"use client";
import { useState } from "react";

export default function Step2Time({
  next
}) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Select Your Time</h2>

      {/* Start Time */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Start Time</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* End Time */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">End Time</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full px-3 py-2 border rounded"
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
