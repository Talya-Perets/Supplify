package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.Services.SupplierService;
import com.Supplify.Supplify.entities.Supplier;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@AllArgsConstructor
public class SupplierController {
    private final SupplierService supplierService;

    // הוספת ספק חדש לעסק
    @PostMapping("/business/{businessId}")
    public ResponseEntity<Supplier> createSupplier(
            @RequestBody Supplier supplier,
            @PathVariable Integer businessId) {
        return ResponseEntity.ok(supplierService.createSupplier(supplier, businessId));
    }

    // קבלת כל הספקים
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {
        List<Supplier> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    // קבלת ספק לפי ID
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Integer id) {
        return ResponseEntity.ok(supplierService.getSupplierById(id));
    }
}