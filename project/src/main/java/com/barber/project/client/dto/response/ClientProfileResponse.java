package com.barber.project.client.dto.response;

import com.barber.project.user.dto.response.UserProfileResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClientProfileResponse extends UserProfileResponse {

    public ClientProfileResponse(String firstName, String lastName, String email,String phone){
        super(email,firstName,lastName,phone);
    }
}