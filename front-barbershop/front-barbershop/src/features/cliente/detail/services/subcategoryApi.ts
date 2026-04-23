import api from "../../../../lib/api";
import type { SubCategoryResponse } from "../../types/cliente.types";

export async function getSubcategories(barbershopId: number, categoryId: number): Promise<SubCategoryResponse[]> {
  const response = await api.get<SubCategoryResponse[]>(`/client/barbershops/${barbershopId}/services/${categoryId}/subcategories`);
  return response.data;
}
