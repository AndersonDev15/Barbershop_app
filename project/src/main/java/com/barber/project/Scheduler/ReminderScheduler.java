package com.barber.project.Scheduler;


import com.barber.project.reservation.scheduler.ReminderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final ReminderService reminderService;

    @Scheduled(cron = "0 * * * * *")
    public void send20MinuteReminders() {
        try {
            reminderService.processReminders();
        } catch (Exception e) {
            log.error("Error en scheduler de recordatorios", e);
        }
    }
}