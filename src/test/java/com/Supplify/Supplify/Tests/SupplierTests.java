package com.Supplify.Supplify.Tests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.Supplify.Supplify.DTO.CreateSupplierRequest;
import com.Supplify.Supplify.entities.BusinessSupplier;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.services.SupplierService;
import com.Supplify.Supplify.controllers.SupplierController;
import com.Supplify.Supplify.repositories.BusinessSupplierRepo;
import com.Supplify.Supplify.repositories.SupplierRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class SupplierTests {

    private SupplierRepo mockSupplierRepo;
    private BusinessSupplierRepo mockBusinessSupplierRepo;
    private SupplierService supplierService;
    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockSupplierRepo = Mockito.mock(SupplierRepo.class);
        mockBusinessSupplierRepo = Mockito.mock(BusinessSupplierRepo.class);
        supplierService = new SupplierService(mockSupplierRepo, mockBusinessSupplierRepo);
        SupplierController supplierController = new SupplierController(supplierService, null);
        mockMvc = MockMvcBuilders.standaloneSetup(supplierController).build();
    }

    // --- SupplierService Tests ---

    @Test
    public void testCreateSupplierSuccess() {
        // Mock request
        CreateSupplierRequest request = new CreateSupplierRequest("Test Supplier", 1);

        // Mock supplier entity
        Supplier savedSupplier = new Supplier("Test Supplier");
        savedSupplier.setSupplierId(1);

        when(mockSupplierRepo.saveAndFlush(any(Supplier.class))).thenReturn(savedSupplier);

        // Call method
        Supplier result = supplierService.createSupplier(request);

        // Assertions
        assertNotNull(result);
        assertEquals("Test Supplier", result.getCompanyName());
        verify(mockSupplierRepo, times(1)).saveAndFlush(any(Supplier.class));

        // Verify business-supplier linkage
        //  ArgumentCaptor<BusinessSupplier> captor = ArgumentCaptor.forClass(BusinessSupplier.class);
        //      verify(mockBusinessSupplierRepo, times(1)).save(captor.capture());
        //     assertEquals(1, captor.getValue().getId());
        //   assertEquals(1, captor.getValue().getId());
    }

    @Test
    public void testGetAllSuppliers() {
        // Mock data
        List<Supplier> mockSuppliers = Arrays.asList(
                new Supplier("Supplier A"),
                new Supplier("Supplier B")
        );

        when(mockSupplierRepo.findAll()).thenReturn(mockSuppliers);

        // Call method
        List<Supplier> result = supplierService.getAllSuppliers();

        // Assertions
        assertEquals(2, result.size());
        assertEquals("Supplier A", result.get(0).getCompanyName());
    }

    @Test
    public void testGetSupplierByIdSuccess() {
        Supplier mockSupplier = new Supplier("Supplier X");
        when(mockSupplierRepo.findById(1)).thenReturn(Optional.of(mockSupplier));

        Supplier result = supplierService.getSupplierById(1);

        assertNotNull(result);
        assertEquals("Supplier X", result.getCompanyName());
    }

    @Test
    public void testGetSupplierByIdNotFound() {
        when(mockSupplierRepo.findById(99)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            supplierService.getSupplierById(99);
        });

        assertEquals("Supplier not found", exception.getMessage());
    }

    @Test
    public void testDeleteSupplierSuccess() {
        when(mockSupplierRepo.existsById(1)).thenReturn(true);

        supplierService.deleteSupplier(1);

        verify(mockSupplierRepo, times(1)).deleteById(1);
    }

    @Test
    public void testDeleteSupplierNotFound() {
        when(mockSupplierRepo.existsById(99)).thenReturn(false);

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            supplierService.deleteSupplier(99);
        });

        assertEquals("Supplier not found with ID: 99", exception.getMessage());
    }

    // --- SupplierController Tests ---

    @Test
    public void testCreateSupplierControllerSuccess() throws Exception {
        CreateSupplierRequest request = new CreateSupplierRequest("Test Supplier", 1);

        Supplier createdSupplier = new Supplier("Test Supplier");
        createdSupplier.setSupplierId(1);

        when(mockSupplierRepo.saveAndFlush(any(Supplier.class))).thenReturn(createdSupplier);

        mockMvc.perform(post("/suppliers/createSupplier")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.companyName").value("Test Supplier"));
    }

    @Test
    public void testGetAllSuppliersController() throws Exception {
        List<Supplier> suppliers = Arrays.asList(
                new Supplier("Supplier A"),
                new Supplier("Supplier B")
        );
        when(mockSupplierRepo.findAll()).thenReturn(suppliers);

        mockMvc.perform(get("/suppliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].companyName").value("Supplier A"))
                .andExpect(jsonPath("$[1].companyName").value("Supplier B"));
    }

    @Test
    public void testGetSupplierByIdControllerSuccess() throws Exception {
        Supplier supplier = new Supplier("Supplier X");
        when(mockSupplierRepo.findById(1)).thenReturn(Optional.of(supplier));

        mockMvc.perform(get("/suppliers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.companyName").value("Supplier X"));
    }

    @Test
    public void testDeleteSupplierControllerSuccess() throws Exception {
        when(mockSupplierRepo.existsById(1)).thenReturn(true);

        mockMvc.perform(delete("/suppliers/1"))
                .andExpect(status().isNoContent());

        verify(mockSupplierRepo, times(1)).deleteById(1);
    }
}
