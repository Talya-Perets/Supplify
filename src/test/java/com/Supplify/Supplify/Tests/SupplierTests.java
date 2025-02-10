package com.Supplify.Supplify.Tests;
import com.Supplify.Supplify.controllers.SupplierController;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.repositories.SupplierRepo;
import com.Supplify.Supplify.repositories.BusinessSupplierRepo;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class SupplierTests {
/*
    @Test
    public void testCreateSupplier() {
        // Set up mock repositories
        SupplierRepo mockSupplierRepo = Mockito.mock(SupplierRepo.class);
        BusinessSupplierRepo mockBusinessSupplierRepo = Mockito.mock(BusinessSupplierRepo.class);

        // Set up the service with mock repositories
        SupplierService supplierService = new SupplierService(mockSupplierRepo, mockBusinessSupplierRepo);

        // Create a new supplier
        Supplier supplier = new Supplier();
        supplier.setCompanyName("Test Supplier");
        supplier.setContactPerson("John Doe");
        supplier.setEmail("test@example.com");
        supplier.setPhone("1234567890");

        // Mock the save behavior
        when(mockSupplierRepo.save(supplier)).thenReturn(supplier);

        // Business ID to associate with the supplier
        Integer businessId = 1;

        // Call the method
        Supplier createdSupplier = supplierService.createSupplier(supplier, businessId);

        // Verify if the supplier was saved and business-supplier relationship created
        verify(mockSupplierRepo, times(1)).save(supplier);
        verify(mockBusinessSupplierRepo, times(1)).save(any());

        // Assert that the created supplier is the one returned
        assertEquals(supplier, createdSupplier);
    }

    @Test
    public void testGetAllSuppliers() {
        // Set up mock repository
        SupplierRepo mockSupplierRepo = Mockito.mock(SupplierRepo.class);

        // Create a list of suppliers to return
        Supplier supplier1 = new Supplier();
        supplier1.setCompanyName("Supplier 1");

        Supplier supplier2 = new Supplier();
        supplier2.setCompanyName("Supplier 2");

        List<Supplier> suppliers = Arrays.asList(supplier1, supplier2);

        // Mock the findAll behavior
        when(mockSupplierRepo.findAll()).thenReturn(suppliers);

        // Set up the service with mock repository
        SupplierService supplierService = new SupplierService(mockSupplierRepo, null);

        // Call the method
        List<Supplier> result = supplierService.getAllSuppliers();

        // Verify if the method interacted with the repository
        verify(mockSupplierRepo, times(1)).findAll();

        // Assert the result
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Supplier 1", result.get(0).getCompanyName());
        assertEquals("Supplier 2", result.get(1).getCompanyName());
    }

    @Test
    public void testCreateSupplierValidationFailed() {
        // Set up mock service
        SupplierService mockSupplierService = Mockito.mock(SupplierService.class);

        Supplier invalidSupplier = new Supplier();
        invalidSupplier.setContactPerson("John Doe");
        invalidSupplier.setEmail("invalidemail");
        invalidSupplier.setPhone("1234567890");

        // Create the controller with the mock service
        SupplierController supplierController = new SupplierController(mockSupplierService, null);

        // Call the controller method
        ResponseEntity<?> response = supplierController.createSupplier(invalidSupplier, 1);

        // Assert that the response has a bad request status and a validation message
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("Supplier company name is required"));
    }

    @Test
    public void testCreateSupplierSuccessfully() {
        // Set up mock service
        SupplierService mockSupplierService = Mockito.mock(SupplierService.class);

        // Create a valid supplier
        Supplier validSupplier = new Supplier();
        validSupplier.setCompanyName("Valid Supplier");
        validSupplier.setContactPerson("John Doe");
        validSupplier.setEmail("valid@example.com");
        validSupplier.setPhone("1234567890");

        // Mock the service method
        when(mockSupplierService.createSupplier(validSupplier, 1)).thenReturn(validSupplier);

        // Create the controller with the mock service
        SupplierController supplierController = new SupplierController(mockSupplierService, null);

        // Call the controller method
        ResponseEntity<?> response = supplierController.createSupplier(validSupplier, 1);

        // Assert that the response is a success
        assertEquals(201, response.getStatusCodeValue());
        assertEquals(validSupplier, response.getBody());
    }

    @Test
    public void testGetSuppliersByBusinessId() {
        // Set up mock repositories
        SupplierRepo mockSupplierRepo = Mockito.mock(SupplierRepo.class);
        BusinessSupplierRepo mockBusinessSupplierRepo = Mockito.mock(BusinessSupplierRepo.class);

        // Create sample suppliers
        Supplier supplier1 = new Supplier();
        supplier1.setCompanyName("Supplier 1");
        supplier1.setSupplierId(1);

        Supplier supplier2 = new Supplier();
        supplier2.setCompanyName("Supplier 2");
        supplier2.setSupplierId(2);

        // Mock the behavior of businessSupplierRepo to return supplier IDs for a business ID
        Integer businessId = 1;
        when(mockBusinessSupplierRepo.findSupplierIdsByBusinessId(businessId))
                .thenReturn(Arrays.asList(1, 2));

        // Mock the behavior of supplierRepo to return suppliers by their IDs
        when(mockSupplierRepo.findById(1)).thenReturn(Optional.of(supplier1));
        when(mockSupplierRepo.findById(2)).thenReturn(Optional.of(supplier2));

        // Set up the service with mock repositories
        SupplierService supplierService = new SupplierService(mockSupplierRepo, mockBusinessSupplierRepo);

        // Call the method to get suppliers for the given businessId
        List<Supplier> suppliers = supplierService.getSuppliersByBusinessId(businessId);

        // Verify that the methods were called correctly
        verify(mockBusinessSupplierRepo, times(1)).findSupplierIdsByBusinessId(businessId);
        verify(mockSupplierRepo, times(1)).findById(1);
        verify(mockSupplierRepo, times(1)).findById(2);

        // Assert the result
        assertNotNull(suppliers);
        assertEquals(2, suppliers.size());
        assertEquals("Supplier 1", suppliers.get(0).getCompanyName());
        assertEquals("Supplier 2", suppliers.get(1).getCompanyName());
    }

 */
}

