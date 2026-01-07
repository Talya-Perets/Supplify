package com.Supplify.Supplify.DTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DeviceTokenRequest{
    private int userId;
    private String deviceToken;

}
