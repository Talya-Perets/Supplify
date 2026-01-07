package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.CreateProductRequest;
import com.Supplify.Supplify.services.ProductService;
import com.Supplify.Supplify.entities.Product;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("product")
@RequiredArgsConstructor
public class ProductController {
    private final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;
    private final ObjectMapper objectMapper;

    // Get all products
    @GetMapping("displayProducts")
    public ResponseEntity<List<Product>> getAllProducts() {
        logger.info("Fetching all products");
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Get product by ID
    @GetMapping("fetchProduct") // Added {productId} to match the path variable
    public ResponseEntity<Product> getProductById(@PathVariable String productId) {
        return productService.getProductById(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add a new product
    @PostMapping("createProduct")
    public ResponseEntity<?> CreateProduct(@RequestParam("request") String requestJson, @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            logger.info("Creating a new product");
            CreateProductRequest request = objectMapper.readValue(requestJson, CreateProductRequest.class);

            String imageUrl = null;
            if (file != null) {
                imageUrl = productService.saveImage(file); // Save the image if it exists
            }

            productService.addProduct(request, imageUrl); // Add product, with or without image URL

            return ResponseEntity.ok("Product created successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }


    /*
    // Update a product
    @PutMapping("updateProductById/{productId}") // Added {productId} to match the path variable
    public ResponseEntity<?> updateProduct(@PathVariable int productId, @RequestBody Product updatedProduct) {
        try {
            Product product = productService.updateProduct(productId, updatedProduct);
            return ResponseEntity.ok(product);
        } catch (IllegalArgumentException e) {
            logger.warn("Product not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error updating product: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error updating product");
        }
    }


     */
    // Delete a product
    @DeleteMapping("deleteProduct/{productId}") // Added {productId} to match the path variable
    public ResponseEntity<?> deleteProduct(@PathVariable String productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            logger.warn("Product not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error deleting product: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error deleting product");
        }
    }
}
