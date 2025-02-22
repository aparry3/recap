import  { GenerativeModel, GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { WeddingEventDetails } from './types/WeddingEvent';


const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set');
}


const GENERATION_CONFIG = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  const SYSTEM_INSTRUCTION = "You are an expert event extractor. Your task is to read the provided text and identify all events mentioned within. For each event, extract the following information, if present in the text.\n\n**Required Fields:**\n\n*   `name`: The name of the event (string).\n*   `location`: The location or address of the event (string).\n\n**Optional Fields:**\n\n*   `start:` The datetime the event occurred or will occur. Use ISO 8601 format. If no time is given, use the format 'YYYY-MM-DD' \n*   `end:` The datetime the event occurred or will end. Use ISO 8601 format. If no time is given, use the format 'YYYY-MM-DD' \n*   `attire`: The suggested or required attire for the event (string).\n\nOutput the extracted events in a JSON array format. Each object in the array represents a single event and should have the following keys: `\"start\"`, `\"end\"`, `\"location\"`, `\"name\"`, and `\"attire\"`. If a piece of information is not explicitly mentioned in the text, use `null` as the value."

class GeminiClient {
    model: GenerativeModel
    constructor() {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: SYSTEM_INSTRUCTION
          });
    }

    async extractEvents(text: string): Promise<WeddingEventDetails[]> {
        const parts = [
            // {text: "You are an expert event extractor. Your task is to read the provided text and identify all events mentioned within. For each event, extract the following information, if present in the text.\n\n**Required Fields:**\n\n*   `name`: The name of the event (string).\n*   `location`: The location or address of the event (string).\n\n**Optional Fields:**\n\n*   `start:` The datetime the event occurred or will occur. Use ISO 8601 format. If no time is given, use the format 'YYYY-MM-DD' \n*   `end:` The datetime the event occurred or will end. Use ISO 8601 format. If no time is given, use the format 'YYYY-MM-DD' \n*   `attire`: The suggested or required attire for the event (string).\n\nOutput the extracted events in a JSON array format. Each object in the array represents a single event and should have the following keys: `\"start\"`, `\"end\"`, `\"location\"`, `\"name\"`, and `\"attire\"`. If a piece of information is not explicitly mentioned in the text, use `null` as the value.\n\n** Example Input **"},
            {text: "input: Menu ButtonL&KAugust 22, 2025The Night BeforeThursday, August 21, 20257:00 PM–9:00 PM7:00 PM–9:00 PMWelcome DrinksSurfside Smokehouse14 Union Street, Plymouth, MA, 02360, United StatesAttire: CocktailWe would love for you to join us the night before for beverages on the water!The Wedding DayAugust 22, 2025Attire: Semi-FormalCeremonySt. Mary Parish313 Court Street, Plymouth, MA, 02360, United States5:00 PM–6:00 PM5:00 PM–6:00 PMCocktail HourWhite Cliffs Country ClubOne East Cliff Drive, Plymouth, MA, 023606:00 PM–10:00 PM6:00 PM–10:00 PMReceptionWhite Cliffs Country ClubOne East Cliff Drive, Plymouth, MA, 0236010:30 PM10:30 PMThe After PartyThe CabbyShack30 Town Wharf, Plymouth, MA, 02360, United StatesHomeOur StoryPhotosQ + ATravelThings to Do"},
            {text: "output: [  {    \"start\": \"2025-08-21T19:00:00\",    \"end\": \"2025-08-21T21:00:00\",    \"location\": \"Surfside Smokehouse, 14 Union Street, Plymouth, MA, 02360, United States\",    \"name\": \"Welcome Drinks\",    \"attire\": \"Cocktail\"  },  {    \"start\": \"2025-08-22\",    \"end\": null,    \"location\": \"St. Mary Parish, 313 Court Street, Plymouth, MA, 02360, United States\",    \"name\": \"Ceremony\",    \"attire\": \"Semi-Formal\"  },  {    \"start\": \"2025-08-22T17:00:00\",    \"end\": \"2025-08-22T18:00:00\",    \"location\": \"White Cliffs Country Club, One East Cliff Drive, Plymouth, MA, 02360\",    \"name\": \"Cocktail Hour\",    \"attire\": \"Semi-Formal\"  },  {    \"start\": \"2025-08-22T18:00:00\",    \"end\": \"2025-08-22T22:00:00\",    \"location\": \"White Cliffs Country Club, One East Cliff Drive, Plymouth, MA, 02360\",    \"name\": \"Reception\",    \"attire\": \"Semi-Formal\"  },  {    \"start\": \"2025-08-22T22:30:00\",    \"end\": null,    \"location\": \"The CabbyShack, 30 Town Wharf, Plymouth, MA, 02360, United States\",    \"name\": \"The After Party\",    \"attire\": null  }]"},
            {text: "input: Menu ButtonN&ASeptember 6, 2024Plymouth MAWelcome DrinksThursday, September 5, 20248:30 PM–12:00 AM71 West Atlantic Steakhouse114 Water Street, Plymouth, MA, 02360, United StatesWedding DayFriday, September 6, 20243:30 PM–10:00 PMAttire: Formal3:30 PM–4:00 PM3:30 PM–4:00 PMCeremonySaint Mary’s Parish 313 Court Street, Plymouth, MA, 023605:00 PM–6:00 PM5:00 PM–6:00 PMCocktail HourWhite Cliffs Country ClubOne East Cliff Drive, Plymouth, MA, 023606:00 PM–10:00 PM6:00 PM–10:00 PMDinner & DancingWhite Cliffs Country ClubOne East Cliff Drive, Plymouth, MA, 02360After PartyFriday, September 6, 202410:30 PM–12:30 AMTavern on the Wharf6 Town Wharf, Plymouth, MA, 02360HomeOur StoryPhotosWedding PartyQ + ATravelRegistry"},
            {text: "output: [  {    \"start\": \"2024-09-05T20:30:00\",    \"end\": \"2024-09-06T00:00:00\",    \"location\": \"71 West Atlantic Steakhouse, 114 Water Street, Plymouth, MA, 02360, United States\",    \"name\": \"Welcome Drinks\",    \"attire\": null  },  {    \"start\": \"2024-09-06T15:30:00\",    \"end\": \"2024-09-06T16:00:00\",    \"location\": \"Saint Mary’s Parish 313 Court Street, Plymouth, MA, 02360\",    \"name\": \"Ceremony\",    \"attire\": \"Formal\"  },  {    \"start\": \"2024-09-06T17:00:00\",    \"end\": \"2024-09-06T18:00:00\",    \"location\": \"White Cliffs Country Club, One East Cliff Drive, Plymouth, MA, 02360\",    \"name\": \"Cocktail Hour\",    \"attire\": \"Formal\"  },  {    \"start\": \"2024-09-06T18:00:00\",    \"end\": \"2024-09-06T22:00:00\",    \"location\": \"White Cliffs Country Club, One East Cliff Drive, Plymouth, MA, 02360\",    \"name\": \"Dinner & Dancing\",    \"attire\": \"Formal\"  },  {    \"start\": \"2024-09-06T22:30:00\",    \"end\": \"2024-09-07T00:30:00\",    \"location\": \"Tavern on the Wharf, 6 Town Wharf, Plymouth, MA, 02360\",    \"name\": \"After Party\",    \"attire\": \"Formal\"  }]"},
            {text: `input: ${text}`},
            {text: "output: "},
          ];
              
          const result = await this.model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: GENERATION_CONFIG,
          });
          
          const res = result.response.text()
          if (res) {
            console.log(res)
            return JSON.parse(res)
          }
          return []
    }
}

const client = new GeminiClient();

export default client