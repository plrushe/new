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

export type Challenge = {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  starts_on: string | null;
  ends_on: string | null;
  created_at: string;
};

export type ChallengeMember = {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  display_name: string;
  created_at: string;
};

export type DailyWinner = "me" | "friend" | "draw";
