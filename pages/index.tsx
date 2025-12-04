
import { Inter, Big_Shoulders, Satisfy, Archivo } from 'next/font/google';
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Navbar from "@/components/Navbar";
import BannerSlider from '@/components/BannerSlider';
import ExploreSlider from '@/components/ExploreSlider';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import TestmoliasSlider from '@/components/TestmoliasSlider';


const inter = Inter({
  variable: "--font-inter-sans",
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});
const BigShoulders = Big_Shoulders({
  variable: "--font-BigShoulders-sans",
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const Satisfys = Satisfy({
  variable: "--font-Satisfys-sans",
  weight: [ '400'],
  subsets: ['latin'],
});

const Archivos = Archivo({
  variable: "--font-Archivos-sans",
  weight: [ '400'],
  subsets: ['latin'],
});


export default function TravelPlanner() {
  const [open, setOpen] = useState(false);
  
  const [destination, setDestination] = useState("");
  const [travelPersona, setTravelPersona] = useState("Single Woman");
  const [foodPersona, setFoodPersona] = useState("Vegan");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [wakeUpTime, setWakeUpTime] = useState("08:00");
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
  const [remaining, setRemaining] = useState<number | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);


  
  // New hyper-personalization fields
  const [travelStyle, setTravelStyle] = useState<number>(5); // 1=Relaxation, 10=Adventure
  const [budgetLevel, setBudgetLevel] = useState<number>(2); // 1=Budget, 2=Mid, 3=Luxury
  const [foodAllergies, setFoodAllergies] = useState("");
  const [mustVisit, setMustVisit] = useState("");

  const travelPersonaOptions = [
    "Single Woman",
    "Single Man",
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

  const addInterest = () => {
    const newInterest = customInterest || selectedInterest;
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setCustomInterest("");
      setSelectedInterest("");
    }
  };

  // --- Monthly usage logic ---
  const checkUsageLimit = () => {
    if (typeof window === "undefined") return true;
    const limit = 300;
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const stored = JSON.parse(localStorage.getItem("generationUsage") || "{}");

    if (!stored.month || stored.month !== monthKey) {
      localStorage.setItem(
        "generationUsage",
        JSON.stringify({ month: monthKey, count: 1 })
      );
      setRemaining(limit - 1);
      return true;
    }

    if (stored.count >= limit) {
      alert(
        "You've reached the free usage limit for this month. Come back next month!"
      );
      return false;
    }

    stored.count += 1;
    stored.month = monthKey;
    localStorage.setItem("generationUsage", JSON.stringify(stored));
    setRemaining(limit - stored.count);
    return true;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const limit = 300;
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth() + 1}`;
    const stored = JSON.parse(localStorage.getItem("generationUsage") || "{}");
    if (stored.month !== monthKey) {
      setRemaining(limit);
    } else {
      setRemaining(Math.max(limit - stored.count, 0));
    }
  }, []);

  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );

  const cleanText = (text: string) =>
    text
      .replace(/(\w)\n(\w)/g, "$1 $2") // join broken words
      .replace(/\n{2,}/g, "\n\n") // collapse multiple newlines
      .replace(/[ ]{2,}/g, " ") // collapse multiple spaces
      .trim();

  const generatePlan = async () => {
    if (!checkUsageLimit()) return;

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/ai", {
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
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const cleaned = cleanText(data.text);
      setResult(cleaned);
    } catch (err) {
      console.error(err);
      setResult("There was an error generating your itinerary.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resultRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `${destination || "travel-itinerary"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(resultRef.current)
      .save();
  };

  return (
    <>
    <style>
      {`
       h2,
       .plans015 span,
       .left-footer h3{
        font-family: ${BigShoulders.style.fontFamily};
       }
        .suba-text{
            font-family: ${Satisfys.style.fontFamily};
        }
        .mainmenu a.nav-link,
        .signup-btn,
        .login-ins{
             font-family: ${Archivos.style.fontFamily};
        }
        `}
    </style>
         <div className={inter.className}>
              <Navbar/>
                <section className='float-left w-full banners-parts'>
                        <BannerSlider/>
                </section>
                <section className='forms-seraclist float-left w-full'>
                        <div className='container'>
                               <div className="right-coloms">
                                  <div className='banners-text01'>
                                    <h5 className='suba-text text-white'> Let&rsquo;s Guide a Your Trip </h5>
                                      <h2 className='text-white mt-2'> Hey Im Layla,
                                        
                                        <span className='block'> your AI trip planner </span> </h2>
                                      <p className='text-white'> Build a trip with your saves or use AI to get custom recommendations </p>
                                   

                                     
                                  </div>
                              </div>
                           <div className="grid grid-cols-1 gap-4 grid-forms">
                              <div className="left-coloms">
                                   <div className='mains-forms014 bg-white'>
                                    <div className='inside-scrolls-div grid grid-cols-4 gap-x-5 items-center'>
                                      {/* --- Inputs (all preserved) --- */}
                                        <div className="crm-groups col-span-2">
                                          <label className="font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path></svg> </span> Destination</label>
                                          <input
                                            type="text"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            placeholder="Enter destination"
                                            className="border p-2 rounded w-full"
                                          />
                                        </div>

                                        <div className="crm-groups">
                                          <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z"></path></svg> </span> Travel Persona</label>
                                          <select
                                            value={travelPersona}
                                            onChange={(e) => setTravelPersona(e.target.value)}
                                            className="border p-2 rounded w-full"
                                          >
                                            {travelPersonaOptions.map((opt) => (
                                              <option key={opt} value={opt}>
                                                {opt}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                         <div className="crm-groups">
                                                <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M4 2H7.32297L8.52297 5H3V7H5.11765L5.94463 21.0587C5.97572 21.5873 6.41343 22 6.9429 22H17.0571C17.5866 22 18.0243 21.5873 18.0554 21.0587L18.8824 7H21V5H10.677L8.67703 0H4V2ZM7.29906 10.0252L7.1211 7H16.8789L16.5867 11.9675C14.28 11.853 13.4226 11.4919 12.3713 11.0714C11.2792 10.6347 9.97065 10.1354 7.29906 10.0252ZM7.41714 12.0326C9.72097 12.1473 10.5894 12.5128 11.6401 12.933C12.7001 13.357 13.9556 13.8375 16.4692 13.9641L16.1142 20H7.88581L7.41714 12.0326Z"></path></svg> </span> Food Persona</label>
                                                <select
                                                  value={foodPersona}
                                                  onChange={(e) => setFoodPersona(e.target.value)}
                                                  className="border p-2 rounded w-full"
                                                >
                                                  {foodPersonaOptions.map((opt) => (
                                                    <option key={opt} value={opt}>
                                                      {opt}
                                                    </option>
                                                  ))}
                                                </select>
                                          </div>


                                        

                                        {/* advanced */}

                                        {open && (
                                        <div className="mt-4 col-span-4 grid grid-cols-4 gap-x-5 items-end">
                                             

                                              {/* Dates */}
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                                                <div className='crm-groups'>
                                                  <label className="block font-medium mb-1">  <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg> </span> Start Date</label>
                                                  <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="border p-2 rounded w-full"
                                                  />
                                                </div>
                                                <div className='crm-groups'>
                                                  <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg> </span> End Date</label>
                                                  <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="border p-2 rounded w-full"
                                                  />
                                                </div>
                                              </div>

                                              {/* Time Preferences */}
                                              <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-5">
                                                <div className='crm-groups'>
                                                  <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg> </span> Wake-Up Time</label>
                                                  <input
                                                    type="time"
                                                    value={wakeUpTime}
                                                    onChange={(e) => setWakeUpTime(e.target.value)}
                                                    className="border p-2 rounded w-full"
                                                  />
                                                </div>
                                                <div className='crm-groups'>
                                                  <label className="block font-medium mb-1"><span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg> </span>Sleep Time <small> (Optional) </small></label>
                                                  <input
                                                    type="time"
                                                    value={sleepTime}
                                                    onChange={(e) => setSleepTime(e.target.value)}
                                                    className="border p-2 rounded w-full"
                                                  />
                                                </div>
                                                
                                              </div>

                                              <div className='crm-groups'>
                                                  <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg> </span> Work Start Time <small> (Optional) </small></label>
                                                  <input
                                                    type="time"
                                                    value={workStartTime}
                                                    onChange={(e) => setWorkStartTime(e.target.value)}
                                                    className="border p-2 rounded w-full"
                                                  />
                                              </div>
                                              <div className='crm-groups'>
                                                  <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg> </span> Work End Time <small> (Optional) </small> </label>
                                                  <input
                                                    type="time"
                                                    value={workEndTime}
                                                    onChange={(e) => setWorkEndTime(e.target.value)}
                                                    className="border p-2 rounded w-full"
                                                  />
                                              </div>

                                             

                                              <div className="crm-groups">
                                                <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg> </span> Arrival Time <small> (Optional) </small></label>
                                                <input
                                                  type="time"
                                                  value={arrivalTime}
                                                  onChange={(e) => setArrivalTime(e.target.value)}
                                                  className="border p-2 rounded w-full"
                                                />
                                              </div>

                                               <div className="crm-groups">
                                                  <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM8 13V15H6V13H8ZM13 13V15H11V13H13ZM18 13V15H16V13H18ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg> </span> Departure Time <small> (Optional) </small> </label>
                                                  <input
                                                    type="time"
                                                    value={departureTime}
                                                    onChange={(e) => setDepartureTime(e.target.value)}
                                                    className="border p-2 rounded w-full"
                                                  />
                                                </div>

                                                <div className="crm-groups">
                                                  {/* Food Allergies */}
                                                  <label className="text-sm text-gray-600">Food Allergies</label>
                                                  <input
                                                    className="border p-2 rounded w-full"
                                                    placeholder="e.g. peanuts, shellfish, dairy..."
                                                    value={foodAllergies}
                                                    onChange={(e) => setFoodAllergies(e.target.value)}
                                                  />
                                                </div>

                                              {/* Interests */}
                                              <div className="crm-groups col-span-2">
                                                <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M19 22H5C3.34315 22 2 20.6569 2 19V3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V15H22V19C22 20.6569 20.6569 22 19 22ZM18 17V19C18 19.5523 18.4477 20 19 20C19.5523 20 20 19.5523 20 19V17H18ZM16 20V4H4V19C4 19.5523 4.44772 20 5 20H16ZM6 7H14V9H6V7ZM6 11H14V13H6V11ZM6 15H11V17H6V15Z"></path></svg> </span> Interests</label>
                                                <div className="flex gap-2 mb-2">
                                                  <select
                                                    className="border p-2 rounded"
                                                    value={selectedInterest}
                                                    onChange={(e) => setSelectedInterest(e.target.value)}
                                                  >
                                                    <option value="">Select interest</option>
                                                    {interestOptions.map((opt) => (
                                                      <option key={opt} value={opt}>
                                                        {opt}
                                                      </option>
                                                    ))}
                                                  </select>
                                                  <input
                                                    type="text"
                                                    placeholder="Custom interest"
                                                    value={customInterest}
                                                    onChange={(e) => setCustomInterest(e.target.value)}
                                                    className="border p-2 rounded flex-1"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={addInterest}
                                                    className="bg-purple-600 text-white px-3 rounded"
                                                  >
                                                    Add
                                                  </button>
                                                </div>
                                                {interests.length > 0 && <p>Selected: {interests.join(", ")}</p>}
                                              </div>

                                               <div className="crm-groups">
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
                                              </div>


                                              <div className="crm-groups">
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
                                              </div>

                                              {/* Additional Notes */}
                                              <div className="crm-groups col-span-2">
                                                <label className="block font-medium mb-1"> <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="rgba(194,157,89,1)"><path d="M19 22H5C3.34315 22 2 20.6569 2 19V3C2 2.44772 2.44772 2 3 2H17C17.5523 2 18 2.44772 18 3V15H22V19C22 20.6569 20.6569 22 19 22ZM18 17V19C18 19.5523 18.4477 20 19 20C19.5523 20 20 19.5523 20 19V17H18ZM16 20V4H4V19C4 19.5523 4.44772 20 5 20H16ZM6 7H14V9H6V7ZM6 11H14V13H6V11ZM6 15H11V17H6V15Z"></path></svg> </span> Additional Notes <small> (Optional) </small> </label>
                                                <textarea
                                                  value={additionalNotes}
                                                  onChange={(e) => setAdditionalNotes(e.target.value)}
                                                  placeholder="Add anything extra for your itinerary..."
                                                  className="border p-2 rounded w-full"
                                                  rows={3}
                                                />
                                              </div>

                                             

                                              <div className="crm-groups col-span-2">
                                                 

                                                  {/* Must-Visit List */}
                                                  <label className="text-sm text-gray-600">Must-Visit Spots</label>
                                                  <textarea
                                                    rows={2}
                                                    className="border p-2 rounded w-full"
                                                    placeholder="List any must-visit places, neighborhoods, or landmarks..."
                                                    value={mustVisit}
                                                    onChange={(e) => setMustVisit(e.target.value)}
                                                  />
                                              </div>

                                          </div>
                                        )}

                                        <div className="sm-div-btn">
                                            <button
                                              onClick={generatePlan}
                                              disabled={loading}
                                              className="suend-butons flex items-center justify-center disabled:opacity-60"
                                            >
                                              <svg viewBox="0 0 24 24" width="24px" height="24px" className="d Vb UmNoP" aria-hidden="true"><path d="M16.895 3A4.86 4.86 0 0 0 21 7.105a4.86 4.86 0 0 0-4.105 4.106 4.86 4.86 0 0 0-4.105-4.106A4.86 4.86 0 0 0 16.895 3M9.947 7.105a8.22 8.22 0 0 0 6.947 6.947A8.22 8.22 0 0 0 9.947 21 8.22 8.22 0 0 0 3 14.052a8.22 8.22 0 0 0 6.947-6.947"></path></svg>
                                              {loading ? <Spinner /> : "Generate Itinerary"}
                                            </button>

                                            
                                        </div>
                                        <button
                                                    onClick={() => setOpen(!open)}
                                                    className="advance-btn flex items-center"
                                                  >
                                                    Advanced Search <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path></svg>
                                          </button>
                                        <div className="crm-groups col-span-4 mt-5">
                                        {remaining !== null && (
                                          <p className="text-sm plans015 text-gray-600 mt-0 ">
                                          <span> Free Plan: </span>  {remaining} itinerary generations left this month
                                          </p>
                                        )}
                                        </div>
                                    </div>

                                        {/* Generate */}
                                        

                                      
                                </div>
                              </div>
                              
                            </div>
                        </div>
                    </section>
              {!result && (
                <>

                            

                    <section className='float-left w-full new-cson'>
                        <div className='container'>
                              <div className="right-coloms">
                                  <div className='banners-text01'>
                                    <div className='grid grid-cols-2 gap-xl-5 items-center'>
                                      <div className='mains-dates'>

                                           <figure className='w-full ab-pics01'>
                                              <Image width={783} height={716} src="/abouts015.png" alt='ms'/>
                                           </figure>
                                         
                                      </div>
                                      <div className='txerat'>
                                        <h5 className='suba-text ns-text'> About story </h5>
                                        <h2> Build a trip with your saves or use AI to get </h2>

                                        <p className='py-4'> The Niche Group connects people to experiences worth sharing, and aims to be the worlds most trusted source for travel and experiences. We leverage our brands, technology, and capabilities to connect our global audience with partners through rich content, travel guidance, and two-sided marketplaces for experiences, accommodations, restaurants, and other travel categories. The subsidiaries of Niche, Inc. include a portfolio of travel brands and businesses,
                                           including Niche, Viator, and TheFork.</p>

                                        <Link href="/" className='b-dsicover-btn mb-5'> Plan My Trip </Link>
                                        <div className='flex items-center mt-5 py-4'>
                                          <div className='flex items-center'>
                                            <figure className='user-img01'>
                                              <Image width={143} height={23} src="/user01.jpg" alt='user'/>
                                            </figure>
                                            <figure className='user-img01'>
                                              <Image width={143} height={23} src="/vecteezy_a-man-sitting-on-a-dock-with-yellow-nets_71135147.jpg" alt='user'/>
                                            </figure>
                                            <figure className='user-img01'>
                                              <Image width={143} height={23} src="/pexels-chaitaastic-2031753.jpg" alt='user'/>
                                            </figure>
                                          </div>
                                            <h5 className='ml-5'> <Image width={143} height={23} src="/ratings.svg" alt="sm"/> 
                                              <span className='d-block'> 5k+ Reviews </span>
                                            </h5>
                                        </div>
                                      </div>
                                      
                                    </div>
                                  </div>
                              </div>
                        </div>
                    </section>
                    <section className='float-left w-full sm-grid01'>
                        <div className='container'>
                           <div className='grid grid-cols-3 gap-4 gap-xl-5'>
                                <div className='datea-list flex items-center'>
                                  <div className='cions'>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(194,157,89,1)"><path d="M21.7267 2.95694L16.2734 22.0432C16.1225 22.5716 15.7979 22.5956 15.5563 22.1126L11 13L1.9229 9.36919C1.41322 9.16532 1.41953 8.86022 1.95695 8.68108L21.0432 2.31901C21.5716 2.14285 21.8747 2.43866 21.7267 2.95694ZM19.0353 5.09647L6.81221 9.17085L12.4488 11.4255L15.4895 17.5068L19.0353 5.09647Z"></path></svg>
                                  </div>
                                  <h3> 
                                      12,05510
                                    <span className='block'> Trips Planned </span>
                                  </h3>
                                </div>
                                <div className='datea-list dark-bg flex items-center'>
                                    <div className='cions'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(194,157,89,1)"><path d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z"></path></svg>
                                    </div>
                                    <h3 className='text-white'> 
                                        25,05510
                                      <span className='block'> Messages Processed </span>
                                    </h3>
                                </div>
                                <div className='datea-list flex items-center'>
                                    <div className='cions'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(220,175,93,1)"><path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H16C16 18.6863 13.3137 16 10 16C6.68629 16 4 18.6863 4 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM10 11C12.21 11 14 9.21 14 7C14 4.79 12.21 3 10 3C7.79 3 6 4.79 6 7C6 9.21 7.79 11 10 11ZM18.2837 14.7028C21.0644 15.9561 23 18.752 23 22H21C21 19.564 19.5483 17.4671 17.4628 16.5271L18.2837 14.7028ZM17.5962 3.41321C19.5944 4.23703 21 6.20361 21 8.5C21 11.3702 18.8042 13.7252 16 13.9776V11.9646C17.6967 11.7222 19 10.264 19 8.5C19 7.11935 18.2016 5.92603 17.041 5.35635L17.5962 3.41321Z"></path></svg>
                                    </div>
                                    <h3 className='text-white'> 
                                        100+
                                      <span className='block'> Client Globally </span>
                                    </h3>
                                </div>
                           </div>
                            
                        </div>
                    </section>

                    <section className='float-left w-full darks-amb-texm'>
                        <div className='container'>
                            <div className='grid gap-4 gap-xl-5 grid-cols-12 justify-between items-center'>
                                <div className='left-darkstext col-span-4'>
                                    <h5 className='suba-text ns-text'> Your Most Trusted Guides </h5>
                                    <h2 className='body-heading'> People Who Make Travel Enchanting </h2>
                                    <p className='py-4'> The Niche Group connects people to experiences worth sharing, and aims to be the worlds most 
                                      trusted source for travel and experiences. </p>
                                    <Link href="/" className='b-dsicover-btn'> Plan My Trip </Link>
                                </div>
                                 <div className='rightys-darkstext  grid grid-cols-3 gap-5 col-span-8 justify-between'>
                                     <Link href="/" className='comoun-card-grid w-full'>
                                         <figure>
                                           <Image width={600} height={600} src="/bidri-ambience.jpg" alt="nam"/>
                                         </figure>
                                         <div className='text-grid015'>
                                            <h5> Go for Restaurants </h5>
                                            <p> our experiences decided by travelers </p>
                                         </div>
                                     </Link>

                                     <Link href="/" className='comoun-card-grid w-full'>
                                         <figure>
                                           <Image width={600} height={600} src="/pexels-jcosta-13800608.jpg" alt="nam"/>
                                         </figure>
                                         <div className='text-grid015'>
                                            <h5> Go for Accommodations </h5>
                                            <p> our experiences decided by travelers </p>
                                         </div>
                                     </Link>

                                     <Link href="/" className='comoun-card-grid w-full'>
                                         <figure>
                                           <Image width={600} height={600} src="/pexels-chaitaastic-2031753.jpg" alt="nam"/>
                                         </figure>
                                         <div className='text-grid015'>
                                            <h5> Go for Attractions </h5>
                                            <p> our experiences decided by travelers </p>
                                         </div>
                                     </Link>
                                 </div>
                            </div>
                        </div>
                    </section>
                    <section className='float-left w-full explores-div'>
                        <div className='container'>
                             <div className='grid grid-cols-2 gap-4 justify-between items-center'>
                              <div className='headings-div'>
                                  <h2 className='body-heading'> Where to go next </h2>
                                  <p className='mt-2'> Weve updated our Trips product to help. </p>
                              </div>

                              <Link href="/" className='b-dsicover-btn ml-auto flex items-center'>Discover More <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgba(255,255,255,1)"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg> </Link>
                                 
                             </div>
                             <ExploreSlider/>
                        </div>
                    </section>

                    <section className='float-left w-full testimonials-div'>
                        <div className='container'>
                                  <h5 className='text-center'> Testimonials </h5>
                                  <h2 className='body-heading text-center'> Regards From Travelers </h2>

                                  <TestmoliasSlider/>
                        </div>
                    </section>

                    
       
                </>
              )}
              {/* Result */}
              {result && (
                <>
                 <div className='container sub-pages01'>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={downloadPDF}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Download as PDF
                    </button>
                  </div>
                  <div
                    ref={resultRef}
                    className="mt-4 border p-4 crad-list-menu rounded bg-white prose dark:prose-invert max-w-none overflow-auto"
                  >
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>{result}</ReactMarkdown>
                  </div>
                </div>
                </>
              )}
        </div>

        <Footer/>
      
    </>
  
  );
}
