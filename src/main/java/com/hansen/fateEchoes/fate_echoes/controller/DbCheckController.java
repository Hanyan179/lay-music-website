package com.hansen.fateEchoes.fate_echoes.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@RestController
public class DbCheckController {
    @Autowired
    private DataSource dataSource;

    @GetMapping("/db-check")
    public String checkDb() throws SQLException {
        try (Connection conn = dataSource.getConnection()) {
            return "Database connection successful!";
        }
    }
}

