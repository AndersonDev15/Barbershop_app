package com.barber.project.Scheduler;


import com.barber.project.barbershop.service.SubCategoryService;
import com.barber.project.reservation.dto.internal.ReminderEmailData;
import com.barber.project.reservation.dto.response.ServiceInfo;
import com.barber.project.reservation.entity.Reservation;
import com.barber.project.infrastructure.email.EmailService;
import com.barber.project.reservation.entity.ReservationItem;
import com.barber.project.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReservationReminderScheduler {
    private final ReservationService reservationService;
    private final SubCategoryService subCategoryService;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    @Scheduled(cron = "0 * * * * *")
    public void send20MinuteReminders() {

        List<Reservation> reservations = reservationService.findReservationsStartingIn20Minutes();

        for (Reservation r : reservations) {

            List<Long> subcategoryIds = r.getItems().stream()
                    .map(ReservationItem::getSubcategoryId)
                    .toList();

            List<ServiceInfo> services = subCategoryService.findAllById(subcategoryIds)
                    .stream()
                    .map(s -> new ServiceInfo(s.getId(), s.getName(), s.getDuration(), s.getPrice()))
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
            emailService.sendReminderBarber(data);
            System.out.println("Recordatorio enviado → Reserva ID: " + r.getId());
        }
    }
}

