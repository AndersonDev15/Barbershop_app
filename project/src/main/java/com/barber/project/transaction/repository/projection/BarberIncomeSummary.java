package com.barber.project.transaction.repository.projection;

import java.math.BigDecimal;

public interface BarberIncomeSummary {
    Long getBarberId();
    BigDecimal getTotal();
}
