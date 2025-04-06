package org.pfe.cmsservices.api_gateway.config;

import org.pfe.cmsservices.api_gateway.filter.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.filter.GlobalFilter;

@Configuration
public class GatewayFilterConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public GatewayFilterConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public GlobalFilter jwtGlobalFilter() {
        return (exchange, chain) -> jwtAuthFilter.filter(exchange, chain);
    }
}