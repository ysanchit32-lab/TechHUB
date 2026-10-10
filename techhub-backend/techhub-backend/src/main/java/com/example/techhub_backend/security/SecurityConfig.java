package com.example.techhub_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            // Uses the CorsConfigurationSource bean from CorsConfig
            .cors(Customizer.withDefaults())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            // Not logged in (or bad / expired token) -> 401, not 403
            .exceptionHandling(exceptions -> exceptions
                    .authenticationEntryPoint(
                            new HttpStatusEntryPoint(
                                    HttpStatus.UNAUTHORIZED
                            )
                    )
            )

            .authorizeHttpRequests(auth -> auth

                // ==============================
                // AUTHENTICATION
                // ==============================
                .requestMatchers(
                        "/api/auth/**"
                ).permitAll()

                // Uploaded product images are public
                .requestMatchers(
                        HttpMethod.GET,
                        "/uploads/**"
                ).permitAll()

                // ==============================
                // PRODUCTS
                // ==============================

                // Anyone can VIEW products
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/products/**"
                ).permitAll()

                // Only EMPLOYEE can ADD products
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/products/**"
                ).hasRole("EMPLOYEE")

                // Only EMPLOYEE can UPDATE products
                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/products/**"
                ).hasRole("EMPLOYEE")

                // Only EMPLOYEE can DELETE products
                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/products/**"
                ).hasRole("EMPLOYEE")

                // ==============================
                // EMPLOYEE DASHBOARD
                // ==============================
                .requestMatchers(
                        "/api/dashboard/**"
                ).hasRole("EMPLOYEE")

                // ==============================
                // EMPLOYEE TRANSACTIONS
                // ==============================
                .requestMatchers(
                        "/api/transactions/**"
                ).hasRole("EMPLOYEE")

                // ==============================
                // EVERYTHING ELSE
                // ==============================
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
