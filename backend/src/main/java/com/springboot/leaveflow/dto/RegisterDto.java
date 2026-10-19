package com.springboot.leaveflow.dto;

import com.springboot.leaveflow.entity.Active;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RegisterDto {

    private String name;
    private String username;
    private String password;
    private long mobile;
    private Active active=Active.ACTIVE;

}
