package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductRequest;
import com.ecommerce.product.dto.ProductResponse;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.ecommerce.product.dto.ReviewRequest;
import com.ecommerce.product.dto.ReviewResponse;
import com.ecommerce.product.dto.ReviewSummary;
import com.ecommerce.product.model.Review;
import com.ecommerce.product.repository.ReviewRepository;

import java.time.LocalDateTime;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;

    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .build();

        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return toResponse(product);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setStockQuantity(request.getStockQuantity());

        Product updated = productRepository.save(product);
        return toResponse(updated);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getImageUrl()
        );
    }
    public ReviewResponse addReview(Long productId, String userEmail, ReviewRequest request) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        if (request == null || request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (request.getComment() != null && request.getComment().length() > 1000) {
            throw new IllegalArgumentException("Review comment must be 1000 characters or fewer");
        }

        Review review = Review.builder()
                .productId(productId)
                .userEmail(userEmail)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        Review saved = reviewRepository.save(review);
        return toReviewResponse(saved);
    }

    public List<ReviewResponse> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductId(productId)
                .stream()
                .map(this::toReviewResponse)
                .toList();
    }

    public ReviewSummary getReviewSummary(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);

        if (reviews.isEmpty()) {
            return new ReviewSummary(0.0, 0);
        }

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        return new ReviewSummary(Math.round(average * 10.0) / 10.0, reviews.size());
    }

    private ReviewResponse toReviewResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getProductId(),
                review.getUserEmail(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}