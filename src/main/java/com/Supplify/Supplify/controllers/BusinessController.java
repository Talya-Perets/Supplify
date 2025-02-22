package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.SupplierDetailsResponse;
import com.Supplify.Supplify.services.BusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("business")
public class BusinessController {

    private final BusinessService businessService;

    @GetMapping("getBusinessSuppliers/{businessId}")
    public ResponseEntity<List<SupplierDetailsResponse>> getBusinessSuppliers(@PathVariable int businessId) throws Exception {
        return new ResponseEntity<>(businessService.getBusinessSuppliersDetails(businessId), HttpStatus.OK);
    }

}
