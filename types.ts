export enum StomachFeeling {
  Great = 'GREAT',
  Full = 'FULL',
  Stuffed = 'STUFFED'
}

export interface FoodItem {
  name: string;
  weight_grams: number;
  ingredients_breakdown?: string; // e.g., "Tomato 100g, Egg 50g"
}

export interface MealAnalysis {
  items: FoodItem[];
  stomachLoadPercentage: number; // 0 to 100+
  advice: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO string
  timestamp: number;
  feeling: StomachFeeling;
  foodNote?: string; // What did they eat?
  note?: string; // General notes
}

export enum AppTab {
  Planner = 'planner',
  Journal = 'journal',
  Emergency = 'emergency',
}