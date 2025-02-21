import  { GenerativeModel, GoogleGenerativeAI, SchemaType } from '@google/generative-ai';


const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
}

const SYSTEM_INSTRUCTION = `You are an expert event extractor. Your task is to read the provided text and identify all events mentioned within. For each event, extract the following information, if present in the text:

*   **Date:** The date the event occurred or will occur. Use YYYY-MM-DD format if possible. If only a partial date is available (e.g., "July 2023"), fill in the missing parts with the most likely values (e.g., YYYY-MM-DD). If only a day of the week is given, fill in with the current week from now.
*   **Time:** The time the event occurred or will occur. Use HH:MM format (24-hour clock). If only a partial time is available (e.g., "afternoon"), infer the most likely time (e.g., 14:00).
*   **Location:** The place where the event occurred or will occur. Be as specific as possible.
*   **Name:** The name or title of the event.
*   **Attire:** The attire for th event if its available.

Output the extracted events in a JSON array format. Each object in the array represents a single event and should have the following keys: "Start", "End", "Location", "Name", and "Attire". If a piece of information is not explicitly mentioned in the text, use null as the value.
`

const GENERATION_CONFIG = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  
class GeminiClient {
    model: GenerativeModel
    constructor() {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: SYSTEM_INSTRUCTION });
    }

    async extractEvents(text: string) {
        const parts = [
            {text: "input: Lillian & KevinAugust 22, 2025182 Days To Go!Lillian & KevinAugust 22, 2025182 Days To Go!Menu ButtonL&KHomeOur StoryPhotosQ + ATravelThings to DoHomeOur StoryPhotosQ + ATravelThings to DoAugust 22, 2025The Night BeforeThursday, August 21, 20257:00 PM–9:00 PM7:00 PM–9:00 PMWelcome DrinksSurfside Smokehouse14 Union Street, Plymouth, MA, 02360, United StatesAttire: CocktailWe would love for you to join us the night before for beverages on the water!The Wedding DayAugust 22, 2025Attire: Semi-FormalCeremonySt. Mary Parish313 Court Street, Plymouth, MA, 02360, United States5:00 PM–6:00 PM5:00 PM–6:00 PMCocktail HourWhite Cliffs Country ClubOne East Cliff Drive, Plymouth, MA, 023606:00 PM–10:00 PM6:00 PM–10:00 PMReceptionWhite Cliffs Country ClubOne East Cliff Drive, Plymouth, MA, 0236010:30 PM10:30 PMThe After PartyThe CabbyShack30 Town Wharf, Plymouth, MA, 02360, United StatesHomeOur StoryPhotosQ + ATravelThings to DoL&K8.22.2025Created on The KnotGetting married? Create your wedding website for free.Your Privacy Choices"},
            {text: "output: [\n  {\n    \"Start\": \"2025-08-21T19:00:00\",\n    \"End\": \"2025-08-21T21:00:00\",\n    \"Location\": \"Surfside Smokehouse, 14 Union Street, Plymouth, MA, 02360, United States\",\n    \"Name\": \"Welcome Drinks\",\n    \"Attire\": \"Cocktail\"\n  },\n  {\n    \"Start\": \"2025-08-22\",\n    \"End\": null,\n    \"Location\": \"St. Mary Parish, 313 Court Street, Plymouth, MA, 02360, United States\",\n    \"Name\": \"Ceremony\",\n    \"Attire\": \"Semi-Formal\"\n  },\n  {\n    \"Start\": \"2025-08-22T17:00:00\",\n    \"End\": \"2025-08-22T18:00:00\",\n    \"Location\": \"White Cliffs Country Club, One East Cliff Drive, Plymouth, MA, 02360\",\n    \"Name\": \"Cocktail Hour\",\n    \"Attire\": \"Semi-Formal\"\n  },\n  {\n    \"Start\": \"2025-08-22T18:00:00\",\n    \"End\": \"2025-08-22T22:00:00\",\n    \"Location\": \"White Cliffs Country Club, One East Cliff Drive, Plymouth, MA, 02360\",\n    \"Name\": \"Reception\",\n    \"Attire\": \"Semi-Formal\"\n  },\n  {\n    \"Start\": \"2025-08-22T22:30:00\",\n    \"End\": null,\n    \"Location\": \"The CabbyShack, 30 Town Wharf, Plymouth, MA, 02360, United States\",\n    \"Name\": \"The After Party\",\n    \"Attire\": null\n  }\n]"},
            {text: `input: ${text}`},
            {text: "output: "},
          ];
        
          const result = await this.model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: GENERATION_CONFIG,
          });
          console.log(result.response.text());
          return result.response.text()
    }
}

const client = new GeminiClient();

export default client