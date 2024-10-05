package com.alexmonteroproject.aestrella;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CaminoMasCortoAestrellaApplication {

	public static void main(String[] args) {
		SpringApplication.run(CaminoMasCortoAestrellaApplication.class, args);
	}

}
