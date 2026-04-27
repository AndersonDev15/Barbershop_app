export interface BarberShopProfile {
  id: number;
  barberShopName: string;
  address: string;
  phone: string;
}

export interface BarberShopProfileUpdateRequest {
  barberShopName: string;
  address: string;
  barberShopPhone: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface BarberShopImageResponse {
  id: number;
  imageUrl: string;
  cover: boolean;
  uploadedAt: string;
}
