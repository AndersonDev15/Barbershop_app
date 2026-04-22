package com.barber.project.barbershop.controller.report;

import com.barber.project.Security.Jwt.CurrentUser;
import com.barber.project.barbershop.dto.response.report.DailyBarberIncomeResponse;
import com.barber.project.barbershop.dto.response.report.ReportResponse;
import com.barber.project.barbershop.entity.enums.ReportType;
import com.barber.project.barbershop.service.report.BarbershopReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Tag(name = "Barbería - Dashboard")
@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('BARBERIA')")
@RequiredArgsConstructor
public class ReportController {

    private final BarbershopReportService reportService;

    @GetMapping
    public ReportResponse getReport(
            @RequestParam ReportType type,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date,
            @AuthenticationPrincipal CurrentUser currentUser
    ) {
        return reportService.getReport(currentUser.userUuid(), type, date);
    }

    @GetMapping("/daily")
    public DailyBarberIncomeResponse getDailyReport(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date,
            @AuthenticationPrincipal CurrentUser currentUser
    ) {
        return reportService.dailyReport(currentUser.userUuid(), date);
    }
}
