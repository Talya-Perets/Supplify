package com.Supplify.Supplify.services;

import com.Supplify.Supplify.entities.Role;
import com.Supplify.Supplify.enums.UserRoleEnum;
import com.Supplify.Supplify.repositories.RoleRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class RoleService {

    private final Logger logger = LoggerFactory.getLogger(RoleService.class);
    private final RoleRepo roleRepo;

    public Role getRoleById(UserRoleEnum roleId) {
        return roleRepo.findById(roleId.getValue()).orElse(null);
    }
}
