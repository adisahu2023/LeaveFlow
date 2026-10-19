package com.springboot.leaveflow.dto;

import com.springboot.leaveflow.entity.LeaveType;
import com.springboot.leaveflow.entity.Status;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class LeaveResponseDto {

    private Long id;
    private String employeeName;
    private String employeeUsername;
    private LeaveType leaveType;
    private String reason;
    private LocalDate startDate;
    private LocalDate endDate;
    private Status status;
    private String adminComment;
    private LocalDateTime createdAt;
    private String reviewedBy;

    public LeaveResponseDto(
            Long id,
            String employeeName,
            String username,
            LeaveType leaveType,
            String reason,
            LocalDate startDate,
            LocalDate endDate,
            Status status,
            String adminComment,
            LocalDateTime createdAt,
            String reviewedBy) {

        this.id = id;
        this.employeeName = employeeName;
        this.employeeUsername = username;
        this.leaveType = leaveType;
        this.reason = reason;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.adminComment = adminComment;
        this.createdAt = createdAt;
        this.reviewedBy = reviewedBy;
    }

    public LeaveResponseDto(
            long id, LocalDate startDate,LocalDate endDate, String reason,
            Status status, String adminComment,LeaveType leaveType, LocalDateTime createdAt,
            String reviewedBy){

        this.id=id;
        this.leaveType = leaveType;
        this.reason = reason;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.adminComment = adminComment;
        this.createdAt = createdAt;
        this.reviewedBy = reviewedBy;

    }
}