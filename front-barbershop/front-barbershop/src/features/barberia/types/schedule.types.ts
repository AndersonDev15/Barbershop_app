export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface OpeningHoursResponse {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  id: number;
  day: string;
  dayOfWeek: DayOfWeek;
  open: boolean;
  openTime: string;
  closeTime: string;
  status: "open" | "late_night" | "closed";
}

export interface BreakBlock {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
}
