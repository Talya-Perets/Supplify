package com.Supplify.Supplify.controllers;

import com.Supplify.Supplify.DTO.SupplierDetailsResponse;
import com.Supplify.Supplify.DTO.CreateAgentRequest;
import com.Supplify.Supplify.services.AgentService;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RequiredArgsConstructor
@RestController
@RequestMapping("agents")
public class AgentController {

    private final AgentService agentService;
    private final Logger logger = LogManager.getLogger(AgentController.class);

    @PostMapping("addAgent")
    public ResponseEntity<?> addAgent(@RequestBody CreateAgentRequest request) throws Exception {
        logger.info("Starting add agent request for business with id: {}", request.getBusinessId());

        try {
            agentService.createAgent(request);
        } catch (Exception e) {
            logger.error("Failed to create new agent {}", e.getMessage());
            throw new Exception(e);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }


}
