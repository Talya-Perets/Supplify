package com.Supplify.Supplify.enums;

import lombok.Getter;

@Getter
public enum UserRoleEnum {
    MANAGER(1),
    EMPLOYEE(2);

    private final int value;

    UserRoleEnum(int value) {
        this.value = value;
    }

}
