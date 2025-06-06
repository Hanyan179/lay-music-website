package com.hansen.fateEchoes.fate_echoes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.hansen.fateEchoes.fate_echoes", "com.fateechoes"})
@EnableJpaRepositories(basePackages = {"com.hansen.fateEchoes.fate_echoes.repository", "com.fateechoes.repository"})
public class FateEchoesApplication {

	public static void main(String[] args) {
		SpringApplication.run(FateEchoesApplication.class, args);
	}

}
