package com.barber.project.Dto.Response.Auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientProfileResponse extends UserProfileResponse {
    private String preferences;
    private LocalDateTime lastVisitDate;

    public ClientProfileResponse(String firstName, String lastName, String email,String phone, String preferences, LocalDateTime lastVisitDate){
        super(email,firstName,lastName,phone);
        this.preferences = preferences;
        this.lastVisitDate = lastVisitDate;
    }
}
