package org.pfe.cmsservices.api_gateway.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;

@Component
public class JwtTokenProvider {

    private final Key secretKey;
    private final long validityInMilliseconds = 1000L * 60 * 60 * 24; // 24 hours

    public JwtTokenProvider(@Value("${jwt.secret}") String secret) {
        if (secret == null || secret.length() < 64) {
            throw new IllegalArgumentException("JWT secret key must be at least 64 characters long");
        }
        this.secretKey = new SecretKeySpec(secret.getBytes(), SignatureAlgorithm.HS512.getJcaName());
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException ex) {
            // Handle expired token separately
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            // Handle other JWT exceptions
            return false;
        }
    }
}