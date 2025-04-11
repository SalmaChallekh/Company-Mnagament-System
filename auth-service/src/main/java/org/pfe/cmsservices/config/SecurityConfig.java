package org.pfe.cmsservices.config;

import org.pfe.cmsservices.filter.JwtAuthenticationFilter;
import org.pfe.cmsservices.security.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtTokenProvider);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // Disable CSRF as we're using JWT for security
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (no token required)
                        .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/validateToken","/api/auth/activate").permitAll()
                        // Private endpoints (token validation required)
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        //.requestMatchers("/api/auth/activate").permitAll()
                        .requestMatchers("/api/user/**").hasRole("USER")
                        // Default rule: secured for any other routes
                        .anyRequest().authenticated()
                )
                // No sessions; API is stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Add the JWT filter only for endpoints requiring token validation
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}