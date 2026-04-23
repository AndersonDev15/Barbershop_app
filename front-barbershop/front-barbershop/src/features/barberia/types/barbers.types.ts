export type BarberStatus = "ACTIVO" | "INACTIVO" | "VACACIONES";

export interface BarberItem {
  barberId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  documentNumber: string;
  commission: number;
  status: BarberStatus;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELED";

export interface BarberInvitationResponse {
  invitedEmail: string;
  token: string;
  expiresAt: string;
  status: InvitationStatus;
}

export interface Slot {
  time: string;
  status: "DISPONIBLE" | "OCUPADO";
}

export interface BarberAvailability {
  barberId: number;
  barberName: string;
  date: string;
  allSlots: Slot[];
}
