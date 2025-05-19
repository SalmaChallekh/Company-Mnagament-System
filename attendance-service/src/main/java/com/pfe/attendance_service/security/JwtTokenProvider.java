package com.pfe.attendance_service.security;

import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.List;

@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);
    private final Key secretKey;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret) {
        log.info("Initializing JwtTokenProvider with secret: {}",
                secret != null ? "*****" + secret.substring(secret.length() - 4) : "NULL");

        if (secret == null || secret.length() < 64) {
            String errorMsg = "JWT secret key must be at least 64 characters";
            log.error(errorMsg);
            throw new IllegalArgumentException(errorMsg);
        }

        this.secretKey = new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                SignatureAlgorithm.HS512.getJcaName()
        );
        log.info("JWT secret key initialized successfully");
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            log.debug("Token validation successful");
            return true;
        } catch (ExpiredJwtException ex) {
            log.warn("Expired JWT token: {}", ex.getMessage());
            throw new JwtException("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.warn("Unsupported JWT token: {}", ex.getMessage());
            throw new JwtException("Unsupported JWT token");
        } catch (MalformedJwtException ex) {
            log.warn("Invalid JWT token: {}", ex.getMessage());
            throw new JwtException("Invalid JWT token");
        } catch (SignatureException ex) {
            log.warn("JWT signature mismatch: {}", ex.getMessage());
            throw new JwtException("JWT signature mismatch");
        } catch (IllegalArgumentException ex) {
            log.warn("JWT claims string is empty: {}", ex.getMessage());
            throw new JwtException("JWT claims string is empty");
        }
    }

    public Authentication getAuthentication(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();
            String role = claims.get("ROLE", String.class);

            if (username == null || role == null) {
                log.warn("Invalid JWT claims - missing username or role");
                throw new JwtException("Invalid JWT claims");
            }

            log.debug("Authenticating user: {} with role: {}", username, role);
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

            return new UsernamePasswordAuthenticationToken(username, null, authorities);
        } catch (JwtException ex) {
            log.error("Failed to get authentication from token: {}", ex.getMessage());
            throw ex;
        }
    }
}