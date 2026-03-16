package com.barber.project.Util;

public class TimeUtils {
    public static final int BLOCK_MINUTES = 15;

    public static int calculateRequiredBlocks(int durationMinutes) {
        return (int) Math.ceil(durationMinutes / (double) BLOCK_MINUTES);
    }
}