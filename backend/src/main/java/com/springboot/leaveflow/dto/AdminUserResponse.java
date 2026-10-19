package com.springboot.leaveflow.dto;

import com.springboot.leaveflow.entity.Active;
import com.springboot.leaveflow.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String username;
    private String name;
    private long mobile;
    private UserRole role;
    private Active active;
    private Long managerId;
    private String managerName;
}
