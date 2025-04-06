package org.pfe.cmsservices.service;

import lombok.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    //@Value("${frontend.base-url:http://localhost:4200}") // fallback for now
    private String frontendBaseUrl;

    public void sendVerificationEmail(String email, String token) {
        String link = frontendBaseUrl + "/verify?token=" + token;
        String message = "Hi! Please click to activate your account:\n" + link;

        // Simulate sending
        System.out.println("Sending email to " + email);
        System.out.println("Message: " + message);
    }
}


