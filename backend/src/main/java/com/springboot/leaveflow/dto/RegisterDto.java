package com.springboot.leaveflow.dto;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RegisterDto {

    private String name;
    private String username;
    private String password;
    private long mobile;

}
