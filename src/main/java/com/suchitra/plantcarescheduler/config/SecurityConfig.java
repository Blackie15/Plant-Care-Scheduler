// package com.suchitra.plantcarescheduler.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

//         http
//                 .csrf(csrf -> csrf.disable())

//                 .authorizeHttpRequests(auth -> auth

//                         // Public APIs
//                         .requestMatchers(
//                                 "/api/users/register",
//                                 "/swagger-ui/**",
//                                 "/v3/api-docs/**",
//                                 "/swagger-ui.html")
//                         .permitAll()

//                         // Everything else requires authentication
//                         .anyRequest().authenticated())

//                 // Enable HTTP Basic Authentication
//                 .httpBasic(Customizer.withDefaults());

//         return http.build();
//     }
// }