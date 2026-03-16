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


    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${sendgrid.api-key}")
    private String apiKey;

    @Value("${sendgrid.from-email}")
    private String fromEmail;

    @Value("${sendgrid.from-name}")
    private String fromName;

    @Async
    public void sendVerificationEmail(String to, String token) {
        String subject = "Verificación de correo - Barbería";
        String verificationUrl = baseUrl + "/api/auth/verify-email?token=" + token;

        String body = """
                Hola 👋
                
                Gracias por registrarte.
                
                Para verificar tu correo, haz clic aquí:
                """ + verificationUrl + """
                
                Este enlace expira en 30 minutos.
                
                Barbería App
                """;

        sendEmail(to, subject, body);
    }

    @Async
    public void sendOtpPasswordReset(String to, String otp) {
        String subject = "Recuperación de contraseña - Barbería";

        String body = """
                Hola,
                
                Recibimos una solicitud para restablecer tu contraseña.
                
                Tu código OTP es:
                
                """ + otp + """
                
                Este código expira en 5 minutos.
                
                Si no fuiste tú, ignora este mensaje.
                
                Barbería App
                """;

        sendEmail(to, subject, body);
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private void sendEmail(String to, String subject, String body) {
        Email from = new Email(fromEmail, fromName);
        Email toEmail = new Email(to);
        Content content = new Content("text/plain", body);
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

