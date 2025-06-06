package com.hansen.fateEchoes.fate_echoes;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
	"com.hansen.fateEchoes.fate_echoes", 
	"com.fateechoes"
})
@EntityScan(basePackages = {
	"com.hansen.fateEchoes.fate_echoes.entity",
	"com.hansen.fateEchoes.fate_echoes.model",
	"com.fateechoes.entity"
})
@EnableJpaRepositories(basePackages = {
	"com.hansen.fateEchoes.fate_echoes.repository",
	"com.fateechoes.repository"
})
public class FateEchoesApplication {

	public static void main(String[] args) {
		SpringApplication.run(FateEchoesApplication.class, args);
	}

}
