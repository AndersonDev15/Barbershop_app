package com.barber.project.Entity.enums;

public enum SlotStatus {
    AVAILABLE("DISPONIBLE"),
    OCCUPIED("OCUPADO"),
    UNAVAILABLE("NO DISPONIBLE"),
    BREAK("DESCANSO");

    private final String displayName;

    SlotStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}