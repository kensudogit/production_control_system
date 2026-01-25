package com.production.control.gateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Configuration
public class GatewayConfig {

    /**
     * リクエストIDを追加するグローバルフィルター
     */
    @Bean
    public GlobalFilter requestIdFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String requestId = request.getHeaders().getFirst("X-Request-ID");
            
            if (requestId == null || requestId.isEmpty()) {
                requestId = UUID.randomUUID().toString();
            }
            
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-Request-ID", requestId)
                    .build();
            
            ServerHttpResponse response = exchange.getResponse();
            response.getHeaders().add("X-Request-ID", requestId);
            
            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        };
    }

    /**
     * CORS設定を追加するグローバルフィルター
     */
    @Bean
    public GlobalFilter corsFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            ServerHttpResponse response = exchange.getResponse();
            
            HttpHeaders headers = response.getHeaders();
            headers.add("X-Content-Type-Options", "nosniff");
            headers.add("X-Frame-Options", "DENY");
            headers.add("X-XSS-Protection", "1; mode=block");
            headers.add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            
            return chain.filter(exchange);
        };
    }

    /**
     * レスポンス時間を記録するフィルター
     */
    @Bean
    public GlobalFilter responseTimeFilter() {
        return (exchange, chain) -> {
            long startTime = System.currentTimeMillis();
            
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                long duration = System.currentTimeMillis() - startTime;
                exchange.getResponse().getHeaders().add("X-Response-Time", duration + "ms");
            }));
        };
    }
}
