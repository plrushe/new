export type DailyEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  calorie_limit_met: boolean;
  gym_completed: boolean;
  steps_completed: boolean;
  is_successful: boolean;
  created_at: string;
  updated_at: string;
};

export type DailyEntryInput = Pick<
  DailyEntry,
  "entry_date" | "calorie_limit_met" | "gym_completed" | "steps_completed"
>;

export type CalendarDay = {
  date: string;
  entry: DailyEntry | null;
};

export type MonthlyStats = {
  currentStreak: number;
  bestStreak: number;
  successRate: number;
  successfulDays: number;
};
