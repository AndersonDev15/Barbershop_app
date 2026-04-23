export interface ReservationService {
  id: number;
  name: string;
  duration: number;
  price: number;
}

export interface ReservationResponse {
  id: number;
  barber: string;
  client: string;
  services: ReservationService[];
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
}

export type AppointmentStatus = "in_progress" | "confirmed" | "completed";

export interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  clientName: string;
  service: string;
  status: AppointmentStatus;
}

export interface Break {
  id: string;
  date: string; // 'YYYY-MM-DD'
  dayLabel: string; // 'Monday, Oct 14'
  dayNumber: string; // '14'
  month: string; // 'Oct'
  startTime: string; // '12:30 PM'
  endTime: string; // '01:30 PM'
  label: string; // 'Lunch Break'
  isToday: boolean;
}

export type NotificationCategory =
  | "transaction"
  | "calendar"
  | "inventory"
  | "reviews"
  | "cancellation";

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  category: NotificationCategory;
  isRead: boolean;
  isNew?: boolean;
  icon: string;
  accentColor: "primary" | "tertiary" | "error" | "muted";
}

export type PaymentMethod = "EFECTIVO" | "TRANSFERENCIA";
export type PaymentStatus =
  | "PENDIENTE"
  | "EN_PROCESO" // ← agregado
  | "PAGADO"
  | "REEMBOLSADO"
  | "RECHAZADO";

export interface TransactionResponse {
  id: number;
  transactionCode: string;
  totalAmount: number;
  tip: number;
  paymentMethod: PaymentMethod | null; // ← null cuando aún no se ha pagado
  paymentStatus: PaymentStatus;
  paymentDate: string | null; // ← null en PENDIENTE / EN_PROCESO
  createdAt: string; // ← nuevo campo
  notes?: string;
}
