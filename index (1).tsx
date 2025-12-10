"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import {
  saveTripRequest,
  logEvent,
  saveItinerary,
  saveUserProfile,
} from "@/lib/firestore";

import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import type { User } from "firebase/auth";

const tripMoodOptions = [
  "Romance",
  "Spiritual",
  "Nature",
  "Party",
  "Photography",
  "Local Culture",
];

export default function TravelPlanner() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Core form state
  const [destination, setDestination] = useState("");
  const [travelPersona, setTravelPersona] = useState("Solo Traveller");
  const [foodPersona, setFoodPersona] = useState("Vegan");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [wakeUpTime, setWakeUpTime] = useState("");
  const [sleepTime, setSleepTime] = useState("");
  const [workStartTime, setWorkStartTime] = useState("");
  const [workEndTime, setWorkEndTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const [interests, setInterests] = useState<string[]>([]);
  const [selectedInterest, setSelectedInterest] = useState("");
  const [customInterest, setCustomInterest] = useState("");

  const [additionalNotes, setAdditionalNotes] = useState("");
  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  // Hyper-personalization fields
  const [travelStyle, setTravelStyle] = useState<number>(5);
  const [budgetLevel, setBudgetLevel] = useState<number>(2);
  const [foodAllergies, setFoodAllergies] = useState("");
  const [mustVisit, setMustVisit] = useState("");
  const [tripMood, setTripMood] = useState<string[]>([]);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const travelPersonaOptions = [
    "Solo Traveller",
    "Couple",
    "Elderly-Friendly",
    "Family-Friendly",
    "Adventure-Seeker",
    "Luxury Traveler",
    "Digital Nomad / Remote Worker",
  ];

  const foodPersonaOptions = [
    "Halal",
    "Vegan",
    "Vegetarian",
    "Meat Lover",
    "Gluten-Free",
    "Pescatarian",
    "Keto-Friendly",
    "Food Explorer",
  ];

  const interestOptions = ["Sightseeing", "Adventure", "Relaxation", "Food"];

  // === Interests ===
  const addInterest = () => {
    const newInterest = customInterest || selectedInterest;
    if (newInterest && !interests.includes(newInterest)) {
      setInterests((prev) => [...prev, newInterest]);
      setCustomInterest("");
      setSelectedInterest("");
    }
  };

  // === Trip Mood Toggle ===
  const toggleMood = (mood: string) => {
    setTripMood((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  // === Free tier logic ===
  const limitCheck = () => {
    const FREE_LIMIT = 3;
    const month = new Date().toISOString().slice(0, 7);

    let usage = JSON.parse(localStorage.getItem("usage-limit") || "{}");

    if (!usage.month || usage.month !== month) {
      usage = { month, count: 1 };
    } else if (usage.count >= FREE_LIMIT) {
      alert("You've used all 3 free itineraries for this month.");
      return false;
    } else {
      usage.count += 1;
    }

    localStorage.setItem("usage-limit", JSON.stringify(usage));
    setRemaining(FREE_LIMIT - usage.count);
    return true;
  };

  useEffect(() => {
    const FREE_LIMIT = 3;
    const month = new Date().toISOString().slice(0, 7);
    const usage = JSON.parse(localStorage.getItem("usage-limit") || "{}");

    setRemaining(
      !usage.month || usage.month !== month
        ? FREE_LIMIT
        : FREE_LIMIT - usage.count
    );

    const unsub = onAuthStateChanged(auth!, async (u) => {
      setUser(u);
      if (u) {
        try {
          await saveUserProfile(u);
        } catch {}
      }
    });

    return () => unsub();
  }, []);

  // === Payment feedback ===
  useEffect(() => {
    if (!router.isReady) return;

    const { success, canceled } = router.query;

    if (success) {
      alert("Payment successful!");
      router.replace("/", undefined, { shallow: true });
    } else if (canceled) {
      alert("Checkout canceled.");
      router.replace("/", undefined, { shallow: true });
    }
  }, [router]);

  const clean = (t: string) =>
    t.replace(/(\w)\n(\w)/g, "$1 $2").replace(/\n{2,}/g, "\n\n").trim();

  // ============================================================
  //            GENERATE PLAN
  // ============================================================
  const generatePlan = async () => {
    if (!limitCheck()) return;

    let requestId: string | null = null;

    setLoading(true);
    setResult("");
    setLastRequestId(null);

    // save request if logged in
    if (user) {
      try {
        requestId = await saveTripRequest({
          destination,
          travelPersona,
          foodPersona,
          startDate,
          endDate,
          wakeUpTime,
          sleepTime,
          workStartTime,
          workEndTime,
          arrivalTime,
          departureTime,
          interests,
          additionalNotes,
          travelStyle,
          budgetLevel,
          foodAllergies,
          mustVisit,
          tripMood,
        });

        setLastRequestId(requestId);

        await logEvent("generate_plan_start", {
          requestId,
          destination,
        });
      } catch {}
    }

    // Call backend AI
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          travelPersona,
          foodPersona,
          startDate,
          endDate,
          wakeUpTime,
          sleepTime,
          workStartTime,
          workEndTime,
          arrivalTime,
          departureTime,
          interests,
          additionalNotes,
          travelStyle,
          budgetLevel,
          foodAllergies,
          mustVisit,
          tripMood,
        }),
      });

      const data = await res.json();
      setResult(clean(data.text));

      if (user && requestId) {
        logEvent("generate_plan_success", { requestId });
      }
    } catch (err) {
      console.error(err);
      setResult("Error generating itinerary.");
      logEvent("generate_plan_error", { destination });
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  //           SAVE PLAN
  // ============================================================
  const savePlan = async () => {
    if (!user) return alert("Sign in to save itineraries.");
    if (!result) return alert("Generate an itinerary first.");

    const itinerary = {
      created: new Date().toISOString(),
      destination,
      travelPersona,
      foodPersona,
      travelStyle,
      budgetLevel,
      tripMood,
      result,
    };

    try {
      await saveItinerary(lastRequestId ?? "manual-save", itinerary);
    } catch {}

    await updateDoc(doc(db, "users", user.uid), {
      savedPlans: arrayUnion(itinerary),
    });

    alert("Itinerary saved!");
  };

  // ============================================================
  //              LOGIN / LOGOUT
  // ============================================================
  const login = async () => {
    try {
      const res = await signInWithPopup(auth!, googleProvider);

      await setDoc(
        doc(db, "users", res.user.uid),
        { savedPlans: [], plan: "free", usage: 0 },
        { merge: true }
      );
    } catch {
      alert("Google login failed.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth!);
      setUser(null);
    } catch {}
  };

  // ============================================================
  //                   CHECKOUT
  // ============================================================
  const startCheckout = async () => {
    if (!user) return alert("Sign in to upgrade.");

    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      });

      const data = await res.json();
      window.location.href = data.url;
    } catch {
      alert("Checkout failed.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // ============================================================
  //                     PDF EXPORT
  // ============================================================
  const pdf = async () => {
    if (!resultRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf().from(resultRef.current).save("itinerary.pdf");
  };

  // ============================================================
  //      PARSER: Image detection + Day splitting
  // ============================================================
  type DayCard = { title: string; image?: string; content: string };

  function parseItinerary(markdown: string): DayCard[] {
    const lines = markdown.split("\n");

    const days: DayCard[] = [];
    let currentDay: DayCard | null = null;
    let buffer: string[] = [];
    let pendingImage: string | undefined = undefined;

    const flush = () => {
      if (currentDay) {
        currentDay = {
          ...currentDay,
          content: buffer.join("\n").trim(),
          image: pendingImage,
        };
        days.push(currentDay);
      }
      buffer = [];
      pendingImage = undefined;
    };

    for (const line of lines) {
      // Day Header
      if (/^##\s*Day/i.test(line)) {
        flush();
        currentDay = { title: line.replace(/^##\s*/, ""), content: "" };
      }

      // IMAGE tag
      const imgMatch = line.match(/^!IMAGE:\s*(.*)/i);
      if (imgMatch) {
        pendingImage = `https://source.unsplash.com/1200x800/?${encodeURIComponent(
          imgMatch[1].trim()
        )}`;
        continue;
      }

      buffer.push(line);
    }

    flush();
    return days;
  }

  const dayCards = result ? parseItinerary(result) : [];

  // ============================================================
  //                        UI RENDER
  // ============================================================
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Auth Bar */}
      <div className="flex justify-end mb-3">
        {!user ? (
          <button
            onClick={login}
            className="bg-black text-white px-3 py-1 rounded text-sm"
          >
            Sign in with Google
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={startCheckout}
              disabled={checkoutLoading}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm disabled:opacity-60"
            >
              {checkoutLoading ? "Redirecting..." : "Go Pro"}
            </button>
            <button
              onClick={logout}
              className="bg-gray-200 px-3 py-1 rounded text-sm text-gray-900 border border-gray-300"
            >
              Logout ({user.email})
            </button>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold text-center my-5">
        Niche Travel Planner
      </h1>

      {/* ============================================================
             FORM — FULLY RESTORED
      ============================================================ */}
      <div className="grid gap-4">

        {/* Destination */}
        <input
          className="border p-2 rounded"
          placeholder="Destination (e.g. Kyoto, Maui, Paris)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        {/* Personas */}
        <select
          className="border p-2 rounded"
          value={travelPersona}
          onChange={(e) => setTravelPersona(e.target.value)}
        >
          {travelPersonaOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={foodPersona}
          onChange={(e) => setFoodPersona(e.target.value)}
        >
          {foodPersonaOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>

        {/* Dates */}
        <label className="text-sm text-gray-600">Travel Dates</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="border p-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Wake / Sleep */}
        <label className="text-sm text-gray-600">Wake / Sleep</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            className="border p-2 rounded"
            value={wakeUpTime}
            onChange={(e) => setWakeUpTime(e.target.value)}
          />
          <input
            type="time"
            className="border p-2 rounded"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
          />
        </div>

        {/* Work hours */}
        <label className="text-sm text-gray-600">Work Hours (optional)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="time"
            className="border p-2 rounded"
            value={workStartTime}
            onChange={(e) => setWorkStartTime(e.target.value)}
          />
          <input
            type="time"
            className="border p-2 rounded"
            value={workEndTime}
            onChange={(e) => setWorkEndTime(e.target.value)}
          />
        </div>

        {/* Flight times */}
        <label className="text-sm text-gray-600">Trip Times (optional)</label>
        <input
          type="time"
          className="border p-2 rounded"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
        />
        <input
          type="time"
          className="border p-2 rounded"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
        />

        {/* Travel Style Slider */}
        <label className="text-sm text-gray-600">
          Travel Style:{" "}
          <span className="font-medium">
            {travelStyle <= 3
              ? "Very Relaxed"
              : travelStyle >= 8
              ? "Adventure-heavy"
              : "Balanced"}
          </span>
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Relaxation</span>
          <input
            type="range"
            min={1}
            max={10}
            value={travelStyle}
            onChange={(e) => setTravelStyle(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-500">Adventure</span>
        </div>

        {/* Budget Slider */}
        <label className="text-sm text-gray-600">
          Budget Level:{" "}
          <span className="font-medium">
            {budgetLevel === 1
              ? "Budget"
              : budgetLevel === 2
              ? "Mid-range"
              : "Luxury"}
          </span>
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Budget</span>
          <input
            type="range"
            min={1}
            max={3}
            value={budgetLevel}
            onChange={(e) => setBudgetLevel(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs text-gray-500">Luxury</span>
        </div>

        {/* Food Allergies */}
        <label className="text-sm text-gray-600">Food Allergies</label>
        <input
          className="border p-2 rounded"
          placeholder="e.g. peanuts, shellfish, dairy..."
          value={foodAllergies}
          onChange={(e) => setFoodAllergies(e.target.value)}
        />

        {/* Must Visit */}
        <label className="text-sm text-gray-600">Must-Visit Spots</label>
        <textarea
          rows={2}
          className="border p-2 rounded"
          placeholder="List any must-visit places..."
          value={mustVisit}
          onChange={(e) => setMustVisit(e.target.value)}
        />

        {/* Interests */}
        <label className="text-sm text-gray-600">Interests</label>
        <div className="flex gap-2">
          <select
            className="border p-2 rounded"
            value={selectedInterest}
            onChange={(e) => setSelectedInterest(e.target.value)}
          >
            <option value="">Add interest...</option>
            {interestOptions.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>

          <input
            className="border p-2 rounded w-full"
            placeholder="Custom interest"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
          />

          <button
            onClick={addInterest}
            className="bg-purple-600 px-3 text-white rounded"
          >
            +
          </button>
        </div>
        {interests.length > 0 && (
          <p className="text-xs text-gray-600">
            Interests: {interests.join(", ")}
          </p>
        )}

        {/* Trip Mood */}
        <label className="text-sm text-gray-600">Trip Mood</label>
        <div className="flex flex-wrap gap-2">
          {tripMoodOptions.map((mood) => {
            const active = tripMood.includes(mood);
            return (
              <button
                key={mood}
                onClick={() => toggleMood(mood)}
                className={`px-3 py-1 rounded-full text-xs border ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {mood}
              </button>
            );
          })}
        </div>

        {/* Notes */}
        <textarea
          rows={3}
          className="border p-2 rounded"
          placeholder="Notes for AI..."
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
        />

        {/* Generate Button */}
        <button
          onClick={generatePlan}
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>

        <p className="text-sm text-center">
          Free tier: {remaining} itineraries left this month
        </p>
      </div>

      {/* ============================================================
             RESULTS SECTION (Image Cards + Scroll)
      ============================================================ */}

      {dayCards.length > 0 && (
        <>
          <div className="flex gap-3 mt-4">
            {user && (
              <button
                onClick={savePlan}
                className="bg-black text-white px-3 py-1 rounded text-sm"
              >
                Save Itinerary
              </button>
            )}
            <button
              onClick={pdf}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Download PDF
            </button>
          </div>

          <div
            ref={resultRef}
            className="
              mt-4 p-4 rounded-xl border bg-white shadow-inner 
              max-h-[75vh] overflow-y-auto scroll-smooth space-y-6
            "
          >
            {dayCards.map((day, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl shadow p-5 space-y-3"
              >
                <h2 className="text-xl font-bold">{day.title}</h2>

                {day.image && (
                  <Image
                    src={day.image}
                    alt="Day visual"
                    width={1200}
                    height={800}
                    className="rounded-xl shadow-md w-full h-auto"
                  />
                )}

                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: (props: React.ComponentProps<"a">) => (
                      <a
                        {...props}
                        className="text-blue-600 underline font-semibold"
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    ),
                  }}
                >
                  {day.content}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
