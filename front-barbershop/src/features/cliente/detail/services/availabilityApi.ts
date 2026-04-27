import api from "../../../../lib/api";
import type { 
  BarberAvailabilityResponse, 
  AvailabilitySearchRequest, 
  AvailabilitySearchResponse 
} from "../../types/cliente.types";

export async function getBarberAvailability(barberId: number, date: string): Promise<BarberAvailabilityResponse> {
  const response = await api.get<BarberAvailabilityResponse>(`/client/barbershops/barber/${barberId}/availability?date=${date}`);
  return response.data;
}

export async function searchAvailability(body: AvailabilitySearchRequest): Promise<AvailabilitySearchResponse> {
  const response = await api.post<AvailabilitySearchResponse>(`/client/availability/search`, body);
  return response.data;
}
