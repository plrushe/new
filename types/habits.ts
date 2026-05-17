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

export type Profile = {
  id: string;
  user_id: string;
  display_name: string;
  created_at: string;
};

export type Leaderboard = {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
};

export type LeaderboardMember = {
  id: string;
  leaderboard_id: string;
  user_id: string;
  joined_at: string;
};

export type LeaderboardRow = {
  user_id: string;
  display_name: string;
  joined_at: string;
  completed_days: number;
  rank: number;
};
