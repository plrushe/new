export type DailyEntry = {
  id: string;
  user_id: string;
  entry_date: string;
  calorie_limit_met: boolean;
  gym_completed: boolean;
  steps_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type EntryGoalKey = "calorie_limit_met" | "gym_completed" | "steps_completed";

export type CalendarDay = {
  date: Date;
  iso: string;
  inCurrentMonth: boolean;
};
