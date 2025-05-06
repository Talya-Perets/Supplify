package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.BusinessProductDTO;
import com.Supplify.Supplify.DTO.CreateUserRequest;
import com.Supplify.Supplify.DTO.SupplierDetailsResponse;
import com.Supplify.Supplify.entities.Agent;
import com.Supplify.Supplify.entities.Product;
import com.Supplify.Supplify.entities.Supplier;
import com.Supplify.Supplify.services.BusinessService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("business")
public class BusinessController {

    private final BusinessService businessService;
    private final Logger logger = LogManager.getLogger(BusinessController.class);

    @GetMapping("getBusinessSuppliersAndAgents/{businessId}")
    public ResponseEntity<List<SupplierDetailsResponse>> getBusinessSuppliersAndAgents(@PathVariable int businessId) throws Exception {
        return new ResponseEntity<>(businessService.getBusinessSuppliersDetails(businessId), HttpStatus.OK);
    }

    @GetMapping("getBusinessSuppliers/{businessID}")
    public ResponseEntity<List<Supplier>> getBusinessSuppliers(@PathVariable int businessID) throws Exception {
        return new ResponseEntity<>(businessService.getBusinessSuppliers(businessID), HttpStatus.OK);
    }

    @PostMapping("deleteSupplierFromBusiness/{businessId}")
    public ResponseEntity<String> removeAgentAndProducts(
            @PathVariable int businessId,
            @RequestBody int agentId) throws Exception {

        businessService.removeAgentAndRelatedProducts(businessId, agentId);
        return ResponseEntity.ok("Agent and related products removed successfully");
    }

    @PostMapping("updateAgent/{businessId}")
    public ResponseEntity<?> updateAgent(
            @PathVariable int businessId,
            @RequestBody Agent updatedAgent) throws Exception {
        logger.info("Started Updating agent request for business with id: {}", businessId);
        businessService.updateAgent(businessId, updatedAgent);
        logger.info("Updating agent request finished successfully for business with id: {}", businessId);
        return ResponseEntity.ok("Agent updated successfully");
    }

    @GetMapping("getBusinessProducts/{businessId}")
    public ResponseEntity<List<BusinessProductDTO>> getBusinessProducts(@PathVariable int businessId) throws Exception {
        logger.info("Started getBusinessProducts request for business with id: {}", businessId);
        return new ResponseEntity<>(businessService.getBusinessProducts(businessId), HttpStatus.OK);
    }
}
