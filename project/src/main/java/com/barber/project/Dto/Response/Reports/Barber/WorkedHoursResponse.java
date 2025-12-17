package com.barber.project.Dto.Response.Reports.Barber;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WorkedHoursResponse {
    private int totalAppointments;
    private String hours;

}
