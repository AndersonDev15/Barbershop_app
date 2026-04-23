export type CategoryStatus = "ACTIVO" | "INACTIVO";

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  status: CategoryStatus;
}

export interface SubCategoryResponse {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface CategoryWithSubs extends CategoryResponse {
  subcategories: SubCategoryResponse[];
  expanded: boolean;
  loadingServices: boolean;
}
