import api from "../../../../lib/api";
import type { BarberShopFullResponse } from "../../types/cliente.types";

export async function getBarberShopFull(
  id: number,
): Promise<BarberShopFullResponse> {
  const response = await api.get<BarberShopFullResponse>(
    `/client/barbershops/${id}/full`,
  );
  return response.data;
}
