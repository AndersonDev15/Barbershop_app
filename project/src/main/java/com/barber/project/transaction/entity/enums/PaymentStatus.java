package com.barber.project.transaction.entity.enums;

public enum PaymentStatus {
    PENDIENTE,
    EN_PROCESO,  // ← cliente registró el pago, barbero aún no confirma
    PAGADO
}
