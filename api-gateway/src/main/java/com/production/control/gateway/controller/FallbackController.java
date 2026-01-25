package com.production.control.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/production-plans")
    public ResponseEntity<Map<String, Object>> productionPlansFallback() {
        return createFallbackResponse("Production Planning Service is temporarily unavailable");
    }

    @GetMapping("/inventory")
    public ResponseEntity<Map<String, Object>> inventoryFallback() {
        return createFallbackResponse("Inventory Management Service is temporarily unavailable");
    }

    @GetMapping("/processes")
    public ResponseEntity<Map<String, Object>> processesFallback() {
        return createFallbackResponse("Process Management Service is temporarily unavailable");
    }

    @GetMapping("/quality")
    public ResponseEntity<Map<String, Object>> qualityFallback() {
        return createFallbackResponse("Quality Management Service is temporarily unavailable");
    }

    @GetMapping("/cost")
    public ResponseEntity<Map<String, Object>> costFallback() {
        return createFallbackResponse("Cost Management Service is temporarily unavailable");
    }

    @GetMapping("/forecast")
    public ResponseEntity<Map<String, Object>> forecastFallback() {
        return createFallbackResponse("Demand Forecasting Service is temporarily unavailable");
    }

    private ResponseEntity<Map<String, Object>> createFallbackResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Service Unavailable");
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now());
        response.put("status", 503);
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
    }
}
