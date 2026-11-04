package com.ecommerce.order.controller;

import com.ecommerce.order.dto.OrderRequest;
import com.ecommerce.order.dto.OrderResponse;
import com.ecommerce.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestHeader("X-User-Email") String userEmail,
            @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(userEmail, request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id, @RequestHeader("X-User-Email") String userEmail) {
        return ResponseEntity.ok(orderService.getOrderById(id, userEmail));
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(@PathVariable Long id, @RequestParam String status,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}