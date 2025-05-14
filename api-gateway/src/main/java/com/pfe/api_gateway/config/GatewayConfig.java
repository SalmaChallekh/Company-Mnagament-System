package com.pfe.api_gateway.config;

import com.pfe.api_gateway.filters.JwtAuthFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
    @Configuration
    public class GatewayConfig {

        @Bean
        public RouteLocator customRouteLocator(RouteLocatorBuilder builder, JwtAuthFilter jwtFilter) {
            return builder.routes()
                    .route("auth-service", r -> r.path("/api/auth/**")
                            .filters(f -> f
                                    .removeRequestHeader("Cookie")
                                    .preserveHostHeader())
                            .uri("lb://cms-services"))

                    .route("department-service", r -> r.path("/api/admin/departments/**")
                            .filters(f -> f
                                    .filter(jwtFilter)
                                    .circuitBreaker(config -> config
                                            .setName("deptCircuitBreaker")
                                            .setFallbackUri("forward:/fallback/department-service")))
                            .uri("lb://department-service"))

                    .route("project-service", r -> r.path("/api/projects/**")
                            .filters(f -> f
                                    .filter(jwtFilter)
                                    .circuitBreaker(config -> config
                                            .setName("projCircuitBreaker")
                                            .setFallbackUri("forward:/fallback/project-service")))
                            .uri("lb://project-service"))

                    .build();
        }
    }
