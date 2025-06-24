package com.lay.music.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("LAY音乐网站 API")
                .description("张艺兴音乐网站后端API文档")
                .version("1.0.0")
                .contact(new Contact()
                    .name("LAY音乐团队")
                    .email("admin@laymusic.com")));
    }
} 
 