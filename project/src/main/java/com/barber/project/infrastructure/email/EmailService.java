package com.barber.project.infrastructure.email;

import com.barber.project.barbershop.dto.internal.InvitationEmailData;
import com.barber.project.reservation.dto.internal.CancellationEmailData;
import com.barber.project.reservation.dto.internal.ReminderEmailData;
import com.barber.project.reservation.dto.response.ServiceInfo;
import com.barber.project.transaction.dto.internal.TransactionEmailData;
import com.barber.project.transaction.entity.enums.PaymentMethodStatus;
import com.barber.project.reservation.entity.enums.ReservationStatus;
import com.barber.project.reservation.dto.internal.ReservationEmailData;
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
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.slf4j.Logger;

@Service
@RequiredArgsConstructor
public class EmailService {
    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontenddUrl;

    private final Logger log = LoggerFactory.getLogger(EmailService.class);


    private void sendEmail(String to, String subject, String body) {
        try {
            Email from = new Email(fromEmail);
            Email toEmail = new Email(to);
            Content content = new Content("text/html", body);
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




    @Async
    public void sendBarberInvitation(InvitationEmailData data) {
        String subject = "Invitación para unirte como barbero - " + data.barberShopName();
        String invitationUrl = frontenddUrl + "/invitations/" + data.token();

        String body = String.format("""
        <!DOCTYPE html>
        <html lang="es">
        <body style="margin:0;padding:0;background-color:#0e0e0e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#0e0e0e;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="background-color:#1c1b1b;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);">
                  
                  <!-- Top accent -->
                  <tr>
                    <td style="background:linear-gradient(90deg,#f2ca50,#d4af37);height:4px;"></td>
                  </tr>
                  
                  <!-- Header -->
                  <tr>
                    <td style="padding:36px 40px 24px;text-align:center;">
                      <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#f2ca50;">Invitación Profesional</p>
                      <h1 style="margin:0;font-size:26px;font-weight:800;color:#e5e2e1;letter-spacing:-0.5px;">%s</h1>
                      <p style="margin:8px 0 0;font-size:13px;color:#99907c;">te invita a unirte como barbero</p>
                    </td>
                  </tr>
                  
                  <!-- Divider -->
                  <tr>
                    <td style="padding:0 40px;">
                      <div style="height:1px;background:rgba(255,255,255,0.05);"></div>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding:32px 40px;color:#d0c5af;font-size:15px;line-height:1.7;">
                      <p style="margin:0 0 16px;">Hola,</p>
                      <p style="margin:0 0 28px;">Has recibido una invitación para formar parte del equipo de <strong style="color:#e5e2e1;">%s</strong>. Haz clic en el botón para ver los detalles y aceptar.</p>
                      
                      <!-- CTA Button -->
                      <table width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding:8px 0 32px;">
                            <a href="%s" style="display:inline-block;background-color:#f2ca50;color:#3c2f00;font-size:14px;font-weight:800;text-decoration:none;padding:14px 40px;border-radius:999px;letter-spacing:0.05em;">
                              Ver Invitación
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Expiry info -->
                      <table width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color:#131313;border-radius:8px;padding:14px 18px;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right:10px;font-size:18px;">⏳</td>
                                <td>
                                  <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Esta invitación expira el</p>
                                  <p style="margin:2px 0 0;font-size:14px;font-weight:700;color:#e5e2e1;">%s</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 40px 32px;text-align:center;">
                      <p style="margin:0;font-size:11px;color:#4d4635;letter-spacing:0.05em;">
                        Si no esperabas esta invitación, puedes ignorar este correo.<br/>
                        © 2024 Sistema de Reservas
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """,
                data.barberShopName(),
                data.barberShopName(),
                invitationUrl,
                formatDateTime(data.expiresAt())
        );

        sendEmail(data.invitedEmail(), subject, body);
    }

    // ---- RESERVACION ---
    //agendar una cita (barbero)
    @Async
    public void sendNewReservationToBarber(ReservationEmailData data) {
        String subject = "Nueva reserva de " + data.clientName();

        String bodyContent = String.format("""
        <p style="margin:0 0 16px;">Hola <strong style="color:#e5e2e1;">%s</strong>,</p>
        <p style="margin:0 0 28px;">Tienes una nueva reserva confirmada.</p>
        
        <!-- Info card -->
        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Cliente</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            <p style="margin:4px 0 0;font-size:13px;color:#d0c5af;">%s</p>
          </td></tr>
        </table>
        
        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:24px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Fecha</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Hora</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
          </tr>
        </table>
        
        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:24px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Servicios</p>
            %s
            <div style="height:1px;background:rgba(255,255,255,0.05);margin:12px 0;"></div>
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Total &nbsp;
              <strong style="font-size:16px;color:#f2ca50;">$%s COP</strong>
            </p>
          </td></tr>
        </table>
        """,
                data.barberName(),
                data.clientName(), data.clientPhone(),
                data.date(), data.startTime(),
                formatServicesHtml(data.services()),
                formatPrice(data.totalPrice())
        );

        String html = buildEmailTemplate(
                "Nueva Reserva",
                data.barberShopName(),
                "Tienes una nueva cita",
                bodyContent
        );

        sendEmail(data.barberEmail(), subject, html);
    }
    //cita agendada cliente
    @Async
    public void sendReservationConfirmationToClient(ReservationEmailData data) {
        String subject = "Reserva confirmada #" + data.reservationId();

        String bodyContent = String.format("""
        <p style="margin:0 0 16px;">Hola <strong style="color:#e5e2e1;">%s</strong>,</p>
        <p style="margin:0 0 28px;">¡Tu reserva ha sido confirmada exitosamente!</p>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Barbero</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Ubicación</p>
              <p style="margin:0;font-size:13px;color:#d0c5af;">%s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Fecha</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Hora</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Servicios</p>
            %s
            <div style="height:1px;background:rgba(255,255,255,0.05);margin:12px 0;"></div>
            <p style="margin:0;font-size:13px;color:#99907c;">Total &nbsp;<strong style="font-size:16px;color:#f2ca50;">$%s COP</strong></p>
          </td></tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Número de reserva</p>
            <p style="margin:0;font-size:15px;font-weight:700;color:#f2ca50;">#%d</p>
          </td></tr>
        </table>

        <p style="margin:0;font-size:13px;color:#99907c;">• Llega 5 minutos antes &nbsp;•&nbsp; Trae este correo como comprobante &nbsp;•&nbsp; %s</p>
        """,
                data.clientName(),
                data.barberName(), data.barberShopAddress(),
                data.date(), data.startTime(),
                formatServicesHtml(data.services()),
                formatPrice(data.totalPrice()),
                data.reservationId(),
                getCancellationPolicy()
        );

        String html = buildEmailTemplate(
                data.barberShopName(), "Reserva Confirmada", "¡Te esperamos!", bodyContent
        );
        sendEmail(data.clientEmail(), subject, html);
    }

    //cambio de estado al los clientes
    @Async
    public void sendStatusChangeNotification(ReservationEmailData data,
                                             ReservationStatus oldStatus,
                                             ReservationStatus newStatus) {
        String subject = getStatusChangeSubject(newStatus, data.reservationId());

        String bodyContent = String.format("""
        <p style="margin:0 0 16px;">Hola <strong style="color:#e5e2e1;">%s</strong>,</p>
        <p style="margin:0 0 28px;">%s</p>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Estado anterior</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#d0c5af;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Estado nuevo</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#f2ca50;">%s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Fecha</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Hora</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Servicios</p>
            %s
            <div style="height:1px;background:rgba(255,255,255,0.05);margin:12px 0;"></div>
            <p style="margin:0;font-size:13px;color:#99907c;">Total &nbsp;<strong style="font-size:16px;color:#f2ca50;">$%s COP</strong></p>
          </td></tr>
        </table>

        <p style="margin:0 0 8px;font-size:13px;color:#d0c5af;">%s</p>
        """,
                data.clientName(),
                getStatusChangeMessage(newStatus),
                translateStatus(oldStatus), translateStatus(newStatus),
                data.date(), data.startTime(),
                formatServicesHtml(data.services()),
                formatPrice(data.totalPrice()),
                getAdditionalInstructions(newStatus)
        );

        String html = buildEmailTemplate(
                data.barberShopName(), "Actualización de Reserva", "#" + data.reservationId(), bodyContent
        );
        sendEmail(data.clientEmail(), subject, html);
    }


    //cancelacion de citas
    //informacion barbero
    @Async
    public void sendReservationCancellBarber(CancellationEmailData data) {
        String subject = "Reserva cancelada por el cliente #" + data.reservationId();

        String bodyContent = String.format("""
        <p style="margin:0 0 16px;">Hola <strong style="color:#e5e2e1;">%s</strong>,</p>
        <p style="margin:0 0 28px;">El cliente <strong style="color:#e5e2e1;">%s</strong> ha cancelado su reserva. Por favor ajusta tu agenda.</p>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Fecha</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Hora</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
          </tr>
        </table>
        """,
                data.barberName(), data.clientName(),
                data.date(), data.startTime()
        );

        String html = buildEmailTemplate(
                "BarberOS", "Reserva Cancelada", "Cliente: " + data.clientName(), bodyContent
        );
        sendEmail(data.barberEmail(), subject, html);
    }

    //para el cliente
    @Async
    public void sendReservationCancelClient(CancellationEmailData data) {
        String subject = "Cancelación de tu reserva #" + data.reservationId();

        String bodyContent = String.format("""
        <p style="margin:0 0 16px;">Hola <strong style="color:#e5e2e1;">%s</strong>,</p>
        <p style="margin:0 0 28px;">Tu reserva ha sido cancelada exitosamente.</p>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Barbero</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Fecha</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Estado anterior</p>
              <p style="margin:0;font-size:14px;color:#d0c5af;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Estado nuevo</p>
              <p style="margin:0;font-size:14px;font-weight:700;color:#ffb4ab;">CANCELADA</p>
            </td>
          </tr>
        </table>

        <p style="margin:0;font-size:13px;color:#d0c5af;">Si deseas volver a agendar, puedes hacerlo en cualquier momento.</p>
        """,
                data.clientName(),
                data.barberName(), data.date(),
                data.oldStatus()
        );

        String html = buildEmailTemplate(
                "BarberOS", "Reserva Cancelada", "#" + data.reservationId(), bodyContent
        );
        sendEmail(data.clientEmail(), subject, html);
    }


    // recordatorio de citas

    //cliente
    @Async
    public void sendReminderClient(ReminderEmailData data) {
        String subject = "Recordatorio de tu cita #" + data.reservationId();

        String bodyContent = String.format("""
        <p style="margin:0 0 16px;">Hola <strong style="color:#e5e2e1;">%s</strong>,</p>
        <p style="margin:0 0 28px;">Tu cita comienza en <strong style="color:#f2ca50;">20 minutos</strong>. ¡Prepárate!</p>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Barbero</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Hora</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#f2ca50;">%s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Servicios</p>
            %s
          </td></tr>
        </table>
        """,
                data.clientName(),
                data.barberName(), data.startTime(),
                formatServicesHtml(data.services())
        );

        String html = buildEmailTemplate(
                "BarberOS", "Recordatorio de Cita", data.date(), bodyContent
        );
        sendEmail(data.clientEmail(), subject, html);
    }

    //barbero
    @Async
    public void sendReminderBarber(ReminderEmailData data) {
        String subject = "Recordatorio: próxima cita en 20 minutos (#" + data.reservationId() + ")";

        String bodyContent = String.format("""
        <p style="margin:0 0 16px;">Hola <strong style="color:#e5e2e1;">%s</strong>,</p>
        <p style="margin:0 0 28px;">Tienes una cita en <strong style="color:#f2ca50;">20 minutos</strong>. Prepárate para atender.</p>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Cliente</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Hora</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#f2ca50;">%s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Servicios</p>
            %s
          </td></tr>
        </table>
        """,
                data.barberName(),
                data.clientName(), data.startTime(),
                formatServicesHtml(data.services())
        );

        String html = buildEmailTemplate(
                "BarberOS", "Próxima Cita", data.date(), bodyContent
        );
        sendEmail(data.barberEmail(), subject, html);
    }


    // ---- TRANSACCION ---
    //email enviado al cliente
    @Async
    public void sendTransactionConfirmationToClient(TransactionEmailData data) {
        String subject = "Confirmación de pago #" + data.transactionCode();

        String bodyContent = String.format("""
        <p style="margin:0 0 16px;">Hola <strong style="color:#e5e2e1;">%s</strong>,</p>
        <p style="margin:0 0 28px;">¡Tu pago ha sido procesado exitosamente!</p>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">ID Transacción</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#f2ca50;">#%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Método de pago</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Barbero</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Fecha servicio</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s %s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Servicios</p>
            %s
            <div style="height:1px;background:rgba(255,255,255,0.05);margin:12px 0;"></div>
            <table width="100%%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#99907c;">Subtotal</td>
                <td align="right" style="font-size:13px;color:#d0c5af;">$%s COP</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#99907c;padding-top:4px;">Propina</td>
                <td align="right" style="font-size:13px;color:#d0c5af;padding-top:4px;">$%s COP</td>
              </tr>
              <tr>
                <td style="font-size:15px;font-weight:700;color:#e5e2e1;padding-top:8px;">Total pagado</td>
                <td align="right" style="font-size:16px;font-weight:700;color:#f2ca50;padding-top:8px;">$%s COP</td>
              </tr>
            </table>
          </td></tr>
        </table>
        """,
                data.clientName(),
                data.transactionCode(), formatPaymentMethod(data.paymentMethod()),
                data.barberName(), data.reservationDate(), data.reservationTime(),
                formatServicesHtml(data.services()),
                formatPrice(data.totalAmount()),
                formatPrice(data.tipAmount()),
                formatPrice(data.totalAmount().add(data.tipAmount()))
        );

        String html = buildEmailTemplate(
                data.barberShopName(), "Pago Confirmado", "Reserva #" + data.reservationId(), bodyContent
        );
        sendEmail(data.clientEmail(), subject, html);
    }

    @Async
    public void sendTransactionNotificationToBarber(TransactionEmailData data) {
        String subject = "Pago recibido - Reserva #" + data.reservationId();

        String bodyContent = String.format("""
        <p style="margin:0 0 16px;">Hola <strong style="color:#e5e2e1;">%s</strong>,</p>
        <p style="margin:0 0 28px;">Se ha procesado el pago de la siguiente reserva.</p>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Cliente</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
              <p style="margin:4px 0 0;font-size:13px;color:#d0c5af;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Fecha servicio</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s %s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr><td style="padding:18px 20px;">
            <table width="100%%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#99907c;">Total transacción</td>
                <td align="right" style="font-size:13px;color:#d0c5af;">$%s COP</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#99907c;padding-top:4px;">Propina</td>
                <td align="right" style="font-size:13px;color:#d0c5af;padding-top:4px;">$%s COP</td>
              </tr>
              <tr>
                <td style="font-size:15px;font-weight:700;color:#e5e2e1;padding-top:8px;">Tu comisión</td>
                <td align="right" style="font-size:16px;font-weight:700;color:#f2ca50;padding-top:8px;">$%s COP</td>
              </tr>
            </table>
          </td></tr>
        </table>
        """,
                data.barberName(),
                data.clientName(), data.clientPhone(),
                data.reservationDate(), data.reservationTime(),
                formatPrice(data.totalAmount()),
                formatPrice(data.tipAmount()),
                formatPrice(data.barberCommission())
        );

        String html = buildEmailTemplate(
                data.barberShopName(), "Pago Recibido", "#" + data.transactionCode(), bodyContent
        );
        sendEmail(data.barberEmail(), subject, html);
    }

    //email para la barberia
    @Async
    public void sendTransactionNotificationToBarberShop(TransactionEmailData data) {
        String subject = "Nuevo ingreso registrado - Transacción #" + data.transactionCode();

        String bodyContent = String.format("""
        <p style="margin:0 0 28px;">Se ha registrado un nuevo ingreso en <strong style="color:#e5e2e1;">%s</strong>.</p>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Barbero</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
            </td>
            <td style="padding:18px 20px;width:50%%;">
              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Cliente</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#e5e2e1;">%s</p>
              <p style="margin:4px 0 0;font-size:13px;color:#d0c5af;">%s</p>
            </td>
          </tr>
        </table>

        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#131313;border-radius:8px;margin-bottom:16px;">
          <tr><td style="padding:18px 20px;">
            <p style="margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Resumen financiero</p>
            <table width="100%%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-size:13px;color:#99907c;">Total recibido</td>
                <td align="right" style="font-size:13px;color:#d0c5af;">$%s COP</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#99907c;padding-top:4px;">Comisión barbero</td>
                <td align="right" style="font-size:13px;color:#d0c5af;padding-top:4px;">$%s COP</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#99907c;padding-top:4px;">Propina</td>
                <td align="right" style="font-size:13px;color:#d0c5af;padding-top:4px;">$%s COP</td>
              </tr>
              <tr>
                <td style="font-size:15px;font-weight:700;color:#e5e2e1;padding-top:8px;">Ingreso barbería</td>
                <td align="right" style="font-size:16px;font-weight:700;color:#f2ca50;padding-top:8px;">$%s COP</td>
              </tr>
            </table>
          </td></tr>
        </table>
        """,
                data.barberShopName(),
                data.barberName(),
                data.clientName(), data.clientPhone(),
                formatPrice(data.totalAmount()),
                formatPrice(data.barberCommission()),
                formatPrice(data.tipAmount()),
                formatPrice(data.barberShopShare())
        );

        String html = buildEmailTemplate(
                data.barberShopName(), "Nuevo Ingreso", formatDateTime(data.transactionDate()), bodyContent
        );
        sendEmail(data.barberShopEmail(), subject, html);
    }




    private String buildEmailTemplate(String headerLabel, String title, String subtitle, String bodyContent) {
        return String.format("""
        <!DOCTYPE html>
        <html lang="es">
        <body style="margin:0;padding:0;background-color:#0e0e0e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#0e0e0e;padding:40px 0;">
            <tr><td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background-color:#1c1b1b;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);">
                <tr><td style="background:linear-gradient(90deg,#f2ca50,#d4af37);height:4px;"></td></tr>
                <tr>
                  <td style="padding:36px 40px 24px;text-align:center;">
                    <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#f2ca50;">%s</p>
                    <h1 style="margin:0;font-size:26px;font-weight:800;color:#e5e2e1;letter-spacing:-0.5px;">%s</h1>
                    <p style="margin:8px 0 0;font-size:13px;color:#99907c;">%s</p>
                  </td>
                </tr>
                <tr><td style="padding:0 40px;"><div style="height:1px;background:rgba(255,255,255,0.05);"></div></td></tr>
                <tr>
                  <td style="padding:32px 40px;color:#d0c5af;font-size:15px;line-height:1.7;">
                    %s
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 40px 32px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#4d4635;letter-spacing:0.05em;">
                      Si tienes dudas, contacta a tu barbería.<br/>© 2026 BarberOS
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
        """, headerLabel, title, subtitle, bodyContent);
    }
    private String formatServicesHtml(List<ServiceInfo> services) {
        if (services == null || services.isEmpty()) {
            return "<p style=\"margin:0;font-size:14px;color:#d0c5af;\">Ningún servicio especificado</p>";
        }

        return services.stream()
                .map(s -> String.format(
                        """
                        <table width="100%%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
                          <tr>
                            <td style="font-size:14px;color:#d0c5af;">• %s <span style="font-size:12px;color:#99907c;">(%d min)</span></td>
                            <td align="right" style="font-size:14px;font-weight:600;color:#e5e2e1;">$%s COP</td>
                          </tr>
                        </table>
                        """,
                        s.name(),
                        s.duration(),
                        formatPrice(s.price())
                ))
                .collect(Collectors.joining());
    }

    private String formatPrice(BigDecimal price) {
        return NumberFormat.getNumberInstance(new Locale("es", "CO")).format(price);
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

    //convertir los estados a un string
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
