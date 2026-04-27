package com.auth.server.infrastructure.email;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
public class EmailService {

    @Value("${app.frontend-url}")
    private String frontedUrl;

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @Value("${sendgrid.from-name}")
    private String fromName;

    @Async
    public void sendVerificationEmail(String to, String token) {
        String subject = "Verificación de correo - Barbería";
        String verificationUrl = frontedUrl + "/verify-email?token=" + token;

        String bodyContent = """
                <p style="margin:0 0 16px;">Hola,</p>
                <p style="margin:0 0 28px;">Gracias por registrarte. Para activar tu cuenta haz clic en el botón de abajo.</p>

                <table width="100%%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:8px 0 32px;">
                      <a href="%s"
                         style="display:inline-block;background-color:#f2ca50;color:#3c2f00;font-size:14px;font-weight:800;text-decoration:none;padding:14px 40px;border-radius:999px;letter-spacing:0.05em;">
                        Verificar correo
                      </a>
                    </td>
                  </tr>
                </table>

                <table width="100%%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#131313;border-radius:8px;padding:14px 18px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-right:10px;font-size:18px;">⏳</td>
                          <td>
                            <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Este enlace expira en</p>
                            <p style="margin:2px 0 0;font-size:14px;font-weight:700;color:#e5e2e1;">30 minutos</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                """.formatted(verificationUrl);

        String html = buildEmailTemplate(
                "Activación de cuenta",
                "Verifica tu correo",
                "Un paso más para comenzar",
                bodyContent
        );

        sendEmail(to, subject, html);
    }

    @Async
    public void sendOtpPasswordReset(String to, String otp) {
        String subject = "Recuperación de contraseña - Barbería";

        String bodyContent = """
                <p style="margin:0 0 16px;">Hola,</p>
                <p style="margin:0 0 28px;">Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código OTP:</p>

                <table width="100%%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                  <tr>
                    <td align="center"
                        style="background-color:#131313;border-radius:12px;padding:28px 20px;border:1px solid rgba(242,202,80,0.2);">
                      <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#99907c;">
                        Código de verificación
                      </p>
                      <p style="margin:0;font-size:36px;font-weight:800;letter-spacing:0.15em;color:#f2ca50;">%s</p>
                    </td>
                  </tr>
                </table>

                <table width="100%%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#131313;border-radius:8px;padding:14px 18px;">
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-right:10px;font-size:18px;">⏳</td>
                          <td>
                            <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#99907c;">Este código expira en</p>
                            <p style="margin:2px 0 0;font-size:14px;font-weight:700;color:#e5e2e1;">5 minutos</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin:24px 0 0;font-size:12px;color:#4d4635;">
                  Si no solicitaste este código, puedes ignorar este mensaje.
                </p>
                """.formatted(otp);

        String html = buildEmailTemplate(
                "Seguridad de cuenta",
                "Restablece tu contraseña",
                "Código de un solo uso",
                bodyContent
        );

        sendEmail(to, subject, html);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private String buildEmailTemplate(String headerLabel, String title, String subtitle, String bodyContent) {
        return """
                <!DOCTYPE html>
                <html lang="es">
                <body style="margin:0;padding:0;background-color:#0e0e0e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#0e0e0e;padding:40px 0;">
                    <tr><td align="center">
                      <table width="560" cellpadding="0" cellspacing="0"
                             style="background-color:#1c1b1b;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.05);">

                        <!-- Accent bar -->
                        <tr><td style="background:linear-gradient(90deg,#f2ca50,#d4af37);height:4px;"></td></tr>

                        <!-- Header -->
                        <tr>
                          <td style="padding:36px 40px 24px;text-align:center;">
                            <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#f2ca50;">%s</p>
                            <h1 style="margin:0;font-size:26px;font-weight:800;color:#e5e2e1;letter-spacing:-0.5px;">%s</h1>
                            <p style="margin:8px 0 0;font-size:13px;color:#99907c;">%s</p>
                          </td>
                        </tr>

                        <!-- Divider -->
                        <tr><td style="padding:0 40px;"><div style="height:1px;background:rgba(255,255,255,0.05);"></div></td></tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding:32px 40px;color:#d0c5af;font-size:15px;line-height:1.7;">
                            %s
                          </td>
                        </tr>

                        <!-- Footer -->
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
                """.formatted(headerLabel, title, subtitle, bodyContent);
    }

    private void sendEmail(String to, String subject, String body) {
        Email from = new Email(fromEmail, fromName);
        Email toEmail = new Email(to);
        Content content = new Content("text/html", body);  // ← text/html
        Mail mail = new Mail(from, subject, toEmail, content);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            log.info("Email enviado a {} — status: {}", to, response.getStatusCode());
        } catch (IOException e) {
            log.error("Error enviando email a {}: {}", to, e.getMessage());
        }
    }
}
