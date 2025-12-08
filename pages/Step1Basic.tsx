export default function Step1Basic({
  destination,
  setDestination,
  travelPersona,
  setTravelPersona,
  foodPersona,
  setFoodPersona,
  next,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Basic Trip </h2>

      <input
        className="border w-full p-2 rounded"
        placeholder="Destination..."
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <select
        className="border w-full p-2 rounded"
        value={travelPersona}
        onChange={(e) => setTravelPersona(e.target.value)}
      >
        <option>Solo</option>
        <option>Couple</option>
        <option>Family-Friendly</option>
        <option>Luxury Traveler</option>
      </select>

      <select
        className="border w-full p-2 rounded"
        value={foodPersona}
        onChange={(e) => setFoodPersona(e.target.value)}
      >
        <option>Vegan</option>
        <option>Vegetarian</option>
        <option>Meat Lover</option>
      </select>

      <button
        onClick={next}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Continue
      </button>
    </div>
  );
}
