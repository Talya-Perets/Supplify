package com.Supplify.Supplify.repositories;
import com.Supplify.Supplify.entities.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepo extends JpaRepository<Agent, Integer> {
    Agent findAgentById(int supplierId);
}
