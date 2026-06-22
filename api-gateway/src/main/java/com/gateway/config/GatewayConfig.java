package com.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r.path("/users/**")
                        .uri("http://localhost:8082"))
                .route("auth-service", r -> r.path("/auth/**")
                        .uri("http://localhost:8081"))
                .route("complaint-service", r -> r.path("/complaints/**")
                        .uri("http://localhost:8083"))
                .route("admin-service", r -> r.path("/admin/**")
                	    .uri("http://localhost:8084"))
                .route("notification-service", r -> r.path("/notifications/**")
                	    .uri("http://localhost:8085"))
                .build();
                 
        
    }
}