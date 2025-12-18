package com.barber.project.Service.Auth;

import com.barber.project.Dto.Response.Reservation.CancellationEmailData;
import com.barber.project.Dto.Response.Reservation.ReminderEmailData;
import com.barber.project.Dto.Response.Reservation.ServiceInfo;
import com.barber.project.Dto.Response.Transaction.TransactionEmailData;
import com.barber.project.Dto.Validations.ServiceCalculationResult;
import com.barber.project.Entity.*;
import com.barber.project.Entity.enums.PaymentMethodStatus;
import com.barber.project.Entity.enums.ReservationStatus;
import com.barber.project.Dto.Response.Reservation.ReservationEmailData;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class EmailService {
    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from}")
    private String fromEmail;

    private final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Async
    public void sendEmail(String to, String subject, String body) {
        try {
            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);
            Content content = new Content("text/plain", body);
            Mail mail = new Mail(from, subject, toEmail, content);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                log.error("Error enviando correo a {}: {}", to, response.getBody());
            } else {
                log.info("Correo enviado a {}", to);
            }

        } catch (Exception e) {
            log.error("Excepción al enviar correo a {}: {}", to, e.getMessage(), e);
        }
    }

    // ---- RESERVACION ---
    //agendar una cita (barbero)
    public void sendNewReservationToBarber(ReservationEmailData data){

        String subject = "Nueva reserva de " + data.clientName();

        String servicesText = formatServicesListWithPrices(data.services());

        String body = String.format(
                """
                Hola %s,
                
                Tienes una nueva reserva.
                
                Cliente: %s
                Teléfono: %s
                
                Fecha: %s
                Hora: %s
                Duración estimada: %d minutos
                
                Servicios:
                %s
                
                Total: $%.2f
                
                Barbería:
                %s
                Dirección: %s
                
                Saludos,
                Sistema de Reservas
                """,
                data.barberName(),
                data.clientName(),
                data.clientPhone(),
                data.date(),
                data.startTime(),
                data.totalDuration(),
                servicesText,
                data.totalPrice(),
                data.barberShopName(),
                data.barberShopAddress()
        );

        sendEmail(data.barberEmail(), subject, body);
    }
    //cita agendada cliente
    public void sendReservationConfirmationToClient(ReservationEmailData data) {
        String subject = "Nueva Reserva de " + data.clientName();
        //formatear la lista de servicios
        String serviceList = formatServicesListWithPrices(data.services());
        String cancellationPolicy = getCancellationPolicy();
        String body = String.format(
                """
                Hola %s,
                
                ¡Tu reserva ha sido confirmada exitosamente!
                
                Barbero: %s
                Fecha: %s
                Hora: %s
                Duración estimada: %d minutos
                Ubicación: %s
                
                Servicios agendados:
                %s
                
                Total a pagar: $%.2f
                
                Información de contacto del barbero:
                %s
                Email: %s
                
                Instrucciones importantes:
                1. Llega 5 minutos antes
                2. Trae este correo como comprobante
                3. %s
                
                Número de reserva: #%d
                
                ¡Te esperamos!
                
                Equipo de %s
                """,
                data.clientName(),
                data.barberName(),
                data.date(),
                data.startTime(),
                data.totalDuration(),
                data.barberShopAddress(),
                serviceList,
                data.totalPrice(),
                data.barberName(),
                data.barberEmail(),
                cancellationPolicy,
                data.reservationId(),
                data.barberShopName()


        );
        //enviar email

        sendEmail(data.clientEmail(),subject,body);
    }

    //cambio de estado al los clientes
    public void sendStatusChangeNotification(ReservationEmailData data,
                                             ReservationStatus oldStatus,
                                             ReservationStatus newStatus) {



        String subject = getStatusChangeSubject(newStatus, data.reservationId());
        String statusMessage = getStatusChangeMessage(newStatus);
        String instructions = getAdditionalInstructions(newStatus);
        String serviceList = formatServicesListWithPrices(data.services());

        String body = String.format(
                """
                Hola %s,
                
                %s
                
                Detalles de la reserva:
                - Número: #%d
                - Fecha: %s
                - Hora: %s
                
                Servicios:
                %s
                
                Total: $%.2f
                Duración estimada: %d min
                
                Cambio de estado:
                - Estado anterior: %s
                - Estado nuevo: %s
                
                %s
                
                Barbero:
                - %s
                - Email: %s
                
                Barbería:
                - %s
                - Dirección: %s
                
                Gracias por usar nuestra plataforma.
                """,

                data.clientName(),
                statusMessage,
                data.reservationId(),
                data.date(),
                data.startTime(),
                serviceList,
                data.totalPrice(),
                data.totalDuration(),
                translateStatus(oldStatus),
                translateStatus(newStatus),
                instructions,
                data.barberName(),
                data.barberEmail(),
                data.barberShopName(),
                data.barberShopAddress()
        );

        sendEmail(data.clientEmail(), subject, body);
    }


    //cancelacion de citas
    //informacion barbero
    public void sendReservationCancellBarber(CancellationEmailData data){


        String subject = "Reserva cancelada por el cliente #" +data.reservationId();
        String body = String.format(
                "Hola %s,\n\n" +
                        "El cliente %s ha cancelado su reserva.\n\n" +
                        "Detalles de la reserva: \n" +
                        "- Fecha: %s\n" +
                        "- Hora: %s\n" +
                        "- Cliente: %s\n\n" +
                        "Por favor ajusta tu agenda.\n\n" +
                        "Saludos,\n" +
                        "Sistema de Reservas",
                data.barberName(),
                data.clientName(),
                data.date(),
                data.startTime(),
                data.clientName()

        );
        sendEmail(data.barberEmail(), subject, body);
    }

    //para el cliente
    public void sendReservationCancelClient(CancellationEmailData data){


        String subject = "Cancelacion de tu reserva # " + data.reservationId();
        String body = String.format(
                "Hola %s,\n\n" +
                "Tu reserva ha sido cancelada exitosamente.\n\n" +
                        "Detalles de la reserva cancelada:\n" +
                        "- Barbero: %s\n" +
                        "- Fecha: %s\n" +
                        "- Hora: %s\n" +
                        "- Estado anterior: %s\n" +
                        "- Estado nuevo: CANCELADA\n\n" +
                        "Si deseas volver a agendar, puedes hacerlo en cualquier momento.\n\n" +
                        "Saludos,\n",

                data.clientName(),
                data.barberName(),
                data.date(),
                data.startTime(),
                data.oldStatus()

        );
        sendEmail(data.clientEmail(),subject,body);
    }


    // recordatorio de citas

    //cliente
    public void sendReminderClient(ReminderEmailData data) {

        String servicesFormatted = formatServicesListWithPrices(data.services());

        String subject = "Recordatorio de tu cita #" + data.reservationId();

        String body = String.format(
                "Hola %s,\n\n" +
                        "Este es un recordatorio de tu cita próxima en 20 minutos.\n\n" +
                        "Detalles de la reserva:\n" +
                        "%s\n\n" +
                        "- Barbero: %s\n" +
                        "- Fecha: %s\n" +
                        "- Hora: %s\n\n" +
                        "Te esperamos.\n\n" +
                        "Saludos,\n" +
                        "Sistema de Reservas",
                data.clientName(),
                servicesFormatted,
                data.barberName(),
                data.date(),
                data.startTime()
        );

        sendEmail(data.clientEmail(), subject, body);
    }

    //barbero
    public void sendReminderBarber(ReminderEmailData data) {

        String servicesFormatted = formatServicesListWithPrices(data.services());

        String subject = "Recordatorio: próxima cita en 20 minutos (#" + data.reservationId() + ")";

        String body = String.format(
                "Hola %s,\n\n" +
                        "Tienes una cita proxima en 20 minutos.\n\n" +
                        "Detalles de la reserva:\n" +
                        "- Cliente: %s\n" +
                        "%s\n" +
                        "- Fecha: %s\n" +
                        "- Hora: %s\n\n" +
                        "Prepárate para atender.\n\n" +
                        "Saludos,\n" +
                        "Sistema de Reservas",
                data.barberName(),
                data.clientName(),
                servicesFormatted,
                data.date(),
                data.startTime()
        );

        sendEmail(data.barberEmail(), subject, body);
    }


    // ---- TRANSACCION ---
    //email enviado al cliente
    public void sendTransactionConfirmationToClient(TransactionEmailData data){
        String subject = "Confirmacion de pago # " + data.transactionCode();
        String serviceList = formatServicesListWithPrices(data.services());
        String formattedDate = formatDateTime(data.transactionDate());

        String body = String.format("""
            Hola %s,
            
            ¡Tu pago ha sido procesado exitosamente!
            
            **Detalles del pago:**
            - ID de transacción: #%s
            - Fecha y hora: %s
            - Método de pago: %s
            
            **Información del servicio:**
            - Barbero: %s
            - Barbería: %s
            - Dirección: %s
            - Teléfono: %s
            
            **Servicios:**
            %s
            
            **Desglose del pago:**
            - Subtotal servicios: $%.2f
            - Propina: $%.2f
            - **Total pagado: $%.2f**
            
            **Detalles de la reserva:**
            - ID de reserva: #%d
            - Fecha: %s
            - Hora: %s
            
            **Para consultas:**
            - Barbería: %s
            - Soporte: soporte@barberapp.com
            
            ¡Gracias por tu preferencia!
            
            Atentamente,
            El equipo de %s
            """,
                data.clientName(),
                data.transactionCode(),
                formattedDate,
                formatPaymentMethod(data.paymentMethod()),
                data.barberName(),
                data.barberShopName(),
                data.barberShopAddress(),
                data.barberShopPhone(),
                serviceList,
                data.totalAmount(),
                data.tipAmount(),
                data.totalAmount().add(data.tipAmount()),
                data.reservationId(),
                data.reservationDate(),
                data.reservationTime(),
                data.barberShopPhone(),
                data.barberShopName());

        sendEmail(data.clientEmail(),subject,body);
    }

    public void sendTransactionNotificationToBarber(TransactionEmailData data){
        String subject = "Pago recibido - Reserva # " + data.reservationId();
        String body = String.format("""
            Hola %s,
            
            Se ha procesado el pago de la siguiente reserva:
            
            **Cliente:**
            - Nombre: %s
            - Teléfono: %s
            - Email: %s
            
            **Detalles del pago:**
            - ID de transacción: #%s
            - Fecha: %s
            - Método: %s
            - Total: $%.2f
            - **Tu comisión: $%.2f**
            - Propina: $%.2f
            
            **Detalles del servicio:**
            - Fecha: %s
            - Hora: %s
            
            **Ubicación:**
            - Barbería: %s
            - Dirección: %s
            
            
            Saludos,
            Sistema de Pagos - %s
            """,
                data.barberName(),
                data.clientName(),
                data.clientPhone(),
                data.clientEmail(),
                data.transactionCode(),
                formatDate(data.transactionDate().toLocalDate()),
                formatPaymentMethod(data.paymentMethod()),
                data.totalAmount(),
                data.barberCommission(),
                data.tipAmount(),
                data.reservationDate(),
                data.reservationTime(),
                data.barberShopName(),
                data.barberShopAddress(),
                data.barberShopName());

        sendEmail(data.barberEmail(),subject,body);
    }

    //email para la barberia
    public void sendTransactionNotificationToBarberShop(TransactionEmailData data){
        String subject = "Nuevo ingreso registrado - Transacción #" + data.transactionCode();

        String body = String.format("""
            ADMINISTRACIÓN - %s
            
            Se ha registrado un nuevo ingreso:
            
            **Resumen financiero:**
            - ID de transacción: #%s
            - Fecha: %s
            - Total recibido: $%.2f
            - **Ingreso barbería: $%.2f**
            - Comisión barbero: $%.2f
            - Propina: $%.2f
            - Método: %s
            
            **Detalles del servicio:**
            - Barbero: %s
            - Cliente: %s
            - Teléfono cliente: %s
            - Reserva: #%d
            - Fecha servicio: %s
            - Hora: %s
            
            
            
            Saludos,
            Sistema de Administración
            """,
                data.barberShopName(),
                data.transactionCode(),
                formatDateTime(data.transactionDate()),
                data.totalAmount(),
                data.barberShopShare(),
                data.barberCommission(),
                data.tipAmount(),
                formatPaymentMethod(data.paymentMethod()),
                data.barberName(),
                data.clientName(),
                data.clientPhone(),
                data.reservationId(),
                data.reservationDate(),
                data.reservationTime());
        sendEmail(data.barberShopEmail(),subject,body);
    }




    private String formatServicesListWithPrices(List<ServiceInfo> services) {
        if (services == null || services.isEmpty()) {
            return "Ningún servicio especificado";
        }

        return services.stream()
                .map(s -> String.format(
                        "- %s (%d min) - $%.2f",
                        s.getName(),
                        s.getDuration(),
                        s.getPrice()
                ))
                .collect(Collectors.joining("\n"));
    }

    private String getCancellationPolicy() {
        return "Para cancelar, por favor avisa con al menos 20 minutos de anticipación.";
    }

    private String formatDateTime(LocalDateTime dateTime){
        DateTimeFormatter format = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return dateTime.format(format);
    }

    private String formatDate(LocalDate date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return date.format(formatter);
    }
    private String formatPaymentMethod(PaymentMethodStatus method) {
        if (method == null) return "No especificado";
        return method.name().charAt(0) + method.name().substring(1).toLowerCase();
    }

    //cambiar el subject dependiendo el estado
    private String getStatusChangeSubject(ReservationStatus newStatus,Long reservationId){
        return switch (newStatus){
            case EN_CURSO -> "Tu reserva #" + reservationId + "Ha comenzado";
            case COMPLETADA -> "¡Servicio Completada! Reserva #" + reservationId;
            case CANCELADA -> "Reserva #" + reservationId + "Cancelada";
            default -> "Actualización de estado - Reserva #" + reservationId;
        };
    }

    //mensaje segun el estado
    private String getStatusChangeMessage( ReservationStatus newStatus){
        return switch (newStatus) {
            case EN_CURSO ->
                    "Tu servicio ha comenzado. El barbero está listo para atenderte. " +
                            "Por favor, dirígete a tu barbero asignado.";

            case COMPLETADA ->
                    "¡Tu servicio ha sido completado exitosamente! " +
                            "Esperamos que hayas tenido una excelente experiencia. " +
                            "¡Gracias por confiar en nosotros!";

            case CANCELADA ->
                    "Lamentamos informarte que tu reserva ha sido cancelada. " +
                            "Si tienes alguna pregunta o deseas reagendar, por favor contacta al barbero.";

            default ->
                    "El estado de tu reserva ha sido actualizado.";
        };
    }

    //instrucciones
    private String getAdditionalInstructions(ReservationStatus newStatus){
        return switch (newStatus) {
            case EN_CURSO ->
                    "**Instrucciones:**\n" +
                            "- Presenta este correo al barbero\n" +
                            "- Asegúrate de estar en la ubicación indicada\n" +
                            "- Disfruta de tu servicio";

            case COMPLETADA ->
                    "**¿Cómo estuvo tu experiencia?**\n" +
                            "Nos encantaría saber tu opinión. Responde a este correo con tu feedback.";

            case CANCELADA ->
                    "**¿Deseas reagendar?**\n" +
                            "Puedes crear una nueva reserva a través de nuestra app o sitio web.";

            default -> "";
        };
    }

    //onvertir los estados a un string
    private String translateStatus(ReservationStatus status){
        return switch (status){
            case CONFIRMADA -> "CONFIRMADA";
            case EN_CURSO -> "EN CURSO";
            case COMPLETADA -> "COMPLETADA";
            case CANCELADA -> "CANCELADA";
            default -> status.toString();
        };
    }

}
