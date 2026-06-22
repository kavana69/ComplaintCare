package com.gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

import com.gateway.filter.JwtFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain filterChain(ServerHttpSecurity http,JwtFilter jwtFilter) {

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                		.pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                		.pathMatchers(
                	            "/users/send-otp",
                	            "/users/verify-register",
                	            "/users/forgot-password/send-otp",
                	            "/users/forgot-password/verify-otp",
                	            "/users/forgot-password/reset",
                	            "chatbot/**"
                	        ).permitAll()
                		
                        .pathMatchers("/auth/**").permitAll()
                        .pathMatchers("/users/**").hasRole("USER")
                        .pathMatchers("/admin/**").permitAll()
                        .anyExchange().authenticated()
                )
                .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
                .build();
    }
}