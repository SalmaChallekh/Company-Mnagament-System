package org.pfe.cmsservices.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pfe.cmsservices.EmailException;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
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
            helper.setText(buildEmailContent(token), true);

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
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account Activation | Strategya2AI</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #f8f9fa;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
                            overflow: hidden;
                        }
                        .header {
                            background-color: #e91e63; /* Sakai rose/pink accent */
                            padding: 25px;
                            text-align: center;
                        }
                        .logo {
                            color: white;
                            font-size: 24px;
                            font-weight: 600;
                            text-decoration: none;
                        }
                        .content {
                            padding: 30px;
                        }
                        h1 {
                            color: #e91e63; /* Matching rose/pink */
                            margin-top: 0;
                            font-size: 22px;
                            font-weight: 600;
                        }
                        .button-container {
                            text-align: center;
                            margin: 25px 0;
                        }
                        .button {
                            display: inline-block;
                            background-color: #e91e63;
                            color: white !important;
                            text-decoration: none;
                            padding: 12px 30px;
                            border-radius: 4px;
                            font-weight: 500;
                            font-size: 16px;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 5px rgba(233, 30, 99, 0.2);
                        }
                        .button:hover {
                            background-color: #d81b60;
                            transform: translateY(-1px);
                            box-shadow: 0 4px 8px rgba(233, 30, 99, 0.3);
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            background-color: #fafafa;
                            font-size: 13px;
                            color: #666;
                            border-top: 1px solid #f0f0f0;
                        }
                        .divider {
                            border-top: 1px solid #f0f0f0;
                            margin: 25px 0;
                        }
                        .support {
                            color: #666;
                            font-size: 14px;
                            line-height: 1.5;
                        }
                        .highlight {
                            color: #e91e63;
                            font-weight: 500;
                        }
                        .welcome-text {
                            font-size: 16px;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <span class="logo">Strategya2AI</span>
                        </div>
                
                        <div class="content">
                            <h1>Welcome to  Strategya2AI</h1>
                            <p class="welcome-text">We're excited to have you join our  Team. To get started, please activate your account and set your own password:</p>
                
                            <div class="button-container">
                              <a href="http://localhost:4200/complete-registration?token=%s" class="button">Activate your account</a>
                
                
                            </div>
                
                            <p class="highlight">For your security, this activation link will expire in 24 hours.</p>
                
                            <div class="divider"></div>
                        </div>
                
                        <div class="footer">
                            <p>&copy; 2025 Strategya2AI Project. All rights reserved.</p>
                            <p style="margin-top: 8px;">
                                <a href="https://www.sakaiproject.org/privacy" style="color: #666; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                                <a href="https://www.sakaiproject.org/terms" style="color: #666; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                                <a href="https://www.sakaiproject.org/contact" style="color: #666; text-decoration: none; margin: 0 8px;">Contact Us</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(token);
    }
}


