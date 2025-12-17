package com.barber.project.Util;

import lombok.AllArgsConstructor;

import java.time.LocalTime;

@AllArgsConstructor
public class TimeInterval {
    private final LocalTime start;
    private final LocalTime end;

    public boolean overlaps(LocalTime start, LocalTime end){
        return start.isBefore(end) && end.isAfter(start);
    }
}
