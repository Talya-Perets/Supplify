package com.Supplify.Supplify.services;
import com.Supplify.Supplify.DTO.CreateProductRequest;
import com.Supplify.Supplify.entities.Product;
import com.Supplify.Supplify.repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepo productRepository;

    @Autowired
    public ProductService(ProductRepo productRepository) {
        this.productRepository = productRepository;
    }

    // Retrieve all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Retrieve a product by ID
    public Optional<Product> getProductById(int productId) {
        return productRepository.findById(productId);
    }

    // Add a new product
    public Product addProduct(CreateProductRequest request) {
        return productRepository.saveAndFlush(new Product(
                request.getId(),
                request.getSupplierId(),
                request.getProductName(),
                request.getProductDescription()));
    }

    // Update an existing product
    public Product updateProduct(int productId, Product updatedProduct) {
        return productRepository.findById(productId)
                .map(product -> {
                    product.setSupplierId(updatedProduct.getSupplierId());
                    product.setProductName(updatedProduct.getProductName());
                    product.setDescription(updatedProduct.getDescription());
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new IllegalArgumentException("Product with ID " + productId + " not found"));
    }

    // Delete a product by ID
    public void deleteProduct(int productId) {
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product with ID " + productId + " not found");
        }
        productRepository.deleteById(productId);
    }
}
