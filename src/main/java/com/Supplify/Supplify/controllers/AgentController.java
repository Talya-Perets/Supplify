package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.SupplierDetailsResponse;
import com.Supplify.Supplify.DTO.CreateAgentRequest;
import com.Supplify.Supplify.services.AgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private final AgentService agentService;

    public AgentController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addAgent(@RequestBody(required = false) CreateAgentRequest request) {
        if (request == null) {
            return ResponseEntity.badRequest().body("Request body is null");
        }

        System.out.println("Received request: " + request.getName());
        agentService.createAgent(request);
        return ResponseEntity.ok("Agent added successfully");
    }
//    @GetMapping("/business/{businessId}")
//    public ResponseEntity<Map<String, Object>> getAgentsByBusinessId(@PathVariable int businessId) {
//        List<SupplierDetailsResponse> agents = agentService.getAgentsByBusinessId(businessId);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("success", true);
//        response.put("businessId", businessId);
//        response.put("agents", agents);
//
//        return ResponseEntity.ok(response);
//    }


}
