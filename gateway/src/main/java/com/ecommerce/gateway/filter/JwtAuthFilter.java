package com.ecommerce.gateway.filter;

import com.ecommerce.gateway.security.JwtUtil;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<Object> {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        super(Object.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Object config) {
        return (exchange, chain) -> {
            String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.isTokenValid(token)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String email = jwtUtil.extractEmail(token);
            String role = jwtUtil.extractRole(token);
            if (role == null || role.isBlank()) role = "USER";

            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .headers(headers -> { headers.remove("X-User-Email"); headers.remove("X-User-Role"); })
                    .header("X-User-Email", email)
                    .header("X-User-Role", role)
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        };
    }
}