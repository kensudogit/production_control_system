package com.production.control.gateway.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Spring Cloud Gateway用のグローバルエラーハンドラー
 * WebFlux（リアクティブ）環境で動作するため、WebExceptionHandlerを実装
 */
@Component
@Order(-2) // デフォルトのErrorWebExceptionHandlerより優先度を高く設定
public class GlobalExceptionHandler implements ErrorWebExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        DataBufferFactory bufferFactory = exchange.getResponse().bufferFactory();
        
        // 404エラー（NoResourceFoundException）はログに記録しない（正常な動作）
        if (ex instanceof org.springframework.web.reactive.resource.NoResourceFoundException) {
            logger.debug("Resource not found: {}", exchange.getRequest().getPath().value());
            exchange.getResponse().setStatusCode(HttpStatus.NOT_FOUND);
            exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> errorResponse = createErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                "The requested resource was not found",
                exchange.getRequest().getPath().value()
            );
            
            return writeResponse(exchange, bufferFactory, errorResponse);
        }
        
        // その他のエラーはログに記録
        logger.error("Unhandled exception occurred for path: {}", 
            exchange.getRequest().getPath().value(), ex);
        
        HttpStatusCode statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        String error = "Internal Server Error";
        String message = "An unexpected error occurred";
        
        if (ex instanceof ResponseStatusException) {
            ResponseStatusException responseStatusException = (ResponseStatusException) ex;
            statusCode = responseStatusException.getStatusCode();
            HttpStatus status = HttpStatus.resolve(statusCode.value());
            error = status != null ? status.getReasonPhrase() : "Error";
            message = responseStatusException.getReason() != null 
                ? responseStatusException.getReason() 
                : message;
        } else if (ex instanceof IllegalArgumentException) {
            statusCode = HttpStatus.BAD_REQUEST;
            error = "Bad Request";
            message = ex.getMessage();
        }
        
        exchange.getResponse().setStatusCode(statusCode);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        
        int statusValue = statusCode instanceof HttpStatus 
            ? ((HttpStatus) statusCode).value() 
            : statusCode.value();
        
        Map<String, Object> errorResponse = createErrorResponse(
            statusValue,
            error,
            message,
            exchange.getRequest().getPath().value()
        );
        
        return writeResponse(exchange, bufferFactory, errorResponse);
    }
    
    private Map<String, Object> createErrorResponse(int status, String error, String message, String path) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now().toString());
        errorResponse.put("status", status);
        errorResponse.put("error", error);
        errorResponse.put("message", message);
        errorResponse.put("path", path);
        return errorResponse;
    }
    
    private Mono<Void> writeResponse(ServerWebExchange exchange, DataBufferFactory bufferFactory, 
                                     Map<String, Object> errorResponse) {
        try {
            String json = objectMapper.writeValueAsString(errorResponse);
            DataBuffer buffer = bufferFactory.wrap(json.getBytes());
            return exchange.getResponse().writeWith(Mono.just(buffer));
        } catch (JsonProcessingException e) {
            logger.error("Error serializing error response", e);
            DataBuffer buffer = bufferFactory.wrap("{\"error\":\"Internal Server Error\"}".getBytes());
            return exchange.getResponse().writeWith(Mono.just(buffer));
        }
    }
}
