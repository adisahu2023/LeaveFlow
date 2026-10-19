package com.springboot.leaveflow.dto;

import com.springboot.leaveflow.entity.LeaveType;
import com.springboot.leaveflow.entity.Users;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AddLeaveDto {

    private Users user;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LocalDateTime createdAt;
    private LeaveType leaveType;

}
