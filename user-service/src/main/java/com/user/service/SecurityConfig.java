package com.user.service;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
            		.requestMatchers(
            		        "/v3/api-docs/**",
            		        "/swagger-ui/**",
            		        "/swagger-ui.html"
            		).permitAll()
            	    .requestMatchers(
            	        "/users/register",
            	        "/users/send-otp",
            	        "/users/verify-register",

            	        "/users/forgot-password/send-otp",
            	        "/users/forgot-password/verify-otp",
            	        "/users/forgot-password/reset"

            	    ).permitAll()
                // other public APIs
                .requestMatchers("/auth/**").permitAll()
                // allow everything for now
                .anyRequest().permitAll()
            )
            .formLogin(form -> form.disable());
        return http.build();
    }
}