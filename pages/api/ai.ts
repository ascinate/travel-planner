// /pages/api/ai.ts
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function cleanOutput(text: string) {
  return text
    .replace(/(\w)\n(\w)/g, "$1$2") // join broken words
    .replace(/\n{2,}/g, "\n\n") // collapse multiple line breaks
    .replace(/[ ]{2,}/g, " ") // collapse multiple spaces
    .trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
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
    } = req.body;

    const prompt = `
Generate a well-formatted Markdown travel itinerary.

Requirements:
- NO broken words or mid-word line breaks.
- All links must use Markdown, fomat the link as [Name] and attach hyperlink to it (https://example.com)
- Clean paragraphs, bullet points, and day sections.
- Take into consideration weather and any recent travel alerts while preparing the itenaries.

User Inputs:
Destination: ${destination}
Travel Persona: ${travelPersona}
Food Preferences: ${foodPersona}
Start Date: ${startDate}
End Date: ${endDate}
Wake Up Time: ${wakeUpTime}
Sleep Time: ${sleepTime}
Work Start Time: ${workStartTime}
Work End Time: ${workEndTime}
Arrival Time: ${arrivalTime}
Departure Time: ${departureTime}
Interests: ${interests.join(", ")}
Additional Notes: ${additionalNotes || "None"}

Produce a clean, ready-to-render Markdown itinerary.
`;

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const raw = completion.output_text;
    const cleaned = cleanOutput(raw);

    res.status(200).json({ text: cleaned });
  } catch (error: unknown) {
    console.error("AI error:", error);

    let message = "Error generating itinerary";
    if (error instanceof Error) {
      message = error.message;
    }

    res.status(500).json({ error: message });
  }
}
