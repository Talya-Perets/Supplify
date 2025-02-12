package com.Supplify.Supplify.services;
import com.Supplify.Supplify.DTO.CreateProductRequest;
import com.Supplify.Supplify.entities.Product;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.repositories.ProductRepo;
import com.Supplify.Supplify.repositories.SupplierRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepo productRepository;
    private final SupplierRepo supplierRepo;

    @Autowired
    public ProductService(ProductRepo productRepository, SupplierRepo supplierRepo) {
        this.productRepository = productRepository;
        this.supplierRepo = supplierRepo;
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

        Supplier supplier = supplierRepo.findById(request.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Supplier ID " + request.getSupplierId() + " does not exist."));

        return productRepository.saveAndFlush(new Product(
                request.getId(),
                supplier,
                request.getProductName(),
                request.getProductDescription(),
                request.getStock()
        ));
    }

    // Update an existing product
    public Product updateProduct(int productId, Product updatedProduct) {
        return productRepository.findById(productId)
                .map(product -> {
                    product.setSupplier(updatedProduct.getSupplier());
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
