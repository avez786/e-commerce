package com.ecommerce.product.controller;

import com.ecommerce.product.dto.*;
import com.ecommerce.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestHeader(value = "X-User-Role", required = false) String role, @RequestBody ProductRequest request) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @RequestHeader(value = "X-User-Role", required = false) String role, @RequestBody ProductRequest request) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, @RequestHeader(value = "X-User-Role", required = false) String role) {
        if (!"ADMIN".equals(role)) return ResponseEntity.status(403).build();
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{productId}/reviews")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long productId,
            @RequestHeader("X-User-Email") String userEmail,
            @RequestBody ReviewRequest request) {
        return ResponseEntity.ok(productService.addReview(productId, userEmail, request));
    }

    @GetMapping("/{productId}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getReviewsForProduct(productId));
    }

    @GetMapping("/{productId}/reviews/summary")
    public ResponseEntity<ReviewSummary> getReviewSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.getReviewSummary(productId));
    }
}