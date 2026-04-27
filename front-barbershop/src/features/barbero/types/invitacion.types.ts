export interface InvitationDetailsResponse {
  barberShopName: string;
  barberShopAddress: string;
  commission: number;
  barberId: string;
  documentNumber: string;
  expiresAt: string;
  expired: boolean;
}

export interface InvitacionData extends InvitationDetailsResponse {}
