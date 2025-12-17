package com.barber.project.Dto.Response.Auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
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