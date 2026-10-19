package com.springboot.leaveflow.dto;

import com.springboot.leaveflow.entity.Active;
import com.springboot.leaveflow.entity.UserRole;
import lombok.Data;

@Data
public class AddUsersDto {

    private String username;
    private String password;
    private String name;
    private long mobile;
    private Active active;
}
