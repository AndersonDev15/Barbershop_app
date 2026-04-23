export type NotificationType =
  | "INVITATION_RECEIVED"
  | "APPOINTMENT_SCHEDULED"
  | "APPOINTMENT_CANCELLED"
  | "APPOINTMENT_REMINDER"
  | "PAYMENT_CONFIRMED";

export interface NotificationResponse {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO datetime
  referenceId: number | null;
}

export interface UnreadCountResponse {
  count: number;
}
