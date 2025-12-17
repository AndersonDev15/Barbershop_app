package com.barber.project.Scheduler;

import com.barber.project.Dto.Response.Reservation.ReminderEmailData;
import com.barber.project.Dto.Response.Reservation.ServiceInfo;
import com.barber.project.Entity.Reservation;
import com.barber.project.Service.Auth.EmailService;
import com.barber.project.Service.Reservation.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReservationReminderScheduler {
    private final ReservationService reservationService;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    @Scheduled(cron = "0 * * * * *")
    public void send20MinuteReminders() {

        List<Reservation> reservations = reservationService.findReservationsStartingIn20Minutes();

        for (Reservation r : reservations) {

            List<ServiceInfo> services = r.getServices().stream()
                    .map(s -> ServiceInfo.builder()
                            .id(s.getId())
                            .name(s.getName())
                            .duration(s.getDuration())
                            .price(s.getPrice())
                            .build()
                    )
                    .toList();


            ReminderEmailData data = new ReminderEmailData(
                    r.getId(),
                    r.getClient().getUser().getFirstName(),
                    r.getBarber().getUser().getFirstName(),
                    services,
                    r.getDate().toString(),
                    r.getStartTime().toString(),
                    r.getClient().getUser().getEmail(),
                    r.getBarber().getUser().getEmail()
            );

            emailService.sendReminderClient(data);
            System.out.println("Recordatorio enviado → Reserva ID: " + r.getId());
        }
    }
}
