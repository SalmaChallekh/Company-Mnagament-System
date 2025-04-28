package org.pfe.cmsservices.config;

import feign.Logger;
import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // Add any required headers here
            String authHeader = RequestContextHolder.getRequestAttributes() != null ?
                    ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                            .getRequest().getHeader("Authorization") :
                    "";
            requestTemplate.header("Authorization", authHeader);
        };
    }
}