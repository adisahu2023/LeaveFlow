package com.springboot.leaveflow.dto;

import com.springboot.leaveflow.entity.Active;
import com.springboot.leaveflow.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeProfileResponse {
    private String manager;
    private long mobile;
    private String name;
    private UserRole role;
    private String username;
    private Active active;
}
