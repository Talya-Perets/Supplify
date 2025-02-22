package com.Supplify.Supplify.services;
import com.Supplify.Supplify.DTO.CreateProductRequest;
import com.Supplify.Supplify.entities.Business;
import com.Supplify.Supplify.entities.BusinessProduct;
import com.Supplify.Supplify.entities.Product;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.repositories.BusinessProductRepo;
import com.Supplify.Supplify.repositories.BusinessRepo;
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
    private final BusinessRepo businessRepo;
    private final BusinessProductRepo businessProductRepo;


    @Autowired
    public ProductService(ProductRepo productRepository, SupplierRepo supplierRepo, BusinessRepo businessRepo, BusinessProductRepo businessProductRepo) {
        this.productRepository = productRepository;
        this.supplierRepo = supplierRepo;
        this.businessRepo = businessRepo;
        this.businessProductRepo = businessProductRepo;
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

        // Find supplier
        Supplier supplier = supplierRepo.findById(request.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Supplier ID " + request.getSupplierId() + " does not exist."));

        // Save the product first
        Product product = productRepository.saveAndFlush(new Product(
                request.getId(),
                supplier,
                request.getProductName(),
                request.getProductDescription(),
                request.getStock()
        ));

        Business business = businessRepo.findById(request.getBusinessId())
                .orElseThrow(() -> new IllegalArgumentException("Business ID " + request.getBusinessId() + " does not exist."));

        // Save BusinessProduct (linking Business, Product, and Price)
        BusinessProduct businessProduct = new BusinessProduct(
                new BusinessProduct.BusinessProductId(business.getId(), product.getId()), // ✅ Use composite key
                business,
                product,
                request.getPrice()
        );
        businessProductRepo.saveAndFlush(businessProduct); // ✅ Save the link with price
        return product;
    }



    // Delete a product by ID
    public void deleteProduct(int productId) {
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product with ID " + productId + " not found");
        }
        productRepository.deleteById(productId);
    }
}
