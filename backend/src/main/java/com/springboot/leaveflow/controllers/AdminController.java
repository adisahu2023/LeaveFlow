package com.springboot.leaveflow.controllers;

import com.springboot.leaveflow.dto.AddUsersDto;
import com.springboot.leaveflow.dto.AdminProfileResponse;
import com.springboot.leaveflow.dto.AdminUserResponse;
import com.springboot.leaveflow.dto.LeaveResponseDto;
import com.springboot.leaveflow.dto.UpdateRole;
import com.springboot.leaveflow.dto.UpdateAdminProfileRequest;
import com.springboot.leaveflow.entity.Active;
import com.springboot.leaveflow.entity.Status;
import com.springboot.leaveflow.serives.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/profile")
    public ResponseEntity<AdminProfileResponse> getProfile(Authentication auth) {
        return ResponseEntity.ok(adminService.getAdminProfile(auth));
    }

    @PutMapping("/profile")
    public ResponseEntity<AdminProfileResponse> updateProfile(
            @RequestBody UpdateAdminProfileRequest request, Authentication auth) {
        return ResponseEntity.ok(adminService.updateAdminProfile(request, auth));
    }

    // users related APIs

    @PostMapping("/user")
    public ResponseEntity<String> addUsers(@RequestBody AddUsersDto user){
        adminService.addUser(user);
         return  ResponseEntity.ok("User created ");
    }


    @PutMapping("/user/{id}")
    public ResponseEntity<String> assignRole(@RequestBody UpdateRole role, @PathVariable long id){
        adminService.assignRole(id, role.getRole());
        return  ResponseEntity.ok("Role updated ");
    }


    @PutMapping("/employee/{employeeId}/manager/{managerId}")
    public ResponseEntity<String> assignManager(
            @PathVariable Long employeeId,
            @PathVariable Long managerId) {

        adminService.assignManager(employeeId, managerId);

        return ResponseEntity.ok(
                "Manager assigned successfully"
        );
    }


    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers(){
        return ResponseEntity.ok(adminService.getAllUsers());
    }


    @PutMapping("/user/{id}/active")
    public ResponseEntity<String> setActive(@RequestParam Active active, @PathVariable long id) {
        adminService.setActive(active,id);
        return ResponseEntity.ok("Status Updated");
    }


    // leaves related APIs

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveResponseDto>> getLeaves(@RequestParam(required = false) Status status){
        return ResponseEntity.ok(adminService.getLeaves(status));

    }




}
