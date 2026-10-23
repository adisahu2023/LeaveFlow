package com.springboot.leaveflow.entity;

import jakarta.persistence.*;
import lombok.Data;




@Entity
@Table(name="Leave_users")
@Data
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;


    @Column(nullable = false)
    private String password;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "manager_id")
    private Users manager;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "mobile_no")
    private long mobile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.EMPLOYEE;

    @Enumerated(EnumType.STRING)
    private Active active=Active.ACTIVE;

    @PrePersist()
    public void setdefaultPass(){
        if(password==null || password.isBlank()){
            password="Pass@123";
        }
    }
}
