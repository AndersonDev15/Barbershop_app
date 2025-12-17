package com.barber.project.Dto.Response.Reports.BarberShop;

import com.barber.project.Dto.Response.Reports.Barber.MonthlyComparisonResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@Schema(description = "Reporte general del dashboard de la barbería")
public class BarbershopReportResponse {

    @Schema(
            description = "Ingresos totales generados por la barbería",
            example = "1250000.50"
    )
    private BigDecimal totalIncome;

    @Schema(
            description = "Ganancias de la barberia",
            example = "500000.50"
    )
    private BigDecimal barberShopIncome;

    @Schema(
            description = "Total de comisiones pagadas a los barberos",
            example = "450000.00"
    )
    private BigDecimal totalCommissionPaid;

    @Schema(
            description = "Total de propinas recibidas",
            example = "120000.00"
    )
    private BigDecimal totalTips;

    @Schema(
            description = "Cantidad total de transacciones realizadas",
            example = "87"
    )
    private Long totalTransactions;

    @Schema(
            description = "Número de barberos activos actualmente en la barbería",
            example = "5"
    )
    private Long activeBarbers;

    @Schema(
            description = "Comparación entre el mes actual y el anterior"
    )
    private MonthlyComparisonResponse monthlyComparison;

    @Schema(
            description = "Reporte de ingresos del mes agrupado por barbero"
    )
    private IncomesByBarberResponse monthlyReport;

    @Schema(
            description = "Reporte de ingresos de la semana agrupado por barbero"
    )
    private IncomesByBarberResponse weeklyReport;

    @Schema(
            description = "Reporte diario de ingresos del barbero"
    )
    private DailyBarberIncomeResponse dailyReport;

    @Schema(
            description = "Lista de los barberos con mejor rendimiento"
    )
    private List<TopBarberResponse> topBarbers;

}

