package com.barber.project.Dto.Response.Barber;

import com.barber.project.Dto.Response.Auth.UserProfileResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarberProfileResponse extends UserProfileResponse {
    private String documentNumber;
    private BigDecimal commission;
    private String barberShop;
    public BarberProfileResponse(String firstName, String lastName, String email,String phone, String documentNumber,BigDecimal commission, String barberShop){
        super(email,firstName,lastName,phone);
        this.documentNumber = documentNumber;
        this.commission = commission;
        this.barberShop = barberShop;
    }

}
