export interface Barber {
  id: string;
  name: string;
  role: string;
  specialty: string;
  initials: string;
}

export type SlotStatus = "available" | "blocked" | "booked";

export interface TimeSlot {
  id: string;
  time: string;
  status: SlotStatus;
}

export interface AvailabilityDay {
  dayShort: string; // 'MON'
  dayNumber: string; // '21'
  date: string; // '2024-10-21'
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  services: ServiceItem[];
  isExpanded: boolean;
}

export interface BarbershopSuggestion {
  id: string;
  name: string;
  address: string;
}

export interface BarberShopResponse {
  id: number;
  name: string;
  address: string;
  phone: string;
  openNow: boolean;
  todaySchedules: string[];
  coverImageUrl: string | null;
}

export interface BarberResponse {
  barberId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  commission: number;
  status: "ACTIVO" | "INACTIVO";
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  status: "ACTIVO" | "INACTIVO";
}

export interface SubCategoryResponse {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface BarberShopFullResponse {
  info: BarberShopResponse;
  barbers: BarberResponse[];
  services: CategoryResponse[];
}

export interface AvailabilitySlot {
  time: string;
  status: "DISPONIBLE" | "OCUPADO" | "NO_DISPONIBLE" | "NO DISPONIBLE";
}

export interface BarberAvailabilityResponse {
  barberId: number;
  barberName: string;
  date: string;
  allSlots: AvailabilitySlot[];
}

export interface AvailabilitySearchRequest {
  barberId: number;
  subcategoryIds: number[];
  date: string;
}

export interface AvailabilitySearchResponse {
  barberId: number;
  barber: string;
  date: string;
  selectedServices: {
    id: number;
    name: string;
    duration: number;
    price: number;
  }[];
  totalDuration: number;
  requiredBlocks: number;
  totalPrice: number;
  slots: AvailabilitySlot[];
}

export interface ReservationRequest {
  barberId: number;
  date: string;
  startTime: string;
  subcategoryIds: number[];
}

export type ReservationStatus =
  | "PENDIENTE"
  | "CONFIRMADA"
  | "EN_CURSO"
  | "COMPLETADA"
  | "CANCELADA";

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
  status: ReservationStatus;
}

export type TransactionStatus =
  | "Completed"
  | "Cancelled"
  | "Pending"
  | "unpaid"
  | "confirmed"
  | "pending"
  | "completed"
  | "refunded"
  | "cancelled"
  | "Refunded";

export interface Reservation {
  id: string;
  reservationNumber: string;
  clientName: string;
  barberName: string;
  barberRole: string;
  barberInitials: string;
  date: string;
  timeWindow: string;
  status: ReservationStatus;
  transactionStatus: TransactionStatus;
  services: {
    id: string;
    name: string;
    duration: string;
    price: string;
    icon: string;
  }[];
  total: string;
  paymentMethod: string;
}

export interface Transaction {
  id: string;
  price: string;
  status: TransactionStatus;
  date: string;
  time: string;
  duration: string;
  barberName: string;
  serviceName: string;
}

export type ClienteNotificationCategory =
  | "reservation_created"
  | "reservation_confirmed"
  | "reservation_completed"
  | "reservation_cancelled"
  | "payment_received"
  | "payment_confirmed"
  | "promotion"
  | "system";

export type PaymentMethod = "EFECTIVO" | "TRANSFERENCIA";

export interface PaymentRequest {
  paymentMethod: PaymentMethod;
  tip: number;
  notes: string;
}

export interface PaymentResponse {
  id: number;
  transactionCode: string;
  reservationId: number;
  barberId: number;
  totalAmount: number;
  tip: number;
  paymentMethod: PaymentMethod;
  paymentStatus: string;
  paymentDate: string;
  notes: string;
}

export interface ClienteNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  category: ClienteNotificationCategory;
  isRead: boolean;
  isNew?: boolean;
  actionLabel?: string;
  icon: string;
  accentColor: "primary" | "tertiary" | "error" | "muted";
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    price: "$35.00",
    status: "Completed",
    date: "OCT 21, 2024",
    time: "14:00",
    duration: "45 MIN",
    barberName: "Marcus Vane",
    serviceName: "Signature Fade",
  },
  {
    id: "2",
    price: "$45.00",
    status: "Completed",
    date: "OCT 15, 2024",
    time: "10:30",
    duration: "60 MIN",
    barberName: "Marcus Vane",
    serviceName: "Full Service",
  },
];

export const MOCK_BARBERSHOPS: BarbershopSuggestion[] = [
  {
    id: "1",
    name: "The Midnight Atelier",
    address: "123 Luxury St",
  },
  {
    id: "2",
    name: "Golden Blade",
    address: "Madrid",
  },
];
