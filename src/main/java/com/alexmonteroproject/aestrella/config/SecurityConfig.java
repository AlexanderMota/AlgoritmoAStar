package com.alexmonteroproject.aestrella.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    	
        http
            .authorizeHttpRequests(authorizeHttpRequests ->
                authorizeHttpRequests
                    .requestMatchers("/css/**", "/js/**", "/images/**", "/icons/**", "/", "/hello", "/aestrella1", "/aestrella2", "/aestrella3", "/aestrella4", "/aestrella5").permitAll() // Permite acceso sin autenticación
                    .anyRequest().authenticated() // Requiere autenticación para otras rutas
            )
            .formLogin(formLogin ->
                formLogin
                    .loginPage("/login") // Página de login personalizada
                    .permitAll() // Permite el acceso a la página de login
            )
            .logout(logout ->
                logout.permitAll() // Permite el logout sin autenticación
            );
        return http.build();
    }
    
}