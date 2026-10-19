package com.springboot.leaveflow.dto;

import com.springboot.leaveflow.entity.Active;
import com.springboot.leaveflow.entity.LeaveType;
import com.springboot.leaveflow.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class EmployeeResponse {


    private Long id;

    private LocalDate startDate;

    private LocalDate endDate;


    private String reason;

    private Status status = Status.PENDING;


    private String adminComment;

    private LeaveType leaveType;


    private LocalDateTime createdAt;

    private String reviewedBy;
    private Active active;
}
