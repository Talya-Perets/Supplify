//package com.Supplify.Supplify.Tests;
//
//import com.Supplify.Supplify.DTO.CreateProductRequest;
//import com.Supplify.Supplify.entities.Product;
//import com.Supplify.Supplify.entities.Supplier;
//
//import com.Supplify.Supplify.services.ProductService;
//import com.Supplify.Supplify.controllers.ProductController;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//import java.util.Collections;
//import java.util.Optional;
//import static org.mockito.Mockito.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@ExtendWith(MockitoExtension.class)
//public class ProductTests {
//
//    private MockMvc mockMvc;
//
//    @Mock
//    private ProductService productService;
//
//    @InjectMocks
//    private ProductController productController;
//
//    private Product product;
//    private Supplier supplier;
//
//    @BeforeEach
//    void setUp() {
//        // Set up MockMvc to test the ProductController
//        mockMvc = MockMvcBuilders.standaloneSetup(productController).build();
//
//        // Create a mock Supplier and Product for testing
//        supplier = new Supplier(1, "Test Supplier");
//        product = new Product("1", supplier, "Test Product", "Description", 100);
//    }
//
//    @Test
//    void testCreateProduct() throws Exception {
//        // Prepare the CreateProductRequest for testing
//        CreateProductRequest request = new CreateProductRequest("1", 1, "Test Product", "Description", 100);
//
//        // Mock the ProductService to return a saved product
//        when(productService.addProduct(any(CreateProductRequest.class))).thenReturn(product);
//
//        mockMvc.perform(post("/product/createProduct")
//                        .contentType("application/json")
//                        .content("{ \"id\": \"1\", \"supplierId\": 1, \"productName\": \"Test Product\", \"productDescription\": \"Description\", \"stock\": 100 }"))
//                .andExpect(status().isCreated())
//                .andExpect(jsonPath("$.productName").value("Test Product"))
//                .andExpect(jsonPath("$.description").value("Description"));
//
//        // Verify that the service method was called once
//        verify(productService, times(1)).addProduct(any(CreateProductRequest.class));
//    }
//
//    @Test
//    void testGetAllProducts() throws Exception {
//        // Mock the ProductService to return a list of products
//        when(productService.getAllProducts()).thenReturn(Collections.singletonList(product));
//
//        mockMvc.perform(get("/product/displayProducts"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].productName").value("Test Product"))
//                .andExpect(jsonPath("$[0].description").value("Description"));
//
//        // Verify that the service method was called once
//        verify(productService, times(1)).getAllProducts();
//    }
//
//    @Test
//    void testGetProductById() throws Exception {
//        // Mock the ProductService to return a product by ID
//        when(productService.getProductById("1")).thenReturn(Optional.of(product));
//
//        mockMvc.perform(get("/product/getProductById/1"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.productName").value("Test Product"))
//                .andExpect(jsonPath("$.description").value("Description"));
//
//        // Verify that the service method was called once
//        verify(productService, times(1)).getProductById("1");
//    }
//
//    @Test
//    void testUpdateProduct() throws Exception {
//        // Prepare an updated product
//        Product updatedProduct = new Product("1", supplier, "Updated Product", "Updated Description", 200);
//
//        // Mock the ProductService to return the updated product
//        when(productService.updateProduct(eq(1), any(Product.class))).thenReturn(updatedProduct);
//
//        mockMvc.perform(put("/product/updateProductById/1")
//                        .contentType("application/json")
//                        .content("{ \"id\": \"1\", \"supplier\": { \"supplierId\": 1 }, \"productName\": \"Updated Product\", \"description\": \"Updated Description\", \"stock\": 200 }"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.productName").value("Updated Product"))
//                .andExpect(jsonPath("$.description").value("Updated Description"));
//
//        // Verify that the service method was called once
//        verify(productService, times(1)).updateProduct(eq(1), any(Product.class));
//    }
//
//    @Test
//    void testDeleteProduct() throws Exception {
//        // Mock the ProductService to delete a product
//        doNothing().when(productService).deleteProduct("1");
//
//        mockMvc.perform(delete("/product/deleteProduct/1"))  // Correct the URL to match controller
//                .andExpect(status().isNoContent());
//        // Verify that the service method was called once
//        verify(productService, times(1)).deleteProduct("1");
//    }
//
//    @Test
//    void testProductNotFound() throws Exception {
//        // Mock the ProductService to return an empty Optional for a non-existing product
//        when(productService.getProductById("99")).thenReturn(Optional.empty());
//
//        mockMvc.perform(get("/product/getProductById/99"))
//                .andExpect(status().isNotFound());
//
//        // Verify that the service method was called once
//        verify(productService, times(1)).getProductById(99);
//    }
//}
