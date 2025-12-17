package com.barber.project.Dto.Response.BarberShop;

import com.barber.project.Dto.Response.Auth.UserProfileResponse;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BarberShopProfileResponse extends UserProfileResponse {
    private String BarberShopName;
    private String address;
    private String BarberShopPhone;

    public BarberShopProfileResponse(String email, String firstName, String lastName, String phone, String barberShopName, String address, String barberShopPhone) {
        super(email, firstName, lastName, phone);
        this.BarberShopName = barberShopName;
        this.address = address;
        this.BarberShopPhone = barberShopPhone;
    }


}
