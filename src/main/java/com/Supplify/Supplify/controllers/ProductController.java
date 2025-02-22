package com.Supplify.Supplify.controllers;
import com.Supplify.Supplify.DTO.CreateProductRequest;
import com.Supplify.Supplify.services.ProductService;
import com.Supplify.Supplify.entities.Product;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {
    private final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductService productService;

    // Get all products
    @GetMapping("/displayProducts")
    public ResponseEntity<List<Product>> getAllProducts() {
        logger.info("Fetching all products");
         List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Get product by ID
    @GetMapping("/fetchProduct")
    public ResponseEntity<Product> getProductById(@PathVariable String productId) {
        return productService.getProductById(productId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add a new product
    @PostMapping("/createProduct")
    public ResponseEntity<Product> CreateProduct(@RequestBody CreateProductRequest request) {
        try {
            Product createdProduct = productService.addProduct(request);
            logger.info("New Product has added");
            return ResponseEntity.status(201).body(createdProduct);
        } catch (Exception e) {
            logger.error("Error adding product: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    /*
    // Update a product
    @PutMapping("/updateProductById/{productId}") // Added {productId} to match the path variable
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
    @DeleteMapping("/deleteProduct/{productId}") // Added {productId} to match the path variable
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
