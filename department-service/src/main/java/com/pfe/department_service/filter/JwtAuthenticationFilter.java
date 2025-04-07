package com.pfe.department_service.filter;

import com.pfe.department_service.security.JwtTokenProvider;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = null;
        try {
            token = jwtTokenProvider.resolveToken(request);

            if (token != null) {
                log.debug("Found token in request: {}", token);

                // If valid token is provided, set the SecurityContext
                if (jwtTokenProvider.validateToken(token)) {
                    Authentication authentication = jwtTokenProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info("Authenticated user '{}' with role {}", authentication.getName(), authentication.getAuthorities());
                } else {
                    log.warn("Invalid JWT token: {}", token);
                }
            } else {
                log.debug("No JWT token found in request.");
            }
        } catch (JwtException ex) {
            log.error("JWT validation error: {}", ex.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed: Invalid or expired token");
            return;
        } catch (Exception e) {
            log.error("Unexpected error in JwtAuthenticationFilter: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An unexpected error occurred");
            return;
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}


