package com.springboot.leaveflow.dto;

import com.springboot.leaveflow.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminProfileResponse {
    private String name;
    private String username;
    private long mobile;
    private UserRole role;
}
