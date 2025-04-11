package org.pfe.cmsservices.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.pfe.cmsservices.EmailException;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendActivationEmail(String to, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message);
            helper.setTo(to);
            helper.setSubject("Account Activation");
            helper.setText(buildEmailContent(token), true); // HTML content

            mailSender.send(message);
            log.info("Activation email sent to {}", to);

        } catch (MailAuthenticationException e) {
            log.error("SMTP authentication failed", e);
            throw new EmailException("Email service authentication failed");

        } catch (MailSendException e) {
            log.error("Email sending failed", e);
            throw new EmailException("Failed to send activation email");

        } catch (MessagingException e) {
            log.error("Email composition error", e);
            throw new EmailException("Invalid email composition");
        }
    }

    private String buildEmailContent(String token) {
        return """
        <html>
            <body>
                <p>Click to activate your account:</p>
                <a href="http://localhost:4001/api/auth/activate?token=%s">Activate</a>
            </body>
        </html>
        """.formatted(token);
    }

}
/*@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendActivationEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Complete Your Registration");
        message.setText("Set your password: http://yourapp.com/activate?token=" + token);
        mailSender.send(message);
    }
}*/

