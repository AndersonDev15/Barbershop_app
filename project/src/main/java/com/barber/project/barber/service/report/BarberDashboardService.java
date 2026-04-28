package com.barber.project.barber.service.report;

import com.barber.project.barber.dto.response.report.BarberDashboardResponse;
import com.barber.project.barber.entity.Barber;
import com.barber.project.barber.service.BarberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.rmi.server.UID;
import java.time.LocalDate;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class BarberDashboardService {
    private final BarberService barberService;
    private final BarberReportService barberReportService;

    public BarberDashboardResponse dashboard(UUID userUuid) {
        Barber barber = barberService.getBarberByUserUuid(userUuid);
        LocalDate today = LocalDate.now();
        String fullName = barber.getUser().getFirstName() + " " + barber.getUser().getLastName();

        return new BarberDashboardResponse(
                barber.getId(),
                fullName,
                barberReportService.barberDailyReport(userUuid, today),
                barberReportService.barberWeeklyReport(userUuid, today),
                barberReportService.barberMonthlyReport(userUuid, today),
                barberReportService.getMonthlyComparison(userUuid),
                barberReportService.last7DaysIncome(userUuid),
                barberReportService.workedHours(userUuid, today)
        );

    }
}


