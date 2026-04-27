import api from "../../../../lib/api";
import type { BarberShopResponse } from "../../types/cliente.types";

export async function searchBarberShop(
  name: string,
): Promise<BarberShopResponse[]> {
  const response = await api.get<BarberShopResponse[]>(
    `/client/barbershops/search?name=${encodeURIComponent(name)}`,
  );
  return response.data;
}
