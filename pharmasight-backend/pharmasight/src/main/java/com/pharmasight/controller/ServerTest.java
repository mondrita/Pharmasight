package com.pharmasight.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ServerTest {

    @GetMapping("/")
    public ResponseEntity<String> serverTest() {
        try {
            return ResponseEntity.ok("Server is On");
        } catch (Exception e) {
            System.err.println("Error checking server status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal Server Error");
        }
    }
}
