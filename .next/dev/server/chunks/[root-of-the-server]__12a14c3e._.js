module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/openai [external] (openai, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("openai");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/pages/api/ai.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// /pages/api/ai.ts
__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$openai__$5b$external$5d$__$28$openai$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/openai [external] (openai, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$openai__$5b$external$5d$__$28$openai$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$openai__$5b$external$5d$__$28$openai$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const client = new __TURBOPACK__imported__module__$5b$externals$5d2f$openai__$5b$external$5d$__$28$openai$2c$__esm_import$29$__["default"]({
    apiKey: process.env.OPENAI_API_KEY
});
function cleanOutput(text) {
    return text.replace(/(\w)\n(\w)/g, "$1$2") // join broken words
    .replace(/\n{2,}/g, "\n\n") // collapse multiple line breaks
    .replace(/[ ]{2,}/g, " ") // collapse multiple spaces
    .trim();
}
async function handler(req, res) {
    try {
        const { destination, travelPersona, foodPersona, startDate, endDate, wakeUpTime, sleepTime, workStartTime, workEndTime, arrivalTime, departureTime, interests, additionalNotes } = req.body;
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
            input: prompt
        });
        const raw = completion.output_text;
        const cleaned = cleanOutput(raw);
        res.status(200).json({
            text: cleaned
        });
    } catch (error) {
        console.error("AI error:", error);
        let message = "Error generating itinerary";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(500).json({
            error: message
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__12a14c3e._.js.map