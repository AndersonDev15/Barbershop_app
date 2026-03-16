package com.barber.project.barbershop.dto.response.report;

import com.barber.project.shared.dto.report.MonthlyComparisonResponse;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.List;


@Schema(description = "Reporte general del dashboard de la barbería")
public record BarbershopReportResponse(
        @Schema(
                description = "Ingresos totales generados por la barbería",
                example = "1250000.50"
        )
         BigDecimal totalIncome,

        @Schema(
                description = "Ganancias de la barberia",
                example = "500000.50"
        )
         BigDecimal barberShopIncome,

        @Schema(
                description = "Total de comisiones pagadas a los barberos",
                example = "450000.00"
        )
         BigDecimal totalCommissionPaid,

        @Schema(
                description = "Total de propinas recibidas",
                example = "120000.00"
        )
         BigDecimal totalTips,

        @Schema(
                description = "Cantidad total de transacciones realizadas",
                example = "87"
        )
         Long totalTransactions,

        @Schema(
                description = "Número de barberos activos actualmente en la barbería",
                example = "5"
        )
         Long activeBarbers,

        @Schema(
                description = "Comparación entre el mes actual y el anterior"
        )
         MonthlyComparisonResponse monthlyComparison,

        @Schema(
                description = "Reporte de ingresos del mes agrupado por barbero"
        )
        IncomesByBarberResponse monthlyReport,

        @Schema(
                description = "Reporte de ingresos de la semana agrupado por barbero"
        )
         IncomesByBarberResponse weeklyReport,

        @Schema(
                description = "Reporte diario de ingresos del barbero"
        )
        DailyBarberIncomeResponse dailyReport,

        @Schema(
                description = "Lista de los barberos con mejor rendimiento"
        )
         List<TopBarberResponse> topBarbers
) {



}

