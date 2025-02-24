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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ProductService {

    private final ProductRepo productRepository;
    private final SupplierRepo supplierRepo;
    private final BusinessRepo businessRepo;
    private final BusinessProductRepo businessProductRepo;


    // Retrieve all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Retrieve a product by ID
    public Optional<Product> getProductById(String productId) {
        return productRepository.findById(productId);
    }

    public String saveImage(MultipartFile file) throws IOException {

        String uploadDir = "src/main/resources/static/uploads/";
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }


        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, filename);

        Files.write(filePath, file.getBytes());

        return "/uploads/" + filename;
    }

    // Add a new product
    public void addProduct(CreateProductRequest request, String imageUrl) {

        // Check if product already exists
        if (productRepository.existsById(request.getId())) {
            throw new IllegalArgumentException("Product with ID " + request.getId() + " already exists.");
        }

        // Find supplier
        Supplier supplier = supplierRepo.findById(request.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Supplier ID " + request.getSupplierId() + " does not exist."));

        // Save the product first
        Product product = productRepository.saveAndFlush(new Product(
                request.getId(),
                supplier,
                request.getProductName(),
                request.getProductDescription()
        ));

        // Find business
        Business business = businessRepo.findById(request.getBusinessId())
                .orElseThrow(() -> new IllegalArgumentException("Business ID " + request.getBusinessId() + " does not exist."));

        // Check if the product is already linked to the business
        BusinessProduct.BusinessProductId businessProductId = new BusinessProduct.BusinessProductId(business.getId(), product.getId());
        if (businessProductRepo.existsById(businessProductId)) {
            throw new IllegalArgumentException("Product is already linked to this business.");
        }

        // Save BusinessProduct (linking Business, Product, and Price)
        BusinessProduct businessProduct = new BusinessProduct(
                businessProductId,
                business,
                product,
                request.getPrice(),
                request.getStock(),
                imageUrl
        );

        businessProductRepo.saveAndFlush(businessProduct);
    }


    // Delete a product by ID
    public void deleteProduct(String productId) {
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product with ID " + productId + " not found");
        }
        productRepository.deleteById(productId);
    }
}
