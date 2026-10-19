package com.springboot.leaveflow.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Leaves {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;


    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false,length = 20)
    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;




    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(length = 500)
    private String adminComment;


    private LocalDateTime createdAt;

    private String reviewedBy;

    @PrePersist
    void onCreate() {
        this.createdAt=LocalDateTime.now();

    }
}
